package net.i2037.journal;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;

import org.joda.time.DateTime;
import org.joda.time.Days;
import org.joda.time.Interval;
import org.springframework.beans.factory.annotation.Required;

import net.i2037.cellar.UserService;
import net.i2037.cellar.model.User;
import net.i2037.cellar.util.RequestAwareCallable;
import net.i2037.journal.model.CommentCount;
import net.i2037.journal.model.CommentDao;
import net.i2037.moves.MovesService;

public class TimeLineSummaryLoader {

	private static final int MAX_DAYS = 30;
	private CommentDao commentDao;
	private Comparator<? super TimeLineSummaryDto> summaryComparator;
	private MovesService movesService;
	private UserService userService;
	private Executor executor;
	
	public TimeLineSummaryLoader() {
		summaryComparator = new TimeLineSummaryDtoComparator();
	}
	
	public List<? extends TimeLineSummaryDto> loadSummaries(Date start, Date end) throws InterruptedException {
		
		CompletionService<Collection<TimeLineSummaryDto>> ecs = new ExecutorCompletionService<Collection<TimeLineSummaryDto>>(executor);
		IntervalSplitter splitter = new IntervalSplitter(new Interval(start.getTime(), end.getTime()), Days.days(MAX_DAYS));
		int n = 0;
		for (Interval intr : splitter) {			
			beginLoadSummary(intr.getStart(), intr.getEnd(), ecs);
			n++;
		}
		 
		List<? extends CommentCount> countByDay = commentDao.countByDay(start, end, userService.getCurrentUser());
		
		Map<Date, TimeLineSummaryDto> dtosByDate = new HashMap<Date, TimeLineSummaryDto>();
				
		for (int i=0; i<n; ++i) {
			Future<Collection<TimeLineSummaryDto>> future = ecs.take();
			for (TimeLineSummaryDto dto : endLoadSummary(future)) {
				dtosByDate.put(dto.getDate(), dto);
			}			
		}
				
		for (CommentCount comments : countByDay) {			
			TimeLineSummaryDto dto = dtosByDate.get(comments.getDay());
			if (dto == null) {
				dto = new TimeLineSummaryDto();
				dto.setDate(comments.getDay());
				dtosByDate.put(dto.getDate(), dto);
			}
			dto.setComments(comments.getCount());
		}
	
		List<TimeLineSummaryDto> dtos = new ArrayList<TimeLineSummaryDto>(dtosByDate.values());
				
		sort(dtos);
		
		return dtos;
	}

	private Future<Collection<TimeLineSummaryDto>> beginLoadSummary(
			final DateTime start, final DateTime end,
			CompletionService<Collection<TimeLineSummaryDto>> ecs) {	
		Callable<Collection<TimeLineSummaryDto>> callable = new RequestAwareCallable<Collection<TimeLineSummaryDto>>() {
			@Override
			public Collection<TimeLineSummaryDto> doCall() throws Exception {
				return getMovesService().loadSummaries(start.toDate(), end.toDate());
			}			
		};
		return ecs.submit(callable);		
	}

	private void sort(List<TimeLineSummaryDto> dtos) {
		Collections.sort(dtos, summaryComparator);
	}

	private Collection<TimeLineSummaryDto> endLoadSummary(
			Future<Collection<TimeLineSummaryDto>> future) throws InterruptedException {
		try {
			return future.get();
		} catch (ExecutionException e) {
			throw new FeedException(e);
		}			
	}

	public CommentDao getCommentDao() {
		return commentDao;
	}

	@Required
	public void setCommentDao(CommentDao commentDao) {
		this.commentDao = commentDao;
	}

	public Executor getExecutor() {
		return executor;
	}

	@Required
	public void setExecutor(Executor executor) {
		this.executor = executor;
	}

	public MovesService getMovesService() {
		return movesService;
	}

	@Required
	public void setMovesService(MovesService movesService) {
		this.movesService = movesService;
	}

	public UserService getUserService() {
		return userService;
	}

	@Required
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

}
