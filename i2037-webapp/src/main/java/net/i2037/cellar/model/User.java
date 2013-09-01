package net.i2037.cellar.model;

import java.util.Set;

public interface User {

	String getUsername();

	String getPassword();

	Set<? extends Role> getRoles();

}
