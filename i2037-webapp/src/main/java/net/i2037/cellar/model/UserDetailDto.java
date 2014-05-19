package net.i2037.cellar.model;

import java.io.Serializable;


public class UserDetailDto extends UserDto implements Serializable, User {
	
	private String password;
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
