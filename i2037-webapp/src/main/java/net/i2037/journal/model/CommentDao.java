package net.i2037.journal.model;

import java.util.Date;
import java.util.List;

import net.i2037.cellar.model.User;


public interface CommentDao {

	void create(Comment comment);
	void update(Comment comment);
	void delete(Comment comment);
	Comment readById(long id);
	List<Comment> queryByTimelineEntry(String refId, EntryType type, User user);
	List<? extends CommentCount> countByDay(Date from, Date to, User user);
	Comment newEntity();	
}
