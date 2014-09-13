package net.i2037.flickr;

import java.util.HashMap;
import java.util.Map;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.client.RestTemplate;

public class FlickrServiceImpl implements FlickrService {

	private DateTimeFormatter DATE_FORMAT = DateTimeFormat.forPattern("yyyyMMdd");
	private DateTimeFormatter MYSQL_FORMAT = DateTimeFormat.forPattern("yyyy-MM-dd");
	
	private static final String URL = "https://api.flickr.com/services/rest/?method={method}&format=json&nojsoncallback=1&api_key=3bcbf568e7199c6f3fc87e64d5b3289a";

	private static final String METHOD = "method";
	
	private RestTemplate flickrTemplate;

	public RestTemplate getFlickrTemplate() {
		return flickrTemplate;
	}

	@Required
	public void setFlickrTemplate(RestTemplate flickrTemplate) {
		this.flickrTemplate = flickrTemplate;
	}
	
	@Override
	public Map<String, Object> getPhotoSummaries(String date) {
		DateTime start = DATE_FORMAT.parseDateTime(date);
		DateTime end = start.plusDays(1);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(METHOD, "flickr.photos.getWithGeoData");
		params.put("min_taken_date", MYSQL_FORMAT.print(start));
		params.put("max_taken_date", MYSQL_FORMAT.print(end));		
		String url = URL + "&min_taken_date={min_taken_date}&max_taken_date={max_taken_date}&extras=geo,date_taken";		
		return flickrTemplate.getForObject(url, Map.class, params);		
	}

	@Override
	public Map<String, Object> echo() {
		String method = "flickr.test.echo";
		return flickrTemplate.getForObject(URL, Map.class, method);		
	}

	@Override
	public Map<String, Object> login() {
		String method = "flickr.test.login";
		return flickrTemplate.getForObject(URL, Map.class, method);				
	}
}
