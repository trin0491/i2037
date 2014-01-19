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
	
	private TimeLineEntryLoader entryLoader;
	
	private TimeLineSummaryLoader summaryLoader; 
	
	/**
	 * @param date day in "yyyyMMdd" format
	 */
	@Override
	public List<? extends TimeLineEntryDto> getDailyEntries(String date) {
		DateTime startDT = DAY_FORMATTER.parseDateTime(date);
		DateTime endDT = startDT.plusDays(1);
		try {
			return entryLoader.loadEntries(startDT.toDate(), endDT.toDate());
		} catch (InterruptedException e) {
			LOGGER.warn("TimeLine entry loading was interrupted", e);
			throw new FeedException(e);
		}
	}

	@Override
	public List<? extends TimeLineSummaryDto> getDailySummary(String from, String to) {
		DateTime startDT = DAY_FORMATTER.parseDateTime(from);
		DateTime endDT = DAY_FORMATTER.parseDateTime(to);
		try {
			return summaryLoader.loadSummaries(startDT.toDate(), endDT.toDate());
		} catch (InterruptedException e) {
			LOGGER.warn("TimeLine summary laoding was interrupted", e);
			throw new FeedException(e);
		}		
	}

	public TimeLineSummaryLoader getSummaryLoader() {
		return summaryLoader;
	}

	@Required
	public void setSummaryLoader(TimeLineSummaryLoader summaryLoader) {
		this.summaryLoader = summaryLoader;
	}

	public TimeLineEntryLoader getEntryLoader() {
		return entryLoader;
	}

	@Required
	public void setEntryLoader(TimeLineEntryLoader loader) {
		this.entryLoader = loader;
	}	
	
}
