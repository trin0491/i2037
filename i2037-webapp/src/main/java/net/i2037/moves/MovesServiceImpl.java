package net.i2037.moves;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.i2037.journal.TimeLineEntryDto;
import net.i2037.journal.TimeLineFeed;
import net.i2037.journal.TimeLineSummaryDto;
import net.i2037.journal.model.TimeLineEntry;

import org.codehaus.jackson.JsonNode;
import org.joda.time.Chronology;
import org.joda.time.DateTime;
import org.joda.time.chrono.ISOChronology;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.client.RestTemplate;

public class MovesServiceImpl implements MovesService, TimeLineFeed {

	private static final Logger LOGGER = LoggerFactory.getLogger(MovesServiceImpl.class);
	
	private DateTimeFormatter DATE_FORMAT = DateTimeFormat.forPattern("yyyyMMdd");
	
	private static final String MOVES_API_V1 = "https://api.moves-app.com/api/1.1/";

	private StorylineSegmentParser storylineSegmentParser;
	
	private DailySummaryParser dailySummaryParser;
	
	private RestTemplate movesTemplate;

	private String getUrl(String suffix) {
		return MOVES_API_V1 + suffix;
	}
	
	@Override
	public Map<String, Object> getUserProfile() {
		String url = getUrl("user/profile");
		LOGGER.info("Calling moves: {}", url);
		return movesTemplate.getForObject(url, Map.class);
	}

	@Override
	public JsonNode getDailySummary(String from, String to) {
		String url = getUrl("user/summary/daily?from={from}&to={to}");
		LOGGER.info("Calling moves: {}, [{},{}]", url, from, to);
		return movesTemplate.getForObject(url, JsonNode.class, from, to);
	}

	@Override
	public JsonNode getDailySummary(String day) {
		String url = getUrl("user/summary/daily/{day}");
		LOGGER.info("Calling moves: {}, [{}]", url, day);
		return movesTemplate.getForObject(url, JsonNode.class, day);
	}
	
	@Override
	public List<?> getDailyPlaces(String date) {
		String url = getUrl("user/places/daily/" + date);
		LOGGER.info("Calling moves: {}", url);
		return movesTemplate.getForObject(url, List.class);		
	}

	@Override
	public JsonNode getDailyStoryline(String date) {
		String url = getUrl("user/storyline/daily/" + date + "?trackPoints=true");
		LOGGER.info("Calling moves: {}", url);
		return movesTemplate.getForObject(url, JsonNode.class);
	}

	@Override
	public Collection<TimeLineEntryDto> loadEntries(Date start, Date end) {
		String day = DATE_FORMAT.print(new DateTime(start));
		JsonNode storyline = this.getDailyStoryline(day);
		Collection<TimeLineEntryDto> entries = parseStoryline(storyline);
		Iterator<TimeLineEntryDto> itr = entries.iterator();
		while (itr.hasNext()) {
			TimeLineEntryDto entry = itr.next();
			if (entry.getTime().before(start) || entry.getTime().after(end)) {
				itr.remove();				
			}			
		}
		return entries;
	}
	
	@Override
	public Collection<TimeLineSummaryDto> loadSummaries(Date start, Date end) {
		String from = toString(start);
		String to = toString(end);
		JsonNode dailySummaries = getDailySummary(from, to);
		return parseDailySummary(dailySummaries);
	}

	@Override
	public Collection<TimeLineSummaryDto> loadSummaries(Date day) {
		String dateStr = toString(day);
		JsonNode dailySummary = getDailySummary(dateStr);
		List<TimeLineSummaryDto> dtos = parseDailySummary(dailySummary);
		return dtos;
	}
	
	private String toString(Date date) {
		return DATE_FORMAT.print(new DateTime(date));
	}

	private Collection<TimeLineEntryDto> parseStoryline(JsonNode storyline) {
		List<TimeLineEntryDto> dtos = new ArrayList<TimeLineEntryDto>();
		for (JsonNode day : storyline) {
			for (JsonNode segment : day.get(Storyline.SEGMENTS)) {
				TimeLineEntryDto dto = storylineSegmentParser.parse(segment);
				dtos.add(dto);
			}
		}
		return dtos;
	}
	
	private List<TimeLineSummaryDto> parseDailySummary(JsonNode summary) {
		List<TimeLineSummaryDto> dtos = new ArrayList<TimeLineSummaryDto>();
		for (JsonNode day : summary) {
			dtos.add(getDailySummaryParser().parse(day));
		}
		return dtos;		
	}

	public RestTemplate getMovesTemplate() {
		return movesTemplate;
	}

	@Required
	public void setMovesTemplate(RestTemplate movesTemplate) {
		this.movesTemplate = movesTemplate;
	}
	
	public StorylineSegmentParser getStorylineSegmentParser() {
		return storylineSegmentParser;
	}

	@Required
	public void setStorylineSegmentParser(StorylineSegmentParser parser) {
		this.storylineSegmentParser = parser;
	}

	public DailySummaryParser getDailySummaryParser() {
		return dailySummaryParser;
	}

	@Required
	public void setDailySummaryParser(DailySummaryParser dailySummaryParser) {
		this.dailySummaryParser = dailySummaryParser;
	}
}
