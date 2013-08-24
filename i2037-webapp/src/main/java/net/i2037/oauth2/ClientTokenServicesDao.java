package net.i2037.oauth2;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.ClientKeyGenerator;
import org.springframework.security.oauth2.client.token.ClientTokenServices;
import org.springframework.security.oauth2.client.token.DefaultClientKeyGenerator;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.transaction.annotation.Transactional;

public class ClientTokenServicesDao implements ClientTokenServices {

	private SessionFactory sessionFactory;
	
	private ClientKeyGenerator keyGenerator = new DefaultClientKeyGenerator();
	
	@Override
	@Transactional(readOnly=true)
	public OAuth2AccessToken getAccessToken(
			OAuth2ProtectedResourceDetails resource,
			Authentication authentication) {		
		Session session = sessionFactory.getCurrentSession();		
		String id = getId(resource, authentication);
		return (OAuth2AccessToken) session.get(OAuth2AccessTokenImpl.class, id);
	}

	private String getId(OAuth2ProtectedResourceDetails resource,
			Authentication authentication) {
		return keyGenerator.extractKey(resource, authentication);
	}

	@Override
	@Transactional
	public void saveAccessToken(OAuth2ProtectedResourceDetails resource,
			Authentication authentication, OAuth2AccessToken accessToken) {
		Session session = sessionFactory.getCurrentSession();
		OAuth2AccessTokenImpl copy = new OAuth2AccessTokenImpl(accessToken);
		copy.setTokenId(getId(resource, authentication));
		session.saveOrUpdate(copy);
	}

	@Override
	@Transactional
	public void removeAccessToken(OAuth2ProtectedResourceDetails resource,
			Authentication authentication) {
		Session session = sessionFactory.getCurrentSession();
		String id = getId(resource, authentication);
		OAuth2AccessTokenImpl token = new OAuth2AccessTokenImpl();
		token.setTokenId(id);
		session.delete(token);
		
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

}
