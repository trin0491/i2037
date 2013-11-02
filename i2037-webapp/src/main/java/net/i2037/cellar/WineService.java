package net.i2037.cellar;

import java.util.Collection;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import net.i2037.cellar.model.WineDto;

@Path("/wines")
@Produces("application/json")
@Consumes({"application/json", "application/xml"})
public interface WineService {

    @GET
	List<WineDto> findAll();

    @GET    
	List<WineDto> query(@QueryParam("index") int index, @QueryParam("limit") int pageSize);

    @POST
	void create(WineDto wine);

    @DELETE
    @Path("/{id}")
	void delete(@PathParam("id") Long wineId);

	void delete(Collection<Long> wineIds);

	@GET
	@Path("/count")
	Integer countAll();

    @GET
    @Path("/{id}")
	WineDto readById(@PathParam("id") Long wineId);

    @POST
    @Path("/{id}")
	void update(WineDto wine);
}