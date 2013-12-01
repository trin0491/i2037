package net.i2037.journal.model;

import java.util.Date;
import java.util.List;

import org.hibernate.SessionFactory;

public class TimeLineEntryDaoImpl implements TimeLineEntryDao {

	private SessionFactory sessionFactory;
	
	@Override
	public TimeLineEntry getReference(Long id) {
		return (TimeLineEntry) sessionFactory.getCurrentSession().byId(TimeLineEntry.class).getReference(id);
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public TimeLineEntry newEntity() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void create(TimeLineEntry entry) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void delete(TimeLineEntry entry) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(TimeLineEntry entry) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<TimeLineEntry> queryByDateRange(Date start, Date end) {
		// TODO Auto-generated method stub
		return null;
	}

}
