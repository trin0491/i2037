package net.i2037.cellar.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table( name = "user", uniqueConstraints= @UniqueConstraint(columnNames="username"))
public class UserImpl implements UserDetails, Serializable {
	
	private static final long serialVersionUID = 1L;
		
	public UserImpl() { }

	private Long id;

	@Id
	@GeneratedValue(generator="increment")
	@GenericGenerator(name="increment", strategy = "increment")
	@Override
	public Long getId() {
		return id;
	}

	public void setId(Long userId) {
		this.id = userId;
	}

	@Email
	private String userName;

	@Override
	@Column(unique=true, nullable=false, name="username")		
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@NotEmpty
	private String password;

	@Override
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	private Set<? extends Role> roles;

	@Override
	@ManyToMany(targetEntity=RoleImpl.class)
	@JoinTable(name="user_role")
	public Set<? extends Role> getRoles() {
		return roles;
	}
	
	public void setRoles(Set<? extends Role> roles) {
		this.roles = roles;
	}

	@NotEmpty
	private String foreName;

	public String getForeName() {
		return foreName;
	}

	public void setForeName(String foreName) {
		this.foreName = foreName;
	}

	@NotEmpty
	private String lastName;

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	@Override
	public String toString() {
		final int maxLen = 10;
		StringBuilder builder = new StringBuilder();
		builder.append("UserImpl [id=");
		builder.append(id);
		builder.append(", userName=");
		builder.append(userName);
		builder.append(", password=");
		builder.append("**PROTECTED**");
		builder.append(", roles=");
		builder.append(roles != null ? toString(roles, maxLen) : null);
		builder.append(", foreName=");
		builder.append(foreName);
		builder.append(", lastName=");
		builder.append(lastName);
		builder.append("]");
		return builder.toString();
	}

	private String toString(Collection<?> collection, int maxLen) {
		StringBuilder builder = new StringBuilder();
		builder.append("[");
		int i = 0;
		for (Iterator<?> iterator = collection.iterator(); iterator.hasNext()
				&& i < maxLen; i++) {
			if (i > 0)
				builder.append(", ");
			builder.append(iterator.next());
		}
		builder.append("]");
		return builder.toString();
	}
	
}
