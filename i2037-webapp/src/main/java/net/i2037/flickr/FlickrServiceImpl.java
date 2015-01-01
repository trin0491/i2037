package net.i2037.flickr;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import net.i2037.journal.TimeLineEntryDto;
import net.i2037.journal.TimeLineFeed;

import org.codehaus.jackson.JsonNode;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.client.RestTemplate;

public class FlickrServiceImpl implements FlickrService, TimeLineFeed {
	
	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(FlickrServiceImpl.class);
	
	private DateTimeFormatter DATE_FORMAT = DateTimeFormat.forPattern("yyyyMMdd");
	private DateTimeFormatter MYSQL_FORMAT = DateTimeFormat.forPattern("yyyy-MM-dd");
	
	private static final String URL = "https://api.flickr.com/services/rest/?method={method}&format=json&nojsoncallback=1&api_key=3bcbf568e7199c6f3fc87e64d5b3289a";
	private static final String METHOD = "method";
	private static final String MAX_TAKEN_DATE = "max_taken_date";
	private static final String MIN_TAKEN_DATE = "min_taken_date";

	
	private RestTemplate flickrTemplate;
	
	private FlickrPhotoSummaryParser parser = new FlickrPhotoSummaryParser();

	public RestTemplate getFlickrTemplate() {
		return flickrTemplate;
	}

	@Required
	public void setFlickrTemplate(RestTemplate flickrTemplate) {
		this.flickrTemplate = flickrTemplate;
	}
	
	@Override
	public JsonNode getPhotoSummaries(String from, String to) {
		DateTime start = DATE_FORMAT.parseDateTime(from);
		DateTime end = DATE_FORMAT.parseDateTime(to);
		return this.getPhotoSummaries(start, end);
	}

	private JsonNode getPhotoSummaries(DateTime start, DateTime end) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(METHOD, "flickr.photos.getWithGeoData");
		params.put(MIN_TAKEN_DATE, MYSQL_FORMAT.print(start));
		params.put(MAX_TAKEN_DATE, MYSQL_FORMAT.print(end));		
		String url = URL + "&min_taken_date={min_taken_date}&max_taken_date={max_taken_date}&extras=geo,date_taken,description,url_c,url_m";
		LOGGER.info("Calling Flickr: {} with min_taken_date: {}, max_taken_date: {}", url, params.get(MIN_TAKEN_DATE), params.get(MAX_TAKEN_DATE));
		return flickrTemplate.getForObject(url, JsonNode.class, params);				
	}
	
	@Override
	public JsonNode echo() {
		String method = "flickr.test.echo";
		LOGGER.info("Calling Flickr: {} with method: {}", URL, method);
		return flickrTemplate.getForObject(URL, JsonNode.class, method);		
	}

	@Override
	public JsonNode login() {
		String method = "flickr.test.login";
		LOGGER.info("Calling Flickr: {} with method: {}", URL, method);
		return flickrTemplate.getForObject(URL, JsonNode.class, method);				
	}

	@Override
	public Collection<TimeLineEntryDto> loadEntries(Date start, Date end) {
		JsonNode photoSummaries = this.getPhotoSummaries(new DateTime(start), new DateTime(end));
		Collection<TimeLineEntryDto> entries = parseSummaryData(photoSummaries);
		return entries;
	}

	private Collection<TimeLineEntryDto> parseSummaryData(
			JsonNode photoSummaries) {
		return parser.parse(photoSummaries);
	}
}
