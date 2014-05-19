package net.i2037.cellar.model;

import java.io.Serializable;

public class UserDto implements Serializable, User {

	private Long userId;
	private String userName;
	private String foreName;
	private String lastName;

	@Override
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Override
	public Long getId() {
		return userId;
	}

	public void setId(Long userId) {
		this.userId = userId;
	}

	@Override
	public String getForeName() {
		return foreName;
	}

	public void setForeName(String foreName) {
		this.foreName = foreName;
	}

	@Override
	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
}
