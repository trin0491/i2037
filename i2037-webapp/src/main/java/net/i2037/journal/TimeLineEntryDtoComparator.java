package net.i2037.journal;

import java.io.Serializable;
import java.util.Comparator;

import net.i2037.journal.model.TimeLineEntry;

//Needs to be ThreadSafe
public final class TimeLineEntryDtoComparator implements
		Comparator<TimeLineEntryDto>, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public int compare(TimeLineEntryDto t1, TimeLineEntryDto t2) {
		if (t1.equals(t2)) {
			return 0;
		} else {
			return t1.getTime().compareTo(t2.getTime());
		}
	}

}
