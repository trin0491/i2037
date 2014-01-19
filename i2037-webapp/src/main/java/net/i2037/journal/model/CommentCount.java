package net.i2037.journal.model;

import java.util.Date;

public class CommentCount {

	private Date day;	
	private long count;
	
	public Date getDay() {
		return day;
	}
	
	public void setDay(Date day) {
		this.day = day;
	}
	
	public long getCount() {
		return count;
	}
	
	public void setCount(long count) {
		this.count = count;
	}	
}
