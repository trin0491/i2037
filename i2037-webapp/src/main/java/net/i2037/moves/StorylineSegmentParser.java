package net.i2037.moves;

import java.util.Date;

import org.codehaus.jackson.JsonNode;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import net.i2037.journal.TimeLineEntryDto;
import net.i2037.journal.model.EntryType;

public final class StorylineSegmentParser {
	
	private static final DateTimeFormatter UTC_FORMAT = ISODateTimeFormat.basicDateTimeNoMillis().withZoneUTC();

	public TimeLineEntryDto parse(JsonNode segment) {
		TimeLineEntryDto dto = new TimeLineEntryDto();
		dto.setEntryId(null);
		dto.setPayload(parsePayload(segment));
		dto.setRefId(parseRefId(segment));
		dto.setTime(parseTime(segment));
		dto.setType(parseType(segment));
		return dto;
	}

	private EntryType parseType(JsonNode node) {
		JsonNode type = node.path(StorylineSegment.TYPE);
		String typeStr = type.getTextValue();
		if ("move".equals(typeStr)) {
			return EntryType.MOVES_MOVE;
		} else if ("place".equals(typeStr)) {
			return EntryType.MOVES_PLACE;
		} else {
			throw new IllegalArgumentException(String.format(
					"Segment has invalid EntryType %s at '%s'",
					type.getTextValue(), StorylineSegment.TYPE));
		}
	}

	private Date parseTime(JsonNode segment) {
		String str = getStartTimeOrThrow(segment);
		try {
			return StorylineSegment.TIME_FORMAT.parseDateTime(str).toDate();
		} catch (Exception e) {
			throw new IllegalArgumentException(String.format(
					"Segment has invalid time %s at '%s'", str, StorylineSegment.START_TIME), e);
		}
	}

	private String parseRefId(JsonNode segment) {
		EntryType type = parseType(segment);
		switch (type) {
		case MOVES_PLACE:
			return getPlaceRefId(segment);
		case MOVES_MOVE:
			return getMovesRefId(segment);
		default:
			throw new IllegalArgumentException("Segment has unknown type: "
					+ type);
		}
	}

	private Object parsePayload(JsonNode node) {
		return node;
	}

	private String getStartTimeOrThrow(JsonNode segment) {
		String startTime = segment.path(StorylineSegment.START_TIME).getTextValue();
		if (startTime == null) {
			throw new IllegalArgumentException("startTime cannot be null");
		}
		return startTime;
	}
		
	private String getPlaceRefId(JsonNode segment) {
		String id = segment.path(StorylineSegment.PLACE).path(StorylineSegment.ID).getValueAsText();
		if (id == null) {
			throw new IllegalArgumentException("place id cannot be null");
		}
		Date start = parseTime(segment);
		String startTime = UTC_FORMAT.print(start.getTime());
		return startTime + '-' + id;
	}
	
	private String getMovesRefId(JsonNode segment) {
		Date start = parseTime(segment);
		return UTC_FORMAT.print(start.getTime());		
	}	
}
