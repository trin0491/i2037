package net.i2037.journal;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("/timeline")
@Produces("application/json")
public interface TimeLineService {

	@GET
	@Path("/daily/{date}")
	List<? extends TimeLineEntryDto> getDailyEntries(@PathParam("date") String date);
}
