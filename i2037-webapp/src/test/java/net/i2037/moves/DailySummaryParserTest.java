package net.i2037.moves;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import net.i2037.journal.TimeLineSummaryDto;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.junit.Before;
import org.junit.Test;

public class DailySummaryParserTest {

	private static final String GOOD_JSON = "/net/i2037/moves/DailySummary.json";
	
	private DailySummaryParser parser;
	private JsonNode rootNode;
	
	@Before
	public void setUp() throws Exception {
		parser = new DailySummaryParser();
		rootNode = read(GOOD_JSON);
	}

	private JsonNode read(String file) throws JsonProcessingException, IOException {
		ObjectMapper m = new ObjectMapper();
		InputStream in = DailySummaryParserTest.class.getResourceAsStream(file);
		return m.readTree(in);
	}
	
	private TimeLineSummaryDto parse(int i) {
		JsonNode node = rootNode.path(i);
		return parser.parse(node);
	}
	
	@Test
	public void testParse() {
		DateTimeFormatter formatter = ISODateTimeFormat.basicDate();
		Date date = formatter.parseDateTime("20130315").toDate();
		TimeLineSummaryDto dto = parse(0);
		assertEquals(date, dto.getDate());
	}

}
