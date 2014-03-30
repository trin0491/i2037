package net.i2037.journal;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.transaction.annotation.Transactional;

import net.i2037.cellar.UserService;
import net.i2037.cellar.model.User;
import net.i2037.cellar.model.UserDao;
import net.i2037.cellar.model.UserDto;
import net.i2037.cellar.model.UserImpl;
import net.i2037.journal.model.Comment;
import net.i2037.journal.model.CommentDao;
import net.i2037.journal.model.CommentDto;
import net.i2037.journal.model.EntryType;
import net.i2037.journal.model.TimeLineEntry;
import net.i2037.journal.model.TimeLineEntryDao;

public class CommentServiceImpl implements CommentService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CommentServiceImpl.class);
	
	private TimeLineEntryDao timeLineEntryDao;
	private UserDao userDao;	
	private CommentDao commentDao;

	private CommentDto toDto(Comment comment) {
		if (comment == null) {
			return null;
		} else {
			return new CommentDto(comment);
		}
	}

	private List<CommentDto> toDtos(List<Comment> comments) {
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
		
		Long userId = dto.getUserId();
		if (userId != null) {
			UserImpl user = getUserDao().readById(userId);
			comment.setUser(user);
		}
		return comment;
	}	

	private void enrichComment(CommentDto comment, User user) {
		comment.setLastUpdateTime(new Date());
		comment.setUserId(user.getId());
	}
	
	@Override
	@Transactional
	public void create(CommentDto comment) {
		LOGGER.info("Create comment: {}", comment);
		User currentUser = userDao.getCurrentUser();
		enrichComment(comment, currentUser);
		Comment entity = toEntity(comment);
		commentDao.create(entity);
	}

	@Override
	public CommentDto readById(long commentId) {
		LOGGER.info("Read comment by id: {}", commentId);
		User user = userDao.getCurrentUser();
		Comment c = commentDao.readById(commentId);
		throwIfNotEntitled(c, user);
		return toDto(c); 
	}

	@Override
	@Transactional
	public void update(CommentDto comment) {
		LOGGER.info("Update comment: {}", comment);
		User currentUser = userDao.getCurrentUser();		
		enrichComment(comment, currentUser);		
		Comment c = commentDao.readById(comment.getCommentId());
		if (c == null) {
			throw new IllegalArgumentException("Comment does not exist");			
		}
		throwIfNotEntitled(c, currentUser);
		c.setLastUpdateTime(comment.getLastUpdateTime());
		c.setText(comment.getText());
	}

	private void throwIfNotEntitled(Comment comment, User user) {
		if (comment != null && ! user.getId().equals(comment.getUser().getId())) {
			throw new SecurityException("User is not entitled"); 
		}
	}

	@Override
	@Transactional
	public void delete(long commentId) {
		LOGGER.info("Delete comment: {}", commentId);
		User user = userDao.getCurrentUser();
		Comment c = commentDao.readById(commentId);
		if (c == null) {
			throw new IllegalArgumentException("Comment does not exist");
		}
		throwIfNotEntitled(c, user);
		commentDao.delete(c);			
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
		User user = userDao.getCurrentUser();
		List<Comment> comments = commentDao.queryByTimelineEntry(refId, type, user);
		return toDtos(comments);
	}

	public TimeLineEntryDao getTimeLineEntryDao() {
		return timeLineEntryDao;
	}

	public void setTimeLineEntryDao(TimeLineEntryDao timeLineEntryDao) {
		this.timeLineEntryDao = timeLineEntryDao;
	}

	public UserDao getUserDao() {
		return userDao;
	}

	@Required
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

}
