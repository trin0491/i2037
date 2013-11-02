package net.i2037.journal;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.i2037.journal.model.Comment;
import net.i2037.journal.model.CommentDao;
import net.i2037.journal.model.CommentDto;

public class CommentServiceImpl implements CommentService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CommentServiceImpl.class);
	
	private CommentDao commentDao;

	private CommentDto toDto(Comment comment) {
		return new CommentDto(comment);
	}

	private List<CommentDto> toDtos(List<Comment> comments) {
		List<CommentDto> dtos = new ArrayList<CommentDto>(comments.size());
		for (Comment comment : comments) {
			dtos.add(toDto(comment));
		}
		return dtos;
	}	
	
	@Override
	public void create(CommentDto comment) {
		LOGGER.info("Create comment: {}", comment);
		enrichComment(comment);
		commentDao.create(comment);
	}

	@Override
	public CommentDto readById(Long commentId) {
		LOGGER.info("Read comment by id: {}", commentId);
		Comment comment = commentDao.readById(commentId);
		return toDto(comment);
	}

	@Override
	public void update(CommentDto comment) {
		LOGGER.info("Update comment: {}", comment);
		enrichComment(comment);
		commentDao.update(comment);
	}

	private void enrichComment(CommentDto comment) {
		comment.setLastUpdateTime(new Date());
	}

	@Override
	public void delete(Long commentId) {
		LOGGER.info("Delete comment: {}", commentId);
		CommentDto dto = new CommentDto();
		dto.setCommentId(commentId);
		commentDao.delete(dto);
	}

	public CommentDao getCommentDao() {
		return commentDao;
	}

	public void setCommentDao(CommentDao commentDao) {
		this.commentDao = commentDao;
	}

	@Override
	public List<CommentDto> query(String entryId) {
		LOGGER.info("Query comment: {}", entryId);
		List<Comment> comments = commentDao.query(entryId);
		return toDtos(comments);
	}

}
