package net.i2037.journal;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

@Path("/timeline")
@Produces("application/json")
public interface TimeLineService {

	@GET
	@Path("/daily/{date}")
	List<? extends TimeLineEntryDto> getDailyEntries(@PathParam("date") String date);
	
	@GET
	@Path("/summary/daily")
	List<? extends TimeLineSummaryDto> getDailySummary(@QueryParam("from") String from, @QueryParam("to") String to);

	@GET
	@Path("/summary/daily/{date}")
	TimeLineSummaryDto getDailySummary(@PathParam("date") String day);	
	
}
