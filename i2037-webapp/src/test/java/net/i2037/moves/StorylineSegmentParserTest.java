package net.i2037.moves;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import net.i2037.journal.TimeLineEntryDto;
import net.i2037.journal.model.EntryType;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.junit.Before;
import org.junit.Test;

public class StorylineSegmentParserTest {

	private static final String BAD_JSON = "StorylineBad.json";
	private static final String GOOD_JSON = "Storyline.json";
	private StorylineSegmentParser parser;
	private JsonNode rootNode;
	
	@Before
	public void setUp() throws Exception {
		parser = new StorylineSegmentParser();
		rootNode = read(GOOD_JSON);
	}

	private JsonNode read(String file) throws JsonProcessingException, IOException {
		ObjectMapper m = new ObjectMapper();
		InputStream in = StorylineSegmentParserTest.class.getResourceAsStream(file);
		return m.readTree(in);
	}
	
	private TimeLineEntryDto parse(int i) {
		JsonNode node = rootNode.path(0).path("segments").path(i);
		return parser.parse(node);
	}
	
	@Test
	public void testEntryType() {
		assertEquals(EntryType.MOVES_PLACE, parse(0).getType());
		assertEquals(EntryType.MOVES_MOVE, parse(1).getType());
	}
	
	@Test(expected=IllegalArgumentException.class)
	public void testMissingEntryType() throws Exception {
		rootNode = read(BAD_JSON);
		parse(0);		
	}
	
	@Test
	public void testTime() throws Exception {
		DateTimeFormatter formatter = ISODateTimeFormat.basicDateTimeNoMillis();
		Date date = formatter.parseDateTime("20121212T000000Z").toDate();
		assertEquals(date, parse(0).getTime());
	}
	
	@Test(expected=IllegalArgumentException.class)
	public void testMissingTime() throws Exception {
		rootNode = read(BAD_JSON);
		parse(1);
	}
	
	@Test
	public void testPayload() throws Exception {
		Object payload = parse(0).getPayload();
		assertNotNull(payload);
		assertEquals(rootNode.path(0).path("segments").path(0), payload);
	}
	
	@Test
	public void testPlaceRefId() throws Exception {
		assertEquals("20121212T000000Z-1", parse(0).getRefId());
	}
	
	@Test
	public void testMoveRefId() throws Exception {
		assertEquals("20121212T071430Z", parse(1).getRefId());
	}
	
	@Test
	public void testEntryId() throws Exception {
		assertNull(parse(0).getEntryId());
		assertNull(parse(1).getEntryId());
	}
}
