package net.i2037.flickr;

import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("/photos")
@Produces("application/json")
public interface FlickrService {

	@GET
	@Path("/daily/{date}")
	Map<String, Object> getPhotoSummaries(@PathParam("date") String date);
	
	@GET
	@Path("/echo")
	Map<String, Object> echo();
	
	@GET
	@Path("/login")
	Map<String, Object> login();
}
