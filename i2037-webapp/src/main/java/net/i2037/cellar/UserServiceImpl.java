package net.i2037.cellar;

import java.util.Collections;

import net.i2037.cellar.model.UserDetailDto;
import net.i2037.cellar.model.Role;
import net.i2037.cellar.model.RoleImpl;
import net.i2037.cellar.model.User;
import net.i2037.cellar.model.UserDao;
import net.i2037.cellar.model.UserDto;
import net.i2037.cellar.model.UserImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.Assert;

public class UserServiceImpl implements UserService {

	private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class); 
	private static final int PASSWORD_MIN_LENGTH = 6;

	private UserDao userDao;
	
	private PasswordEncoder passwordEncoder;
	
	private static UserDto newUserDto(User user) {
		if (user == null) {
			return null;
		}		
		UserDto dto = new UserDto();
		dto.setId(user.getId());
		dto.setUserName(user.getUserName());
		dto.setForeName(user.getForeName());
		dto.setLastName(user.getLastName());
		return dto;
	}
	
	private void copyFromDto(UserDetailDto dto, UserImpl user) {
		user.setId(dto.getId());
		
		String encodedPassword = passwordEncoder.encode(dto.getPassword());
		user.setPassword(encodedPassword);
		user.setUserName(dto.getUserName());
		user.setForeName(dto.getForeName());
		user.setLastName(dto.getLastName());				
	}
	
	@Override
	public UserDto getCurrentUser() {
		UserImpl user = userDao.getCurrentUser();
		UserDto dto = newUserDto(user);
		return dto;			
	}
	
	@Override
	public void create(UserDetailDto newUser) {
		LOGGER.info("Creating user: {}", newUser);
		UserImpl user = new UserImpl();
		copyFromDto(newUser, user);		
		RoleImpl role = new RoleImpl();
		role.setValue(Role.USER);
		
		user.setRoles(Collections.singleton(role));
		userDao.create(user);
	}

	@Override
	@Secured({Role.ADMIN})
	public UserDto readById(long id) {
		LOGGER.info("Reading user with id: {}", id);
		UserImpl user = userDao.readById(id);
		UserDto dto = newUserDto(user);
		return dto;
	}

	@Override
	public void update(UserDetailDto dto) {
		validateDto(dto);		
		UserImpl currentUser = userDao.getCurrentUser();
		if (currentUser.getId() != dto.getId()) {
			throw new SecurityException();
		}		
		LOGGER.info("Updating userId: {} with {}", currentUser.getId(), dto);
		
		// prevent username amendments for the moment (security is covered with the id)
		if (!currentUser.getUserName().equals(dto.getUserName())) {
			throw new IllegalArgumentException("username");
		}
		copyFromDto(dto, currentUser);
		
		userDao.update(currentUser);
	}

	// TODO replace with proper IVF
	private void validateDto(UserDetailDto dto) {
		Assert.notNull(dto);
		Assert.hasLength(dto.getUserName());
		if (dto.getPassword() == null || dto.getPassword().length() < PASSWORD_MIN_LENGTH) {
			throw new IllegalArgumentException("password");
		}
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
