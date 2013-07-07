package net.i2037.go;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

@Path("/go")
@Produces("application/json")
@Consumes("application/json")
public interface GoService {

	@GET
	@Path("/callback")
	public GoUserProfile callback(@QueryParam("code") String code, @QueryParam("state") String state);

	@GET
	@Path("/authorise")
	Response authorise();

	@GET
	@Path("userProfile")
	GoUserProfile getUserProfile();	
}
