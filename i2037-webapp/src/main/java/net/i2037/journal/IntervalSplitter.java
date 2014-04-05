package net.i2037.journal;

import java.util.Iterator;

import org.joda.time.DateTime;
import org.joda.time.Interval;
import org.joda.time.MutableInterval;
import org.joda.time.ReadablePeriod;

import com.mysql.jdbc.NotImplemented;

public class IntervalSplitter implements Iterable<Interval> {

	private final Interval interval;
	private final ReadablePeriod subPeriod;
	
	public IntervalSplitter(Interval interval, ReadablePeriod subPeriod) {
		this.interval = interval;
		this.subPeriod = subPeriod;			
	}
	
	@Override
	public Iterator<Interval> iterator() {
		return new IntervalIterator();
	}

	private class IntervalIterator implements Iterator<Interval> {

		private DateTime start;
		
		private IntervalIterator() {
			this.start = interval.getStart();
		}
		
		@Override
		public boolean hasNext() {
			return interval.contains(start);
		}

		@Override
		public Interval next() {
			MutableInterval rv = interval.toMutableInterval();
			rv.setStart(start);
			rv.setPeriodAfterStart(subPeriod);
			if (interval.isBefore(rv.getEnd())) {
				rv.setEnd(interval.getEnd());
			}
			start = rv.getEnd();
			return rv.toInterval();
		}

		@Override
		public void remove() {
			throw new UnsupportedOperationException();
		}		
	}	
}
