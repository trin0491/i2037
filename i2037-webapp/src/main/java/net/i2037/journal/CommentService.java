package net.i2037.journal;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import net.i2037.journal.model.CommentDto;

@Path("/comments")
@Produces("application/json")
@Consumes({"application/json", "application/xml"})
public interface CommentService {
	
	@GET
	List<CommentDto> query(@QueryParam("entryId") String entryId);
	
	@POST
	void create(CommentDto comment);
	
	@GET
	@Path("/{id}")
	CommentDto readById(@PathParam("id") Long id);
	
	@POST
	@Path("/{id}")
	void update(CommentDto comment);
	
	@DELETE
	@Path("/{id}")
	void delete(@PathParam("id") Long id);
}
