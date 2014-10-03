package net.i2037.flickr;

import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public final class FlickrPhoto {

	public static final String ID = "id";
	public static final String DATE_TAKEN = "datetaken";
	public static final DateTimeFormatter TIME_FORMAT = DateTimeFormat
			.forPattern("yyyy-MM-dd HH:mm:ss").withZone(
					DateTimeZone.forOffsetHours(3));

	private FlickrPhoto() {
	}
}
