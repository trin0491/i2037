package net.i2037.journal.model;

import java.io.Serializable;
import java.util.Date;

import net.i2037.cellar.model.User;

public class CommentDto implements Serializable {

	private Long commentId;
	private String text;
	private Long userId;
	private Date lastUpdateTime;
	private String refId;
	private EntryType entryType;
	
	public CommentDto() {
		
	}
	
	public CommentDto(Comment comment) {
		this.commentId = comment.getCommentId();
		this.text = comment.getText();
		this.lastUpdateTime = comment.getLastUpdateTime();
		
		User user = comment.getUser();
		if (user != null) {
			this.userId = user.getId();
		}		
		this.lastUpdateTime = comment.getLastUpdateTime();
		
		TimeLineEntry entry = comment.getTimeLineEntry();
		if (entry != null) {
			this.refId = entry.getRefId();
			this.entryType = entry.getType();
		}		 
	}

	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long id) {
		commentId = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Date getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(Date date) {
		this.lastUpdateTime = date;
	}

	public String getRefId() {
		return refId;
	}

	public void setRefId(String refId) {
		this.refId = refId;
	}

	public EntryType getEntryType() {
		return entryType;
	}

	public void setEntryType(EntryType entryType) {
		this.entryType = entryType;
	}

	@Override
	public String toString() {
		return "CommentDto [commentId=" + commentId + ", text=" + text
				+ ", userId=" + userId + ", lastUpdateTime=" + lastUpdateTime
				+ ", refId=" + refId + ", entryType=" + entryType + "]";
	}


}
