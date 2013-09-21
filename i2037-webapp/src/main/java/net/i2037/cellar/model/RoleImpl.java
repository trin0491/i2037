package net.i2037.cellar.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table( name = "role" )
public class RoleImpl implements Role, Serializable {
	
	public RoleImpl() { }
	
	@Id
	private String value;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}	
}
