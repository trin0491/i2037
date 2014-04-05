package net.i2037.journal;

import static org.junit.Assert.*;

import java.util.Iterator;

import org.joda.time.DateTime;
import org.joda.time.Days;
import org.joda.time.Interval;
import org.joda.time.ReadablePeriod;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.junit.Before;
import org.junit.Test;

public class IntervalSplitterTest {
	
	private static final DateTimeFormatter DATE_TIME_FORMATTER = ISODateTimeFormat.basicDateTime().withOffsetParsed(); 
	
	private DateTime start;
	private DateTime end;
	
	@Before
	public void setUp() throws Exception {
		start = DATE_TIME_FORMATTER.parseDateTime("20140323T000000.000Z");
		end = DATE_TIME_FORMATTER.parseDateTime("20140430T000000.000Z");
	}

	@Test
	public void testIntervalLessThanSubInterval() {
		end = DATE_TIME_FORMATTER.parseDateTime("20140330T000000.000Z");
		Iterator<Interval> itr = newSplitter(Days.days(30));	
		Interval subIntr = next(itr);
		assertNotNull(subIntr);
		assertEquals(start, subIntr.getStart());
		assertEquals(end, subIntr.getEnd());
		assertFalse(itr.hasNext());
	}

	@Test
	public void testContainsExactlyTwo() throws Exception {
		end = DATE_TIME_FORMATTER.parseDateTime("20140325T000000.000Z");		
		Iterator<Interval> itr = newSplitter(Days.ONE);
		Interval i = next(itr);
		assertEquals(start, i.getStart());
		DateTime expected = DATE_TIME_FORMATTER.parseDateTime("20140324T000000.000Z");
		assertEquals(expected, i.getEnd());
		i = next(itr);
		assertEquals(expected, i.getStart());
		assertEquals(end, i.getEnd());
	}
	
	@Test
	public void testContainsTwo() throws Exception {
		start = DATE_TIME_FORMATTER.parseDateTime("20140223T000000.000Z");
		end = DATE_TIME_FORMATTER.parseDateTime("20140405T000000.000Z");		
		Iterator<Interval> itr = newSplitter(Days.days(30));
		Interval i = next(itr);
		assertEquals(start, i.getStart());
		DateTime expected = DATE_TIME_FORMATTER.parseDateTime("20140325T000000.000Z");
		assertEquals(expected, i.getEnd());
		i = next(itr);
		assertEquals(expected, i.getStart());
		assertEquals(end, i.getEnd());
		
	}

	private Interval next(Iterator<Interval> itr) {
		assertTrue(itr.hasNext());
		Interval i = itr.next();
		return i;
	}

	private Iterator<Interval> newSplitter(ReadablePeriod period) {
		Interval interval = new Interval(start, end);
		IntervalSplitter intervals = new IntervalSplitter(interval, period);
		Iterator<Interval> itr = intervals.iterator();
		assertNotNull(itr);
		return itr;
	}
}
