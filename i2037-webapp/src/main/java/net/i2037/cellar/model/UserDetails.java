package net.i2037.cellar.model;

import java.util.Set;

public interface UserDetails extends User {

	Set<? extends Role> getRoles();

	String getPassword();

}
