package net.i2037.cellar.model;

public interface UserDao {

	UserImpl getCurrentUser();
	
	UserImpl readById(Long id);
	
	UserImpl readByUsername(String username);

	void create(UserImpl user);

	void update(UserImpl user);

}
