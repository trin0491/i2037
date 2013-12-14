package net.i2037.journal.model;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(readOnly=true)
public class TimeLineEntryDaoImpl implements TimeLineEntryDao {

	private SessionFactory sessionFactory;
	
	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public TimeLineEntry newEntity() {
		return new TimeLineEntry();
	}

	@Override
	public TimeLineEntry readByReference(String id, EntryType type) {
		TimeLineEntry entry = (TimeLineEntry) sessionFactory.getCurrentSession()
			.createCriteria(TimeLineEntry.class)
			.add(Restrictions.naturalId()
					.set("refId", id)
					.set("type", type)).uniqueResult();
		return (TimeLineEntry) entry;
	}

	@Override
	@Transactional(readOnly=false)
	public void create(TimeLineEntry entry) {
		sessionFactory.getCurrentSession().save(entry);
	}

	@Override
	@Transactional(readOnly=false)	
	public void delete(TimeLineEntry entry) {
		sessionFactory.getCurrentSession().delete(entry);
	}

	@Override
	@Transactional(readOnly=false)	
	public void update(TimeLineEntry entry) {
		sessionFactory.getCurrentSession().update(entry);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TimeLineEntry> queryByDateRange(Date start, Date end) {
		Criteria crit = sessionFactory.getCurrentSession().createCriteria(TimeLineEntry.class);
		crit.add( Restrictions.between("time", start, end));
		return crit.list();
	}

	@Override
	public TimeLineEntry readById(Long entryId) {
		return (TimeLineEntry) sessionFactory.getCurrentSession().byId(TimeLineEntry.class).getReference(entryId);
	}
}
