package net.i2037.moves;

import java.net.URI;

import org.apache.cxf.rs.security.oauth2.client.OAuthClientUtils;
import org.apache.cxf.rs.security.oauth2.client.OAuthClientUtils.Consumer;
import org.apache.cxf.rs.security.oauth2.common.ClientAccessToken;
import org.apache.cxf.rs.security.oauth2.common.OAuthError;
import org.apache.cxf.rs.security.oauth2.grants.code.AuthorizationCodeGrant;
import org.apache.cxf.rs.security.oauth2.provider.OAuthServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MovesOAuth {

	private static final Logger LOGGER = LoggerFactory.getLogger(MovesOAuth.class);
	
	private static final String CLIENT_ID = "uQG9VcS74302R56wv7uiodigAXuKiCQV";
	private static final String SECRET = "k68CqGlc1uSa3ClUHIVRFbrFj8m45L977D5sW6qIn7TY3H9ywnIEPTfxyowbs92M";
	private static final String AUTH_SVC_URI = "https://api.moves-app.com/oauth/v1/authorize";

	private Consumer consumer;

	public MovesOAuth() {
		consumer = new Consumer(CLIENT_ID, SECRET);
	}

	public URI getAuthorisationURI() {
		String scope = "activity";
		return OAuthClientUtils.getAuthorizationURIBuilder(AUTH_SVC_URI,
				CLIENT_ID, scope).build();
		// URI uri = new
		// URI("https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id="
		// + CLIENT_ID + "&scope=activity")
	}

	public ClientAccessToken getAccessToken() {
		String code = "1aO2V7deHYYaS7y4k1VLT0HZH5JeA60HxkR99eiP70zihVEvP3qj2TXR2_W09ab5";
		AuthorizationCodeGrant grant = new AuthorizationCodeGrant(code);	
		return getAccessToken(grant);
	}
	
	public ClientAccessToken getAccessToken(AuthorizationCodeGrant grant) {
		try {
		return OAuthClientUtils.getAccessToken(
				"https://api.moves-app.com/oauth/v1/access_token", consumer,
				grant, false);
		} catch (OAuthServiceException e) {
			OAuthError err = e.getError();
			LOGGER.error("Failed to get access token error: {}, desc: {}", err.getError(), err.getErrorDescription());
			throw e;
		}
	}
	
	public String getAuthorisationHeader(ClientAccessToken accessToken) {
		return OAuthClientUtils.createAuthorizationHeader(accessToken);
	}
}
