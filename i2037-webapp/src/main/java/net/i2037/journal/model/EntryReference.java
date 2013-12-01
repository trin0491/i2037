package net.i2037.journal.model;

import java.io.Serializable;

public class EntryReference implements Serializable {
	
	private Long entryId;
	private EntryType entryType;
	
	public EntryReference() {
		
	}
	
	public EntryReference(TimeLineEntry entry) {
		this.entryId = entry.getEntryId();
		this.entryType = entry.getType();
	}

	public EntryType getEntryType() {	
		return entryType;
	}
	
	public void setEntryType(EntryType entryType) {
		this.entryType = entryType;
	}
	
	public Long getEntryId() {
		return entryId;
	}
	
	public void setEntryId(Long entryId) {
		this.entryId = entryId;
	}
}
