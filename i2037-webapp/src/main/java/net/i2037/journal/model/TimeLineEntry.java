package net.i2037.journal.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="time_line_entry")
public class TimeLineEntry implements Serializable {
	
	private Long entryId;
	private EntryType type;
	private Date time;

	@Id
	@GeneratedValue(generator = "increment")
	@GenericGenerator(name = "increment", strategy = "increment")
	public Long getEntryId() {
		return entryId;
	}
	
	public void setEntryId(Long entryId) {
		this.entryId = entryId;
	}
	
	public EntryType getType() {
		return type;
	}
	
	public void setType(EntryType entryType) {
		this.type = entryType;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date entryTime) {
		this.time = entryTime;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((entryId == null) ? 0 : entryId.hashCode());
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
		TimeLineEntry other = (TimeLineEntry) obj;
		if (entryId == null) {
			if (other.entryId != null)
				return false;
		} else if (!entryId.equals(other.entryId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "TimeLineEntry [entryId=" + entryId + ", type=" + type
				+ ", time=" + time + "]";
	}
}
