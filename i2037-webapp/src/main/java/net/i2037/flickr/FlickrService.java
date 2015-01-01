package net.i2037.flickr;

import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.codehaus.jackson.JsonNode;

import net.i2037.journal.TimeLineFeed;

@Path("/photos")
@Produces("application/json")
public interface FlickrService {

	@GET
	@Path("/summaries")
	JsonNode getPhotoSummaries(@QueryParam("from") String from, @QueryParam("to") String to);
	
	@GET
	@Path("/echo")
	JsonNode echo();
	
	@GET
	@Path("/login")
	JsonNode login();
}
