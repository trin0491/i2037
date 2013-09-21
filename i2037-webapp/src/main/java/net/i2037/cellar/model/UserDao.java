package net.i2037.cellar.model;

public interface UserDao {

	UserImpl readById(Long id);
	
	UserImpl readByUsername(String username);

	void create(UserImpl user);

}
