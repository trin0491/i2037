package net.i2037.journal;

import java.util.Collection;
import java.util.concurrent.CompletionService;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorCompletionService;

import org.springframework.beans.factory.annotation.Required;

public abstract class TimeLineLoader {

	private Executor executorService;
	protected Collection<TimeLineFeed> timeLineFeeds;

	protected CompletionService<Collection<TimeLineEntryDto>> newCompletionService() {
		return new ExecutorCompletionService<Collection<TimeLineEntryDto>>(getExecutorService());
	}

	public Executor getExecutorService() {
		return executorService;
	}

	@Required
	public void setExecutorService(Executor executorService) {
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
