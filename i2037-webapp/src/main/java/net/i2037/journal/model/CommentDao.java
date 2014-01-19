package net.i2037.journal.model;

import java.util.Date;
import java.util.List;


public interface CommentDao {

	void create(Comment comment);
	void update(Comment comment);
	void delete(Comment comment);
	Comment readById(long id);
	List<Comment> queryByTimelineEntry(String refId, EntryType type);
	List<? extends CommentCount> countByDay(Date from, Date to);
	Comment newEntity();	
}
