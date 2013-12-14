package net.i2037.journal;

import static org.junit.Assert.*;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import mockit.Expectations;
import mockit.Mocked;
import mockit.NonStrictExpectations;
import mockit.Verifications;
import mockit.integration.junit4.JMockit;
import net.i2037.journal.model.EntryType;
import net.i2037.journal.model.TimeLineEntry;
import net.i2037.journal.model.TimeLineEntryDao;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(JMockit.class)
public class TimeLineFeedLoaderTest {

	private static final Date START = new Date();
	private static final Date END = new Date(START.getTime() + 1);
	
	private TimeLineFeedLoader loader;
	
	private ExecutorService executorService;
	
	@Mocked
	private TimeLineEntryDao mockTimeLineEntryDao;
		
	@Mocked
	private TimeLineFeed mockFeed1;
	
	@Mocked
	private TimeLineFeed mockFeed2;
	
	@Before
	public void setUp() throws Exception {
		executorService = Executors.newSingleThreadExecutor();		
		loader = new TimeLineFeedLoader();
		loader.setExecutorService(executorService);
		loader.setTimeLineEntryDao(mockTimeLineEntryDao);
		loader.setTimeLineFeeds(Arrays.asList(mockFeed1, mockFeed2));
	}

	private TimeLineEntryDto toDto(TimeLineEntry entry) {
		TimeLineEntryDto dto = new TimeLineEntryDto();
		dto.setEntryId(entry.getEntryId());
		dto.setRefId(entry.getRefId());
		dto.setTime(entry.getTime());
		dto.setType(entry.getType());
		return dto;
	};
		
	@Test(expected=IllegalArgumentException.class)
	public void testStartDateIsNull() throws InterruptedException {
		loader.load(null, new Date());
	}
	
	@Test(expected=IllegalArgumentException.class)
	public void testEndDateIsNull() throws Exception {
		loader.load(new Date(), null);
	}
	
	@Test
	public void testFeedsReturnNothing() throws Exception {
		new NonStrictExpectations() {{
			mockTimeLineEntryDao.queryByDateRange(START, END); result = Collections.emptyList();
			mockFeed1.load(START, END); result = Collections.emptyList();
			mockFeed2.load(START, END); result = Collections.emptyList();
		}};
		
		List<? extends TimeLineEntryDto> entries = loader.load(START, END);
		assertNotNull(entries);
		assertTrue(entries.isEmpty());
	}
	
	@Test
	public void testFeedsReturnNothingOldDataShouldBeDeleted() throws Exception {
		final TimeLineEntry entry = newTimeLineEntry(new Date());
		final Collection<TimeLineEntry> existingEntries = Arrays.asList(entry);
		new NonStrictExpectations() {{
			mockTimeLineEntryDao.queryByDateRange(START, END); result = existingEntries;
			mockFeed1.load(START, END); result = Collections.emptyList();
			mockFeed2.load(START, END); result = Collections.emptyList();			
		}};
		
		List<? extends TimeLineEntryDto> entries = loader.load(START, END);
		assertNotNull(entries);
		assertTrue(entries.isEmpty());
		
		new Verifications() {{
			mockTimeLineEntryDao.delete(entry);
		}};
	}
	
	@Test
	public void testFeedsReturnAnEntryThatDoesNotExist() throws Exception {
		final TimeLineEntry entry = newTimeLineEntry(new Date());
		final TimeLineEntryDto dto = toDto(entry);
		final Collection<TimeLineEntry> existingEntries = Collections.emptyList();
		new NonStrictExpectations() {{
			mockTimeLineEntryDao.queryByDateRange(START, END); result = existingEntries;
			mockFeed1.load(START, END); result = Collections.emptyList();
			mockFeed2.load(START, END); result = Arrays.asList(dto);			
		}};
		
		List<? extends TimeLineEntryDto> entries = loader.load(START, END);
		assertNotNull(entries);
		assertEquals(1, entries.size());
		assertEquals(dto, entries.get(0));
		
		new Verifications() {{
			mockTimeLineEntryDao.create(entry);
		}};		
	}

	@Test
	public void testFeedsRetrurnAnEntryThatExists() throws Exception {
		final TimeLineEntry entry = newTimeLineEntry(new Date());
		final TimeLineEntryDto dto = toDto(entry);
		final Collection<TimeLineEntry> existingEntries = Arrays.asList(entry);
		new Expectations() {{
			mockTimeLineEntryDao.queryByDateRange(START, END); result = existingEntries;
			mockFeed1.load(START, END); result = Arrays.asList(dto);
			mockFeed2.load(START, END); result = Collections.emptyList();			
		}};

		List<? extends TimeLineEntryDto> entries = loader.load(START, END);
		assertNotNull(entries);
		assertEquals(1, entries.size());
		assertEquals(dto, entries.get(0));
	}
	
	@Test
	public void testEntriesAreSorted() throws Exception {
		final TimeLineEntry entry1 = newTimeLineEntry(START);
		final TimeLineEntry entry2 = newTimeLineEntry(END);
		final TimeLineEntryDto dto1 = toDto(entry1);
		final TimeLineEntryDto dto2 = toDto(entry2);
		final Collection<TimeLineEntry> existingEntries = Arrays.asList(entry1, entry2);
		new Expectations() {{
			mockTimeLineEntryDao.queryByDateRange(START, END); result = existingEntries;
			mockFeed1.load(START, END); result = Arrays.asList(dto2, dto1);
			mockFeed2.load(START, END); result = Collections.emptyList();			
		}};
		
		List<? extends TimeLineEntryDto> entries = loader.load(START, END);
		assertNotNull(entries);
		assertEquals(2, entries.size());
		assertEquals(dto1, entries.get(0));
		assertEquals(dto2, entries.get(1));				
	}
	
	private TimeLineEntry newTimeLineEntry(Date date) {
		TimeLineEntry entry = new TimeLineEntry();
		entry.setEntryId(date.getTime());
		entry.setTime(date);
		entry.setType(EntryType.MOVES_PLACE);
		return entry;
	}
}
