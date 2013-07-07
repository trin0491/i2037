package net.i2037.cellar.model;

import java.io.Serializable;

public class UserDto implements Serializable {

	private Long userId;
	private String userName;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
}
