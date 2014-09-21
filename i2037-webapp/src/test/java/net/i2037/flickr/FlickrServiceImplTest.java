package net.i2037.flickr;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.Map;

import mockit.Delegate;
import mockit.Expectations;
import mockit.Mocked;
import mockit.integration.junit4.JMockit;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.web.client.RestTemplate;

@RunWith(JMockit.class)
public class FlickrServiceImplTest {
	
	private FlickrServiceImpl flickrService;
	
	@Mocked
	private RestTemplate mockTemplate;
	
	@Before
	public void setUp() throws Exception {
		flickrService = new FlickrServiceImpl();
		flickrService.setFlickrTemplate(mockTemplate);
	}

	@Test
	public void testEcho() {
		final Map<String, Object> json = new HashMap<String, Object>();		
		new Expectations() {{
			mockTemplate.getForObject(anyString, Map.class, "flickr.test.echo");
			result = json;
		}};
		
		Map<String, Object> rv = flickrService.echo();
		assertEquals(json, rv);
	}

	@Test
	public void testGetPhotos() throws Exception {
		final Map<String, Object> json = new HashMap<String, Object>();		
		new Expectations() {{
			mockTemplate.getForObject(anyString, Map.class, (Map) any);
			result = new Delegate() {
				Map delegate(String uri, Class<?> clazz, Map<String, Object> params) {
					assertTrue(uri.contains("extras=geo"));
					assertEquals("flickr.photos.getWithGeoData", params.get("method"));
					assertEquals("2014-01-01", params.get("min_taken_date"));
					assertEquals("2014-01-02", params.get("max_taken_date"));					
					return json;
				}
			};						
		}};
		
		Map<String, Object> rv = flickrService.getPhotoSummaries("20140101");
		assertEquals(json, rv);
		
	}
	
}
