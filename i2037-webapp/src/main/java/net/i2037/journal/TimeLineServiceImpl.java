package net.i2037.journal;

import java.util.List;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;

public class TimeLineServiceImpl implements TimeLineService {

	private static final Logger LOGGER = LoggerFactory.getLogger(TimeLineServiceImpl.class);
	private static final DateTimeFormatter DAY_FORMATTER = ISODateTimeFormat.basicDate();
	
	private TimeLineFeedLoader loader;
	
	/**
	 * @param date day in "yyyyMMdd" format
	 */
	@Override
	public List<? extends TimeLineEntryDto> getDailyEntries(String date) {
		DateTime startDT = DAY_FORMATTER.parseDateTime(date);
		DateTime endDT = startDT.plusDays(1);
		try {
			return loader.load(startDT.toDate(), endDT.toDate());
		} catch (InterruptedException e) {
			LOGGER.warn("FeedLoader was interrupted", e);
			throw new FeedException(e);
		}
	}

	public TimeLineFeedLoader getLoader() {
		return loader;
	}

	@Required
	public void setLoader(TimeLineFeedLoader loader) {
		this.loader = loader;
	}

}
