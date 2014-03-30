package net.i2037.cellar;

import java.util.Collections;

import net.i2037.cellar.model.NewUser;
import net.i2037.cellar.model.Role;
import net.i2037.cellar.model.RoleImpl;
import net.i2037.cellar.model.User;
import net.i2037.cellar.model.UserDao;
import net.i2037.cellar.model.UserDto;
import net.i2037.cellar.model.UserImpl;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserServiceImpl implements UserService {

	private UserDao userDao;
	
	private PasswordEncoder passwordEncoder;
	
	private static UserDto newUserDto(User user) {
		if (user == null) {
			return null;
		}		
		UserDto dto = new UserDto();
		dto.setId(user.getId());
		dto.setUserName(user.getUserName());
		return dto;
	}
	
	@Override
	public UserDto getCurrentUser() {
		UserImpl user = userDao.getCurrentUser();
		UserDto dto = newUserDto(user);
		return dto;			
	}

	@Override
	public void create(NewUser newUser) {
		
		UserImpl user = new UserImpl();
		user.setId(newUser.getId());
		
		String encodedPassword = passwordEncoder.encode(newUser.getPassword());
		user.setPassword(encodedPassword);
		user.setUserName(newUser.getUserName());
		user.setForeName(newUser.getForeName());
		user.setLastName(newUser.getLastName());		
		
		RoleImpl role = new RoleImpl();
		role.setValue(Role.USER);
		
		user.setRoles(Collections.singleton(role));
		userDao.create(user);
	}

	@Override
	@Secured({Role.ADMIN})
	public UserDto readById(long id) {
		User user = userDao.readById(id);
		UserDto dto = newUserDto(user);
		return dto;
	}

	public UserDao getUserDao() {
		return userDao;
	}

	@Required
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	public PasswordEncoder getPasswordEncoder() {
		return passwordEncoder;
	}

	@Required
	public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
	}

}
