package net.i2037.moves;

import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

public final class StorylineSegment {
	private StorylineSegment() {}
	
	public static final String TYPE = "type";
	public static final String START_TIME = "startTime";
	public static final String PLACE = "place";
	public static final String ID = "id";
	
	public static final DateTimeFormatter TIME_FORMAT = ISODateTimeFormat
			.basicDateTimeNoMillis();
}
