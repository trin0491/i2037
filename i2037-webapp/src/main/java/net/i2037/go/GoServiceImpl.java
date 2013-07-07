package net.i2037.go;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;

import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.rs.security.oauth2.client.OAuthClientUtils;
import org.apache.cxf.rs.security.oauth2.client.OAuthClientUtils.Consumer;
import org.apache.cxf.rs.security.oauth2.common.ClientAccessToken;
import org.apache.cxf.rs.security.oauth2.grants.code.AuthorizationCodeGrant;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

public class GoServiceImpl implements GoService {

	private MovesOAuth oauth;

	private GoServiceImpl() {
		oauth = new MovesOAuth();
	}

	@Override
	public Response authorise() {
		return Response.seeOther(oauth.getAuthorisationURI()).build();
	}

	@Override
	public GoUserProfile callback(String code, String state) {
		System.out.println(code);

		AuthorizationCodeGrant grant = new AuthorizationCodeGrant(code);
		ClientAccessToken accessToken = oauth.getAccessToken(grant);

		JacksonJsonProvider provider = new JacksonJsonProvider();
		WebClient userProfileClient = WebClient.create(
				"https://api.moves-app.com/api/v1/user/profile",
				Arrays.asList(provider));
		userProfileClient.header(HttpHeaders.AUTHORIZATION,
				oauth.getAuthorisationHeader(accessToken));

		try {
			return userProfileClient.accept(MediaType.APPLICATION_JSON_TYPE)
					.get(GoUserProfile.class);
		} catch (NotAuthorizedException ex) {
			ex.printStackTrace();
			throw new WebApplicationException(ex);
		}
	}

	@Override
	public GoUserProfile getUserProfile() {
		JacksonJsonProvider provider = new JacksonJsonProvider();
		WebClient userProfileClient = WebClient.create(
				"https://api.moves-app.com/api/v1/user/profile",
				Arrays.asList(provider));
		userProfileClient.header(HttpHeaders.AUTHORIZATION,
				oauth.getAuthorisationHeader(oauth.getAccessToken()));
		return userProfileClient.accept(MediaType.APPLICATION_JSON_TYPE).get(
				GoUserProfile.class);
	}
}
