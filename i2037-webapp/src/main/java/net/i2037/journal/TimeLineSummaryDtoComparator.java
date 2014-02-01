package net.i2037.journal;

import java.util.Comparator;

public class TimeLineSummaryDtoComparator implements
		Comparator<TimeLineSummaryDto> {

	@Override
	public int compare(TimeLineSummaryDto dto0, TimeLineSummaryDto dto1) {
		if (dto0.equals(dto1)) {
			return 0;
		} else {
			return dto0.getDate().compareTo(dto1.getDate());
		}
	}

}
