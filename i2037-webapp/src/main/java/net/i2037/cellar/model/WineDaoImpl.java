package net.i2037.cellar.model;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(readOnly = true)
public class WineDaoImpl implements WineDao {

	private static final String COUNT_QUERY = "select count(*) from net.i2037.cellar.model.WineImpl";

	private static final String ALL_WINES_QUERY = "from net.i2037.cellar.model.WineImpl";

	private SessionFactory sessionFactory;

	@SuppressWarnings("unchecked")
	@Override
	public List<Wine> findAll() {
		return sessionFactory.getCurrentSession().createQuery(ALL_WINES_QUERY)
				.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Wine> findAll(int index, int pageSize) {
		Query query = sessionFactory.getCurrentSession().createQuery(ALL_WINES_QUERY);
		query.setMaxResults(pageSize);
		query.setFirstResult(index);
		return query.list();
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	@Transactional(readOnly = false)
	public void create(Wine wine) {
		WineImpl copy = toEntity(wine);
		sessionFactory.getCurrentSession().save(copy);
	}

	@Override
	@Transactional(readOnly = false)
	public void delete(Wine wine) {
		WineImpl entity = toEntity(wine);
		sessionFactory.getCurrentSession().delete(entity);
	}

	@Override
	public Long countAll() {
		Session session = sessionFactory.getCurrentSession();
		Long count = (Long) session.createQuery(COUNT_QUERY).uniqueResult();
		return count;
	}

	@Override
	public Wine readById(Long wineId) {
		Session session = sessionFactory.getCurrentSession();
		return (Wine) session.get(WineImpl.class, wineId);
	}

	@Override
	@Transactional(readOnly = false)
	public void update(Wine wine) {
		WineImpl entity = toEntity(wine);
		sessionFactory.getCurrentSession().update(entity);
	}

	private WineImpl toEntity(Wine wine) {
		Session session = sessionFactory.getCurrentSession();
		WineImpl copy = new WineImpl(wine);
		if (wine.getGrapeId() != null) {
			GrapeImpl grape = (GrapeImpl) session.byId(GrapeImpl.class).getReference(wine.getGrapeId());
			copy.setGrape(grape);
		}
		return copy;
	}

}
