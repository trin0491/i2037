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
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;

import org.springframework.beans.factory.annotation.Required;

import net.i2037.cellar.UserService;
import net.i2037.cellar.model.User;
import net.i2037.cellar.util.RequestAwareCallable;
import net.i2037.journal.model.CommentCount;
import net.i2037.journal.model.CommentDao;
import net.i2037.moves.MovesService;

public class TimeLineSummaryLoader {

	private CommentDao commentDao;
	private Comparator<? super TimeLineSummaryDto> summaryComparator;
	private MovesService movesService;
	private UserService userService;
	private Executor executor;
	
	public TimeLineSummaryLoader() {
		summaryComparator = new TimeLineSummaryDtoComparator();
	}
	
	public List<? extends TimeLineSummaryDto> loadSummaries(Date start, Date end) throws InterruptedException {
		
		Future<Collection<TimeLineSummaryDto>> future = beginLoadSummary(start, end);		
		
		User user = userService.getCurrentUser();
		
		List<? extends CommentCount> countByDay = commentDao.countByDay(start, end, user);
		
		Map<Date, TimeLineSummaryDto> dtosByDate = new HashMap<Date, TimeLineSummaryDto>();
		for (TimeLineSummaryDto dto : endLoadSummary(future)) {
			dtosByDate.put(dto.getDate(), dto);
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

	private Future<Collection<TimeLineSummaryDto>> beginLoadSummary(final Date start, final Date end) {		
		Callable<Collection<TimeLineSummaryDto>> callable = new RequestAwareCallable<Collection<TimeLineSummaryDto>>() {
			@Override
			public Collection<TimeLineSummaryDto> doCall() throws Exception {
				return getMovesService().loadSummaries(start, end);
			}			
		};
		
		FutureTask<Collection<TimeLineSummaryDto>> task = new FutureTask<Collection<TimeLineSummaryDto>>(callable);
		getExecutor().execute(task);
		return task;
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
