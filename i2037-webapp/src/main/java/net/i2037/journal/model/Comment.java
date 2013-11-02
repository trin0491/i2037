package net.i2037.journal.model;

import java.util.Date;

public interface Comment {

	Long getCommentId();
	void setCommentId(Long id);

	String getText();
	void setText(String text);
	
	Long getUserId();
	
	Date getLastUpdateTime();
	void setLastUpdateTime(Date date);
}
