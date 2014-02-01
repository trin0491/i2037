package net.i2037.moves;

import java.util.Date;

import org.codehaus.jackson.JsonNode;

import net.i2037.journal.TimeLineSummaryDto;

public class DailySummaryParser {

	public TimeLineSummaryDto parse(JsonNode day) {
		TimeLineSummaryDto dto = new TimeLineSummaryDto();
		dto.setDate(parseDate(day));
		dto.setActivities(parseActivities(day));
		return dto;
	}

	private JsonNode parseActivities(JsonNode day) {
		return day.path(DailySummary.SUMMARY);
	}

	private Date parseDate(JsonNode day) {
		String date = day.path(DailySummary.DATE).getTextValue();
		return DailySummary.DATE_FORMAT.parseDateTime(date).toDate();
	}
}
