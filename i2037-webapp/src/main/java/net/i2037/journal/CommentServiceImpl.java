package net.i2037.journal;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.i2037.journal.model.Comment;
import net.i2037.journal.model.CommentDao;
import net.i2037.journal.model.CommentDto;
import net.i2037.journal.model.EntryType;
import net.i2037.journal.model.TimeLineEntry;
import net.i2037.journal.model.TimeLineEntryDao;

public class CommentServiceImpl implements CommentService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CommentServiceImpl.class);
	
	private CommentDao commentDao;
	private TimeLineEntryDao timeLineEntryDao;

	private static CommentDto toDto(Comment comment) {
		return new CommentDto(comment);
	}

	private static List<CommentDto> toDtos(List<Comment> comments) {
		List<CommentDto> dtos = new ArrayList<CommentDto>(comments.size());
		for (Comment comment : comments) {
			dtos.add(toDto(comment));
		}
		return dtos;
	}
	
	private Comment toEntity(CommentDto dto) {
		Comment comment = commentDao.newEntity();
		comment.setCommentId(dto.getCommentId());
		comment.setLastUpdateTime(dto.getLastUpdateTime());
		comment.setText(dto.getText());
		
		String refId = dto.getRefId();
		EntryType type = dto.getEntryType();
		if (refId != null && type != null) {
			TimeLineEntry entry = timeLineEntryDao.readByReference(refId, type);
			comment.setTimeLineEntry(entry);
		}		
		return comment;
	}	

	private void enrichComment(CommentDto comment) {
		comment.setLastUpdateTime(new Date());
		// TODO set authenticated user
	}
	
	@Override
	public void create(CommentDto comment) {
		LOGGER.info("Create comment: {}", comment);
		enrichComment(comment);
		Comment entity = toEntity(comment);
		commentDao.create(entity);
	}

	@Override
	public CommentDto readById(long commentId) {
		LOGGER.info("Read comment by id: {}", commentId);
		Comment comment = commentDao.readById(commentId);
		return toDto(comment);
	}

	@Override
	public void update(CommentDto comment) {
		LOGGER.info("Update comment: {}", comment);
		enrichComment(comment);
		Comment entity = toEntity(comment);				
		commentDao.update(entity);
	}

	@Override
	public void delete(long commentId) {
		LOGGER.info("Delete comment: {}", commentId);
		CommentDto dto = new CommentDto();
		dto.setCommentId(commentId);
		Comment entity = toEntity(dto);
		commentDao.delete(entity);
	}

	public CommentDao getCommentDao() {
		return commentDao;
	}

	public void setCommentDao(CommentDao commentDao) {
		this.commentDao = commentDao;
	}

	@Override
	public List<CommentDto> queryByTimelineEntry(String refId, EntryType type) {
		LOGGER.info("Query comment by timeline refId: {} entryType: {}", refId, type);
		List<Comment> comments = commentDao.queryByTimelineEntry(refId, type);
		return toDtos(comments);
	}

	public TimeLineEntryDao getTimeLineEntryDao() {
		return timeLineEntryDao;
	}

	public void setTimeLineEntryDao(TimeLineEntryDao timeLineEntryDao) {
		this.timeLineEntryDao = timeLineEntryDao;
	}

}
