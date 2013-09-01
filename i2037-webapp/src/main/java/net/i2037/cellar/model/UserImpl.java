package net.i2037.cellar.model;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table( name = "user" )
public class UserImpl implements User, Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String username;
	private String password;
	private Set<? extends Role> roles;
	
	public UserImpl() { }
	
	@Id
	@GeneratedValue(generator="increment")
	@GenericGenerator(name="increment", strategy = "increment")
	public Long getId() {
		return id;
	}

	public void setId(Long userId) {
		this.id = userId;
	}
	
	@Override
	public String getUsername() {
		return username;
	}

	public void setUsername(String userName) {
		this.username = userName;
	}

	@Override
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	@ManyToMany(targetEntity=RoleImpl.class)
	@JoinTable(name="user_role")
	public Set<? extends Role> getRoles() {
		return roles;
	}
	
	public void setRoles(Set<? extends Role> roles) {
		this.roles = roles;
	}
}
