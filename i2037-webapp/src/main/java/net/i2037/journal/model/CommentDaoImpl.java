package net.i2037.journal.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Tuple;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(readOnly=true)
public class CommentDaoImpl implements CommentDao {
	
	public Comment newEntity() {
		return new Comment();
	}
	
	private static final String QUERY_BY_ENTITY = "select c from net.i2037.journal.model.Comment as c"
			+ " inner join c.timeLineEntry as t where t.refId = :refId and t.type = :entryType";
	
	private static final String COUNT_BY_DAY = "select count(c), date(t.time)"
			+ " from net.i2037.journal.model.Comment as c"
			+ " inner join c.timeLineEntry as t"
			+ " where t.time between :start and :end"
			+ " group by date(t.time)";
	
	private SessionFactory sessionFactory;
	
	@Override
	@Transactional(readOnly=false)
	public void create(Comment comment) {
		sessionFactory.getCurrentSession().save(comment);
	}

	@Override
	@Transactional(readOnly=false)
	public void update(Comment comment) {
		sessionFactory.getCurrentSession().update(comment);
	}

	@Override
	@Transactional(readOnly=false)
	public void delete(Comment comment) {
		sessionFactory.getCurrentSession().delete(comment);
	}

	@Override
	public Comment readById(long id) {
		Session session = sessionFactory.getCurrentSession();		
		return (Comment) session.byId(Comment.class).load(id);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Comment> queryByTimelineEntry(String refId, EntryType type) {
		Query query = sessionFactory.getCurrentSession().createQuery(QUERY_BY_ENTITY);
		query.setString("refId", refId);
		query.setParameter("entryType", type);
		return query.list();
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public List<? extends CommentCount> countByDay(Date from, Date to) {
		Query query = sessionFactory.getCurrentSession().createQuery(COUNT_BY_DAY);
		query.setDate("start", from);
		query.setDate("end", to);
		List<?> rows = query.list();
		List<CommentCount> counts = new ArrayList<CommentCount>(rows.size());
		for (Object row : rows) {
			Object[] cols = (Object[]) row;
			CommentCount c = new CommentCount();
			c.setCount((Long) cols[0]);
			c.setDay((Date) cols[1]);
			counts.add(c);
		}		
		return counts;
	}

}
