package net.i2037.foursquare;

import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("/foursquare/")
@Produces("application/json")
@Consumes("application/json")
public interface FourSquareService {

	@GET
	@Path("/venue/{venueId}")
	public Map<String, Object> getVenue(@PathParam("venueId") String venueId);	
}
