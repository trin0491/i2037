package net.i2037.flickr;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

import net.i2037.journal.TimeLineEntryDto;
import net.i2037.journal.model.EntryType;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.junit.Before;
import org.junit.Test;

public class FlickrPhotoSummaryParserTest {

	private static final String BAD_JSON = "/net/i2037/flickr/PhotoSummaryBad.json";
	private static final String GOOD_JSON = "/net/i2037/flickr/PhotoSummary.json";
	private FlickrPhotoSummaryParser parser;
	private JsonNode rootNode;
	@Before
	public void setUp() throws Exception {
		parser = new FlickrPhotoSummaryParser();
		rootNode = read(GOOD_JSON);
	}

	private JsonNode read(String file) throws JsonProcessingException, IOException {
		ObjectMapper m = new ObjectMapper();
		InputStream in = FlickrPhotoSummaryParserTest.class.getResourceAsStream(file);
		return m.readTree(in);
	}

	@Test(expected=IllegalArgumentException.class)
	public void testErrorResponse() throws Exception {
		rootNode = read(BAD_JSON);
		parser.parse(rootNode);
	}
	
	@Test
	public void testLength() throws Exception {
		List<TimeLineEntryDto> dtos = parser.parse(rootNode);
		assertNotNull(dtos);
		assertEquals(2, dtos.size());		
	}
	
	@Test
	public void testEntryId() throws Exception {
		List<TimeLineEntryDto> dtos = parser.parse(rootNode);
		assertNull(dtos.get(0).getEntryId());
		assertNull(dtos.get(1).getEntryId());						
	}

	@Test
	public void testRefId() throws Exception {
		List<TimeLineEntryDto> dtos = parser.parse(rootNode);		
		assertEquals("15407841921", dtos.get(0).getRefId());
		assertEquals("15224342850", dtos.get(1).getRefId());
	}
	
	@Test
	public void testEntryType() throws Exception {
		List<TimeLineEntryDto> dtos = parser.parse(rootNode);				
		assertEquals(EntryType.FLICKR_PHOTOS, dtos.get(0).getType());
		assertEquals(EntryType.FLICKR_PHOTOS, dtos.get(1).getType());		
	}

	@Test
	public void testTime() throws Exception {
		DateTimeFormatter formatter = ISODateTimeFormat.basicDateTimeNoMillis();		
		List<TimeLineEntryDto> dtos = parser.parse(rootNode);				
		Date expectedFirst = formatter.parseDateTime("20140930T065902Z").toDate();
		assertEquals(expectedFirst, dtos.get(0).getTime());
		
		Date expectedSecond = formatter.parseDateTime("20140930T065807Z").toDate();
		assertEquals(expectedSecond, dtos.get(1).getTime());
	}
	
	@Test
	public void testEndTime() throws Exception {
		DateTimeFormatter formatter = ISODateTimeFormat.basicDateTimeNoMillis();		
		List<TimeLineEntryDto> dtos = parser.parse(rootNode);				
		Date expectedFirst = formatter.parseDateTime("20140930T065902Z").toDate();
		assertEquals(expectedFirst, dtos.get(0).getEndTime());
		
		Date expectedSecond = formatter.parseDateTime("20140930T065807Z").toDate();
		assertEquals(expectedSecond, dtos.get(1).getEndTime());	
	}
	
	@Test
	public void testPayload() throws Exception {
		List<TimeLineEntryDto> dtos = parser.parse(rootNode);		
		assertEquals(rootNode.path("photos").path("photo").path(0), dtos.get(0).getPayload());
	}
}
