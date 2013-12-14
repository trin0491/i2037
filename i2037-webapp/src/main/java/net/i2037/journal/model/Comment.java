package net.i2037.journal.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import net.i2037.cellar.model.User;
import net.i2037.cellar.model.UserImpl;

@Entity
@Table(name="comment")
public class Comment implements Serializable {

	private Long commentId;
	private String text;
	private UserImpl user;
	private Date lastUpdateTime;
	private TimeLineEntry timeLineEntry;

	public Comment() {
	}

	public Comment(Comment comment) {
		this.commentId = comment.getCommentId();
		this.text = comment.getText();
		this.user = comment.getUser();
		this.lastUpdateTime = comment.getLastUpdateTime();
		this.timeLineEntry = comment.getTimeLineEntry();
	}

	@Id
	@GeneratedValue(generator = "increment")
	@GenericGenerator(name = "increment", strategy = "increment")
	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long id) {
		this.commentId = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@ManyToOne
	public UserImpl getUser() {
		return user;
	}

	public void setUser(UserImpl user) {
		this.user = user;
	}

	public Date getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(Date date) {
		this.lastUpdateTime = date;
	}

	@ManyToOne
	public TimeLineEntry getTimeLineEntry() {
		return timeLineEntry;
	}

	public void setTimeLineEntry(TimeLineEntry entry) {
		this.timeLineEntry = entry;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((commentId == null) ? 0 : commentId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Comment other = (Comment) obj;
		if (commentId == null) {
			if (other.commentId != null)
				return false;
		} else if (!commentId.equals(other.commentId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Comment [commentId=" + commentId + ", user=" + user
				+ ", lastUpdateTime=" + lastUpdateTime + ", timeLineEntry="
				+ timeLineEntry + ", text=" + text + "]";
	}
}
