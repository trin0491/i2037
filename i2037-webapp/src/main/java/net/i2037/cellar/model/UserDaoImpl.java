package net.i2037.cellar.model;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly=true)
public class UserDaoImpl implements UserDao {

	private static final String QUERY_BY_USERNAME = "from net.i2037.cellar.model.UserImpl where username = :username" ;
	private SessionFactory sessionFactory;
	
	@Override
	public UserImpl readById(Long id) {
		Session session = getSessionFactory().getCurrentSession();
		UserImpl userImpl = (UserImpl) session.get(UserImpl.class, id);
		return userImpl;
	}

	@Override
	public UserImpl readByUsername(String username) {
		Session session = getSessionFactory().getCurrentSession();
		UserImpl user = (UserImpl) session.createQuery(QUERY_BY_USERNAME).setString("username", username).uniqueResult();
		return user;
	}
	
	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	@Transactional(readOnly=false)
	public void create(UserImpl user) {
		Session session = sessionFactory.getCurrentSession();
		session.save(user);
		
	}
}
