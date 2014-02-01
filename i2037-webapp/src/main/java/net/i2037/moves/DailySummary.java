package net.i2037.moves;

import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

public final class DailySummary {
	private DailySummary() {}
	
	public static final String DATE = "date";
	public static final String SUMMARY = "summary";
	
	public static final DateTimeFormatter DATE_FORMAT = ISODateTimeFormat.basicDate();
}
