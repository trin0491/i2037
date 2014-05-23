package net.i2037.cellar;

import static org.junit.Assert.*;

import java.util.Set;

import mockit.Expectations;
import mockit.Mocked;
import mockit.integration.junit4.JMockit;
import net.i2037.cellar.model.Role;
import net.i2037.cellar.model.UserDao;
import net.i2037.cellar.model.UserDetailDto;
import net.i2037.cellar.model.UserImpl;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.security.crypto.password.PasswordEncoder;

@RunWith(JMockit.class)
public class UserServiceImplTest {

	private static final Long USER_ID = 1L;

	private static final String USER_NAME = "aUser@somewhere.com";

	private static final String PASSWORD = "aPassword";

	private static final String FORENAME = "aForename";

	private static final String LAST_NAME = "aSurname";

	private UserServiceImpl userService;
	
	@Mocked
	private UserDao mockDao;
	
	@Mocked
	private PasswordEncoder mockPasswordEncoder;

	private UserImpl currentUser;
	
	@Before
	public void setUp() throws Exception {
		userService = new UserServiceImpl();
		userService.setPasswordEncoder(mockPasswordEncoder);
		userService.setUserDao(mockDao);
		
		currentUser = new UserImpl();
		currentUser.setId(USER_ID);
		currentUser.setUserName(USER_NAME);
		currentUser.setPassword(PASSWORD);
		currentUser.setForeName(FORENAME);
		currentUser.setLastName(LAST_NAME);
	}

	private UserDetailDto newUser() {
		UserDetailDto dto = new UserDetailDto();
		dto.setId(USER_ID);
		dto.setUserName(USER_NAME);
		dto.setForeName(FORENAME);
		dto.setLastName(LAST_NAME);
		dto.setPassword(PASSWORD);
		return dto;
	}

	private void expectGetCurrentUser() {
		new Expectations() {{
			mockDao.getCurrentUser(); result = currentUser;
		}};		
	}
	
	@Test(expected=SecurityException.class)
	public void testUpdateWithNoId() {
		UserDetailDto dto = newUser();
		dto.setId(null);
		
		expectGetCurrentUser();
		
		userService.update(dto);
	}

	@Test(expected=IllegalArgumentException.class)
	public void testUpdateWithNoUsername() {
		UserDetailDto dto = newUser();
		dto.setUserName(null);
		userService.update(dto);
	}

	@Test(expected=IllegalArgumentException.class)
	public void testUpdateWithNullPassword() {
		UserDetailDto dto = newUser();
		dto.setPassword(null);
		userService.update(dto);
	}
	
	@Test(expected=IllegalArgumentException.class)
	public void testUpdateWithShortPassword() throws Exception {
		UserDetailDto dto = newUser();
		dto.setPassword("short");
		userService.update(dto);		
	}
	
	@Test(expected=SecurityException.class)
	public void testUpdateForDifferentUser() throws Exception {
		UserDetailDto dto = newUser();
		dto.setId(3L);
		
		expectGetCurrentUser();
		
		userService.update(dto);		
	}
	
	@Test
	public void testUpdate() throws Exception {
		UserDetailDto dto = newUser();
		final String password = "aNewPassword";
		dto.setPassword(password);
		expectGetCurrentUser();
		expectEncodePassword(password);
		userService.update(dto);
		assertEquals(USER_ID, currentUser.getId());
		assertEquals(USER_NAME, currentUser.getUserName());
		assertEquals(FORENAME, currentUser.getForeName());
		assertEquals(LAST_NAME, currentUser.getLastName());
		assertEquals(password, currentUser.getPassword());
	}

	private void expectEncodePassword(final String password) {
		new Expectations() {{
			mockPasswordEncoder.encode(password); result = password;
		}};
	}
}
