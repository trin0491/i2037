package net.i2037.journal.model;

import java.util.Date;
import java.util.List;

public interface TimeLineEntryDao {
	TimeLineEntry newEntity();
	TimeLineEntry readByReference(String refId, EntryType type);
	TimeLineEntry readById(Long entryId);	
	void create(TimeLineEntry entry);
	void delete(TimeLineEntry entry);
	void update(TimeLineEntry entry);
	List<TimeLineEntry> queryByDateRange(Date start, Date end);
}
