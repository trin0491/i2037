package net.i2037.journal.model;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(readOnly=true)
public class CommentDaoImpl implements CommentDao {

	private static final String ALL_COMMENTS_QUERY = "from net.i2037.journal.model.CommentImpl";
	private SessionFactory sessionFactory;

	private CommentImpl toEntity(Comment comment) {
		return new CommentImpl(comment);
	}	
	
	@Override
	@Transactional(readOnly=false)
	public void create(Comment comment) {
		CommentImpl entity = toEntity(comment);
		sessionFactory.getCurrentSession().save(entity);
	}

	@Override
	@Transactional(readOnly=false)
	public void update(Comment comment) {
		CommentImpl entity = toEntity(comment);
		sessionFactory.getCurrentSession().update(entity);
	}

	@Override
	@Transactional(readOnly=false)
	public void delete(Comment comment) {
		CommentImpl entity = toEntity(comment);
		sessionFactory.getCurrentSession().delete(entity);
	}

	@Override
	public Comment readById(Long id) {
		Session session = sessionFactory.getCurrentSession();
		return (Comment) session.get(CommentImpl.class, id);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Comment> query(String entryId) {
		Query query = sessionFactory.getCurrentSession().createQuery(ALL_COMMENTS_QUERY);
		return query.list();
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

}
