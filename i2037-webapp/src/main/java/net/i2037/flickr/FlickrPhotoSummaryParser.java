package net.i2037.flickr;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.JsonNode;

import net.i2037.journal.TimeLineEntryDto;
import net.i2037.journal.model.EntryType;
import net.i2037.moves.StorylineSegment;

public final class FlickrPhotoSummaryParser {

	private static final String STATUS_CODE = "stat";
	private static final String OK = "ok";
		
	public List<TimeLineEntryDto> parse(JsonNode root) {
		String statusCode = root.path(STATUS_CODE).getTextValue();
		if (!OK.equals(statusCode)) {
			throw new IllegalArgumentException("Received error response: " + root);
		}
				
		List<TimeLineEntryDto> dtos = new ArrayList<TimeLineEntryDto>();
		for (JsonNode photo : root.path("photos").path("photo")) {
			TimeLineEntryDto entry = newEntry();
			entry.setEntryId(null);
			entry.setRefId(parseRefId(photo));
			entry.setTime(parseStartTime(photo));
			entry.setEndTime(parseStartTime(photo));
			entry.setPayload(parsePayload(photo));
			dtos.add(entry);
		}
		return dtos;
	}


	private Object parsePayload(JsonNode photo) {
		return photo;
	}


	private Date parseStartTime(JsonNode photo) {
		String str = getStartTimeOrThrow(photo);
		try {
			return FlickrPhoto.TIME_FORMAT.parseDateTime(str).toDate();
		} catch (Exception e) {
			throw new IllegalArgumentException(String.format(
					"Segment has invalid time %s at '%s'", str, FlickrPhoto.DATE_TAKEN), e);
		}		
	}


	private String getStartTimeOrThrow(JsonNode photo) {
		String dateTaken = photo.path(FlickrPhoto.DATE_TAKEN).getTextValue();
		if (dateTaken == null) {
			throw new IllegalArgumentException("startTime cannot be null");
		}
		return dateTaken;
	}


	private String parseRefId(JsonNode photo) {
		return photo.path(FlickrPhoto.ID).getTextValue();
	}


	private TimeLineEntryDto newEntry() {
		TimeLineEntryDto entry = new TimeLineEntryDto();
		entry.setType(EntryType.FLICKR_PHOTOS);
		return entry;
	}


	
}
