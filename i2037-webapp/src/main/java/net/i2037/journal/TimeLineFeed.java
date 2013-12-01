package net.i2037.journal;

import java.util.Collection;
import java.util.Date;

import net.i2037.journal.model.TimeLineEntry;

public interface TimeLineFeed {

	Collection<TimeLineEntry> load(Date start, Date end);

}
