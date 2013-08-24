package net.i2037.oauth2;

import java.io.Serializable;

import org.springframework.security.oauth2.common.OAuth2RefreshToken;

public class OAuth2RefreshTokenImpl implements OAuth2RefreshToken, Serializable {

	public static OAuth2RefreshTokenImpl valueOf(String value) {
		OAuth2RefreshTokenImpl token = new OAuth2RefreshTokenImpl();
		token.setValue(value);
		return token;
	}
	
	private String value;
	
	@Override
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return value;
	}

}
