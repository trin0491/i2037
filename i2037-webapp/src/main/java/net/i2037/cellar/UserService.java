package net.i2037.cellar;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import net.i2037.cellar.model.NewUser;
import net.i2037.cellar.model.UserDto;

@Path("/user")
@Produces("application/json")
public interface UserService {

	@GET
	UserDto getCurrentUser();
	
	@POST
	void create(NewUser user);
	
	@GET
	@Path("/{id}")
	UserDto readById(@PathParam("id") long id);
	
}
