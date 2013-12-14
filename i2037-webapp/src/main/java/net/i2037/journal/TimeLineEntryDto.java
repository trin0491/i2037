package net.i2037.journal;

import java.util.Date;

import net.i2037.journal.model.EntryType;

public class TimeLineEntryDto {

	private Long entryId;
	private String refId;	
	private EntryType type;
	private Date time;
	private Object payload;
	
	public Long getEntryId() {
		return entryId;
	}
	
	public void setEntryId(Long entryId) {
		this.entryId = entryId;
	}

	public EntryType getType() {
		return type;
	}

	public void setType(EntryType type) {
		this.type = type;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String getRefId() {
		return refId;
	}

	public void setRefId(String refId) {
		this.refId = refId;
	}

	public Object getPayload() {
		return payload;
	}

	public void setPayload(Object payload) {
		this.payload = payload;
	}

	@Override
	public String toString() {
		return "TimeLineEntryDto [entryId=" + entryId + ", type=" + type
				+ ", time=" + time + ", refId=" + refId + ", payload="
				+ payload + "]";
	}
}
