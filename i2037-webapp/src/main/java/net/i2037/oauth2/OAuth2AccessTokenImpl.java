package net.i2037.oauth2;

import java.io.Serializable;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;

@Entity
@Table( name = "oauth_access_token" )
public class OAuth2AccessTokenImpl implements OAuth2AccessToken, Serializable {

	private String tokenId;
	private String tokenValue;
	private Set<String> scope;
	private OAuth2RefreshTokenImpl refreshToken;
	private String tokenType;
	private Date expiration;
	
	public OAuth2AccessTokenImpl() {		
	}
	
	public OAuth2AccessTokenImpl(OAuth2AccessToken accessToken) {
		setValue(accessToken.getValue());
		setScope(accessToken.getScope());
		OAuth2RefreshToken refreshToken2 = accessToken.getRefreshToken();
		if (refreshToken2 != null) {
			setRefreshToken(OAuth2RefreshTokenImpl.valueOf(refreshToken2.getValue()));
		}
		setTokenType(accessToken.getTokenType());
		setExpiration(accessToken.getExpiration());		
	}

	@Override
	@Transient
	public Map<String, Object> getAdditionalInformation() {
		return Collections.emptyMap();
	}

	@Override
	@Transient
	public Set<String> getScope() {
		return scope;
	}

	@Override
	public OAuth2RefreshTokenImpl getRefreshToken() {
		return refreshToken;
	}

	@Override
	public String getTokenType() {
		return tokenType;
	}

	@Override
	@Transient
	public boolean isExpired() {
		return getExpiration() != null && getExpiration().before(new Date());		
	}

	@Override
	public Date getExpiration() {
		return expiration;
	}

	@Override
	@Transient
	public int getExpiresIn() {
		return getExpiration() != null ? Long.valueOf((getExpiration().getTime() - System.currentTimeMillis()) / 1000L)
				.intValue() : 0;		
	}

	@Override
	public String getValue() {
		return tokenValue;
	}

	@Id
	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	public void setValue(String value) {
		this.tokenValue = value;
	}

	public void setScope(Set<String> scope) {
		this.scope = scope;
	}

	public void setRefreshToken(OAuth2RefreshTokenImpl refreshToken) {
		this.refreshToken = refreshToken;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	public void setExpiration(Date expiration) {
		this.expiration = expiration;
	}
	
}
