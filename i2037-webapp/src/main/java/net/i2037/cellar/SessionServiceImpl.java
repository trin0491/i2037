package net.i2037.cellar;

import net.i2037.cellar.model.UserDto;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SessionServiceImpl implements SessionService {

	@Override
	public UserDto getUser() {		
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) principal;
			UserDto user = new UserDto();
			user.setUserId(null);
			user.setUserName(userDetails.getUsername());
			return user;			
		} else {
			return null;
		}		
	}

	@Override
	public void logoutSuccess() {		
	}

}
