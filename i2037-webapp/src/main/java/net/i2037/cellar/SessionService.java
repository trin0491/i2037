package net.i2037.cellar;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import net.i2037.cellar.model.UserDto;

@Path("/session")
@Produces("application/json")
@Consumes({"application/json", "application/xml"})
public interface SessionService {

	@GET
	@Path("/user")
	UserDto getUser();
	
	@GET
	@Path("/loggedout")
	void logoutSuccess();
}