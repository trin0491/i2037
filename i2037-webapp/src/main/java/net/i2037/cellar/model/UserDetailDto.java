package net.i2037.cellar.model;

import java.io.Serializable;


public class UserDetailDto extends UserDto implements Serializable {
	
	private String password;
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("UserDetailDto [toString()=");
		builder.append(super.toString());
		builder.append("]");
		return builder.toString();
	}
}
