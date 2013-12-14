package net.i2037.journal.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.NaturalId;

@Entity
@Table(name="time_line_entry")
public class TimeLineEntry implements Serializable {

	@Id
	@GeneratedValue(generator = "increment")
	@GenericGenerator(name = "increment", strategy = "increment")
	private Long entryId;
	private Date time;
	
	@NaturalId
	private EntryType type;
	@NaturalId
	private String refId;

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

	public String getRefId() {
		return refId;
	}

	public void setRefId(String refId) {
		this.refId = refId;
	}	

	@Override
	public String toString() {
		return "TimeLineEntry [entryId=" + entryId + ", type=" + type
				+ ", time=" + time + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((refId == null) ? 0 : refId.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
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
		if (refId == null) {
			if (other.refId != null)
				return false;
		} else if (!refId.equals(other.refId))
			return false;
		if (type != other.type)
			return false;
		return true;
	}
}
