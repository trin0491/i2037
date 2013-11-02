package net.i2037.journal.model;

import java.io.Serializable;
import java.util.Date;

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
public class CommentImpl implements Comment, Serializable {

	private Long commentId;
	private String text;
	private UserImpl user;
	private Date lastUpdateTime;

	public CommentImpl() {
	}

	public CommentImpl(Comment comment) {
		this.commentId = comment.getCommentId();
		this.text = comment.getText();
		this.lastUpdateTime = comment.getLastUpdateTime();
	}

	@Override
	@Id
	@GeneratedValue(generator = "increment")
	@GenericGenerator(name = "increment", strategy = "increment")
	public Long getCommentId() {
		return commentId;
	}

	@Override
	public void setCommentId(Long id) {
		this.commentId = id;
	}

	@Override
	public String getText() {
		return text;
	}

	@Override
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

	@Override
	@Transient
	public Long getUserId() {
		if (user != null) {
			return user.getId();
		} else {
			return null;
		}
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
