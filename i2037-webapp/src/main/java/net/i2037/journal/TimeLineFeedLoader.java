package net.i2037.journal;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;

import org.springframework.beans.factory.annotation.Required;

import net.i2037.journal.model.TimeLineEntry;
import net.i2037.journal.model.TimeLineEntryDao;

public class TimeLineFeedLoader {

	private ExecutorService executorService;
	private Collection<TimeLineFeed> timeLineFeeds;
	private TimeLineEntryDao timeLineEntryDao;
	private final Comparator<? super TimeLineEntry> timeLineEntryComparator;
	
	public TimeLineFeedLoader() {
		timeLineEntryComparator = new TimeLineEntryComparator();
	}
	
	public List<TimeLineEntry> load(Date start, Date end) throws InterruptedException {
		if (start == null || end == null) {
			throw new IllegalArgumentException("start and end time must not be null");
		}
		return doLoad(start, end);		
	}
	
	private List<TimeLineEntry> doLoad(final Date start, final Date end) throws InterruptedException {		
		CompletionService<Collection<TimeLineEntry>> ecs = loadEntries(start, end);
		
		Set<TimeLineEntry> existingEntries = loadExistingEntries(start, end);
		
		List<TimeLineEntry> entries = new ArrayList<TimeLineEntry>();
		int n = timeLineFeeds.size();
		for (int i=0; i < n; ++i) {
			Collection<TimeLineEntry> feedResults;
			try {
				feedResults = ecs.take().get();
			} catch (ExecutionException e) {
				throw new FeedException(e.getCause());
			}
			for (TimeLineEntry entry : feedResults) {
				// if existing entries didn't contain it then we need to create it
				if (!existingEntries.remove(entry)) {
					timeLineEntryDao.create(entry);
				} 
			}
			entries.addAll(feedResults);
		}
		
		// delete any remaining entries that no longer exist in the feed
		for (TimeLineEntry orphan : existingEntries) {
			timeLineEntryDao.delete(orphan);
		}
		
		sortEntries(entries);
		
		return entries;
	}

	private Set<TimeLineEntry> loadExistingEntries(final Date start,
			final Date end) {
		Set<TimeLineEntry> existingEntries = new HashSet<TimeLineEntry>();
		for (TimeLineEntry entry : timeLineEntryDao.queryByDateRange(start, end)) {
			existingEntries.add(entry);
		}
		return existingEntries;
	}

	private CompletionService<Collection<TimeLineEntry>> loadEntries(final Date start, final Date end) {
		CompletionService<Collection<TimeLineEntry>> ecs = newCompletionService();
		for (final TimeLineFeed feed : getTimeLineFeeds()) {			
			ecs.submit(new Callable<Collection<TimeLineEntry>>() {
				@Override
				public Collection<TimeLineEntry> call() throws Exception {
					return feed.load(start, end);
				}
			});
		}
		return ecs;
	}

	private void sortEntries(List<TimeLineEntry> entries) {
		Collections.sort(entries, timeLineEntryComparator);
	}

	private CompletionService<Collection<TimeLineEntry>> newCompletionService() {
		return new ExecutorCompletionService<Collection<TimeLineEntry>>(getExecutorService());
	}

	public TimeLineEntryDao getTimeLineEntryDao() {
		return timeLineEntryDao;
	}

	@Required
	public void setTimeLineEntryDao(TimeLineEntryDao timeLineEntryDao) {
		this.timeLineEntryDao = timeLineEntryDao;
	}

	public ExecutorService getExecutorService() {
		return executorService;
	}

	@Required
	public void setExecutorService(ExecutorService executorService) {
		this.executorService = executorService;
	}

	public Collection<TimeLineFeed> getTimeLineFeeds() {
		return timeLineFeeds;
	}

	@Required
	public void setTimeLineFeeds(Collection<TimeLineFeed> timeLineFeeds) {
		this.timeLineFeeds = timeLineFeeds;
	}
	
}
