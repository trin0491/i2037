package net.i2037.oauth;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth.consumer.OAuthConsumerToken;
import org.springframework.security.oauth.consumer.token.OAuthConsumerTokenServices;

@Entity
@Table(name = "oauth_consumer_token")
public class OAuthConsumerTokenImpl {

	private String tokenId;
	private String resourceId;
	private String value;
	private String secret;
	private boolean accessToken;
	private Map<String, String> additionalParameters;

	public OAuthConsumerTokenImpl() {

	}

	public OAuthConsumerTokenImpl(OAuthConsumerToken copy) {
		this.setResourceId(copy.getResourceId());
		this.setValue(copy.getValue());
		this.setSecret(copy.getSecret());
		this.setAccessToken(copy.isAccessToken());
		if (copy.getAdditionalParameters() != null) {
			this.setAdditionalParameters(new HashMap<String, String>(copy
					.getAdditionalParameters().size()));
			for (Entry<String, String> param : copy.getAdditionalParameters().entrySet()) {
				this.getAdditionalParameters().put(param.getKey(), param.setValue(getValue()));
			}
		}
	}

	@Id
	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	public String getResourceId() {
		return resourceId;
	}

	public void setResourceId(String resourceId) {
		this.resourceId = resourceId;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public boolean isAccessToken() {
		return accessToken;
	}

	public void setAccessToken(boolean accessToken) {
		this.accessToken = accessToken;
	}

	@Transient // TODO
	public Map<String, String> getAdditionalParameters() {
		return additionalParameters;
	}

	public void setAdditionalParameters(Map<String, String> additionalParameters) {
		this.additionalParameters = additionalParameters;
	}

	public OAuthConsumerToken toToken() {
		OAuthConsumerToken token = new OAuthConsumerToken();
		token.setAccessToken(this.isAccessToken());
		token.setAdditionalParameters(getAdditionalParameters());
		token.setResourceId(getResourceId());
		token.setSecret(getSecret());
		token.setValue(getValue());
		return token;
	}

}
