package net.i2037.cellar.model;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(readOnly = true)
public class GrapeDaoImpl implements GrapeDao {

	private static final String ALL_QUERY = "from net.i2037.cellar.model.GrapeImpl";

	private static final String COUNT_QUERY = "select count(*) from net.i2037.cellar.model.GrapeImpl";
	
	private SessionFactory sessionFactory;

	@SuppressWarnings("unchecked")
	@Override
	public List<Grape> findAll() {
		return sessionFactory.getCurrentSession()
				.createQuery(ALL_QUERY).list();
	}
	
	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	@Transactional(readOnly=false)
	public void create(Grape grape) {
		sessionFactory.getCurrentSession().save(grape);
	}

	@Override
	@Transactional(readOnly=false)
	public void delete(Grape grape) {
		sessionFactory.getCurrentSession().delete(grape);
	}

	@Override
	public Long countAll() {
		Session session = sessionFactory.getCurrentSession();
		Long count = (Long) session.createQuery(COUNT_QUERY).uniqueResult();
		return count;
	}

}
