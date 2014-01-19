package net.i2037.journal;

import java.util.Date;

public class TimeLineSummaryDto {
	private Date date;
	private Long comments;
	private Long distance;

	public Date getDate() {
		return date;
	}

	public void setDate(Date time) {
		this.date = time;
	}
	
	public Long getComments() {
		return comments;
	}
	
	public void setComments(Long count) {
		this.comments = count;
	}
	
	public Long getDistance() {
		return distance;
	}
	
	public void setDistance(Long distance) {
		this.distance = distance;
	}
}
