package net.i2037.cellar.model;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

public class UserDaoImpl implements UserDao {

	private static final String QUERY_BY_USERNAME = "from net.i2037.cellar.model.UserImpl where username = :username" ;
	private SessionFactory sessionFactory;
	
	@Override
	public User readById(Long id) {
		Session session = getSessionFactory().getCurrentSession();
		UserImpl userImpl = (UserImpl) session.get(UserImpl.class, id);
		return userImpl;
	}

	@Override
	public User readByUsername(String username) {
		Session session = getSessionFactory().getCurrentSession();
		User user = (User) session.createQuery(QUERY_BY_USERNAME).setString("username", username).uniqueResult();
		return user;
	}
	
	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
}
