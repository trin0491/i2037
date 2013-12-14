package net.i2037.moves;

import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.codehaus.jackson.JsonNode;

@Path("/moves/user/")
@Produces("application/json")
@Consumes("application/json")
public interface MovesService {

	@GET
	@Path("/profile")
	Map<String, Object> getUserProfile();	
	
	@GET
	@Path("/summary/daily/{date}/")
	List<?> getDailySummary(@PathParam("date") String date);
	
	@GET
	@Path("/places/daily/{date}")
	List<?> getDailyPlaces(@PathParam("date") String date);	
	
	@GET
	@Path("/storyline/daily/{date}")
	JsonNode getDailyStoryline(@PathParam("date") String date);
}
