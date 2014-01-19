package net.i2037.journal;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Required;

import net.i2037.journal.model.CommentCount;
import net.i2037.journal.model.CommentDao;

public class TimeLineSummaryLoader extends TimeLineLoader {

	private CommentDao commentDao;
	
	public List<? extends TimeLineSummaryDto> loadSummaries(Date start, Date end) throws InterruptedException {
		List<? extends CommentCount> countByDay = commentDao.countByDay(start, end);
		List<TimeLineSummaryDto> dtos = new ArrayList<TimeLineSummaryDto>();
		for (CommentCount comments : countByDay) {
			TimeLineSummaryDto dto = new TimeLineSummaryDto();
			dto.setDate(comments.getDay());			
			dto.setComments(comments.getCount());
			dtos.add(dto);
		}
		return dtos;
	}

	public CommentDao getCommentDao() {
		return commentDao;
	}

	@Required
	public void setCommentDao(CommentDao commentDao) {
		this.commentDao = commentDao;
	}

}
