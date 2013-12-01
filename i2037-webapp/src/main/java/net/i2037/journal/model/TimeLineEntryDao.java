package net.i2037.journal.model;

import java.util.Date;
import java.util.List;

public interface TimeLineEntryDao {
	TimeLineEntry newEntity();
	TimeLineEntry getReference(Long id);
	void create(TimeLineEntry entry);
	void delete(TimeLineEntry entry);
	void update(TimeLineEntry entry);
	List<TimeLineEntry> queryByDateRange(Date start, Date end);
}
