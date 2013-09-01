package net.i2037.cellar.model;

public interface UserDao {

	User readById(Long id);
	
	User readByUsername(String username);

}
