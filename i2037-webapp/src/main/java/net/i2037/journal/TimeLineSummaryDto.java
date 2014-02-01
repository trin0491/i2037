package net.i2037.journal;

import java.util.Date;

import org.codehaus.jackson.JsonNode;

public class TimeLineSummaryDto {
	private Date date;
	private Long comments;
	private JsonNode activies;

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
	
	public JsonNode getActivities() {
		return activies;
	}
	
	public void setActivities(JsonNode activities) {
		this.activies = activities;
	}
}
