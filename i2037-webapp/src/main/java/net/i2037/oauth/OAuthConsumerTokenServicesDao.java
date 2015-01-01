package net.i2037.oauth;

import net.i2037.cellar.model.UserDao;
import net.i2037.cellar.model.UserImpl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth.consumer.OAuthConsumerToken;
import org.springframework.security.oauth.consumer.token.OAuthConsumerTokenServices;
import org.springframework.transaction.annotation.Transactional;

public class OAuthConsumerTokenServicesDao implements OAuthConsumerTokenServices {

	private SessionFactory sessionFactory;
	private UserDao userDao;
	
	@Override
	@Transactional(readOnly=true)
	public OAuthConsumerToken getToken(String resourceId)
			throws AuthenticationException {		
		String tokenId = getTokenId(resourceId);		
		Session session = sessionFactory.getCurrentSession();
		OAuthConsumerTokenImpl tokenEntity = (OAuthConsumerTokenImpl) session.get(OAuthConsumerTokenImpl.class, tokenId);
		if (tokenEntity != null) {
			return tokenEntity.toToken();
		} else {
			return null;
		}
	}

	private String getTokenId(String resourceId) {
		UserImpl currentUser = userDao.getCurrentUser();
		Long userId = currentUser.getId();
		return String.valueOf(userId) + "-" + resourceId;
	}

	@Override
	@Transactional
	public void storeToken(String resourceId, OAuthConsumerToken token) {
		String tokenId = getTokenId(resourceId);
		OAuthConsumerTokenImpl tokenEntity = new OAuthConsumerTokenImpl(token);
		tokenEntity.setTokenId(tokenId);
		sessionFactory.getCurrentSession().saveOrUpdate(tokenEntity);
	}

	@Override
	@Transactional
	public void removeToken(String resourceId) {
		String tokenId = getTokenId(resourceId);
		OAuthConsumerTokenImpl tokenEntity = new OAuthConsumerTokenImpl();
		tokenEntity.setTokenId(tokenId);
		sessionFactory.getCurrentSession().delete(tokenEntity);
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

}
