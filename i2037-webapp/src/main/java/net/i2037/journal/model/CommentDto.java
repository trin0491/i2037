package net.i2037.journal.model;

import java.io.Serializable;
import java.util.Date;

public class CommentDto implements Comment, Serializable {

	private Long commentId;
	private String text;
	private Long userId;
	private Date lastUpdateTime;
	
	public CommentDto() {
		
	}
	
	public CommentDto(Comment comment) {
		this.commentId = comment.getCommentId();
		this.text = comment.getText();
		this.userId = comment.getUserId();
		this.lastUpdateTime = comment.getLastUpdateTime();
	}

	@Override
	public Long getCommentId() {
		return commentId;
	}

	@Override
	public void setCommentId(Long id) {
		commentId = id;
	}

	@Override
	public String getText() {
		return text;
	}

	@Override
	public void setText(String text) {
		this.text = text;
	}

	@Override
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	@Override
	public Date getLastUpdateTime() {
		return lastUpdateTime;
	}

	@Override
	public void setLastUpdateTime(Date date) {
		this.lastUpdateTime = date;
	}
}
