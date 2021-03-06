package net.i2037.cellar.model;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly=true)
public class UserDaoImpl implements UserDao {

	private static final String QUERY_BY_USERNAME = "from net.i2037.cellar.model.UserImpl where username = :username" ;
	private SessionFactory sessionFactory;
	
	@Override
	public UserImpl getCurrentUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal == null) {
			throw new IllegalStateException("Failed to identify current user");
		}		
		if (principal instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) principal;
			UserImpl user = readByUsername(userDetails.getUsername());			
			return user;			
		} else {
			throw new IllegalStateException("Failed to identify current user");
		}				
	}
	
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

	@Override
	@Transactional(readOnly = false)	
	public void update(UserImpl user) {
		sessionFactory.getCurrentSession().update(user);				
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
