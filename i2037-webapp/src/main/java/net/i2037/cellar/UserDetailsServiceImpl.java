package net.i2037.cellar;

import java.util.ArrayList;
import java.util.Collection;

import net.i2037.cellar.model.Role;
import net.i2037.cellar.model.UserDao;
import net.i2037.cellar.model.UserImpl;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

	private static UserDetails newUserDetails(UserImpl user) {
		Collection<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();
		for (Role role : user.getRoles()) {
			authorities.add(new SimpleGrantedAuthority(role.getValue()));
		}
		UserDetails userDetails = new org.springframework.security.core.userdetails.User(
				user.getUserName(), user.getPassword(), authorities);
		return userDetails;
	}

	private UserDao userDao;

	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		UserImpl user = userDao.readByUsername(username);
		return UserDetailsServiceImpl.newUserDetails(user);
	}

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

}
