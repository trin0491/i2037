package net.i2037.cellar;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import net.i2037.cellar.model.GrapeDto;

@Path("/grapes")
@Produces("application/json")
@Consumes("application/json")
public interface GrapeService {

	@GET
	List<GrapeDto> findAll();

    @POST
	void create(GrapeDto grape);

	@GET
	@Path("/count")
	Integer countAll();

    @DELETE
    @Path("/{id}")
	void delete(@PathParam("id") Long id);

}