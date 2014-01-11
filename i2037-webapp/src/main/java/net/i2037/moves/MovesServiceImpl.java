package net.i2037.moves;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.i2037.journal.TimeLineEntryDto;
import net.i2037.journal.TimeLineFeed;
import net.i2037.journal.model.TimeLineEntry;

import org.codehaus.jackson.JsonNode;
import org.joda.time.Chronology;
import org.joda.time.DateTime;
import org.joda.time.chrono.ISOChronology;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.client.RestTemplate;

public class MovesServiceImpl implements MovesService, TimeLineFeed {

	private DateTimeFormatter DATE_FORMAT = DateTimeFormat.forPattern("yyyyMMdd");
	
	private static final String MOVES_API_V1 = "https://api.moves-app.com/api/v1/";

	private StorylineSegmentParser parser;
	
	private RestTemplate movesTemplate;

	private String getUrl(String suffix) {
		return MOVES_API_V1 + suffix;
	}
	
	@Override
	public Map<String, Object> getUserProfile() {
		return movesTemplate.getForObject(getUrl("user/profile"), Map.class);
	}

	@Override
	public List<?> getDailySummary(String from, String to) {
		return movesTemplate.getForObject(getUrl("user/summary/daily?from={from}&to={to}"), List.class, from, to);
	}

	@Override
	public List<?> getDailyPlaces(String date) {
		return movesTemplate.getForObject(getUrl("user/places/daily/" + date), List.class);		
	}

	@Override
	public JsonNode getDailyStoryline(String date) {
		return movesTemplate.getForObject(getUrl("user/storyline/daily/" + date + "?trackPoints=true"), JsonNode.class);
	}

	@Override
	public Collection<TimeLineEntryDto> load(Date start, Date end) {
		DateTime startDt = new DateTime(start);
		String day = DATE_FORMAT.print(startDt);
		JsonNode storyline = this.getDailyStoryline(day);
		Collection<TimeLineEntryDto> entries = parse(storyline);
		Iterator<TimeLineEntryDto> itr = entries.iterator();
		while (itr.hasNext()) {
			TimeLineEntryDto entry = itr.next();
			if (entry.getTime().before(start) || entry.getTime().after(end)) {
				itr.remove();				
			}			
		}
		return entries;
	}

	private Collection<TimeLineEntryDto> parse(JsonNode storyline) {
		List<TimeLineEntryDto> dtos = new ArrayList<TimeLineEntryDto>();
		for (JsonNode day : storyline) {
			for (JsonNode segment : day.get(Storyline.SEGMENTS)) {
				TimeLineEntryDto dto = parser.parse(segment);
				dtos.add(dto);
			}
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
	
	public StorylineSegmentParser getParser() {
		return parser;
	}

	@Required
	public void setParser(StorylineSegmentParser parser) {
		this.parser = parser;
	}
}
