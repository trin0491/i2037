package net.i2037.cellar;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import net.i2037.cellar.model.Grape;
import net.i2037.cellar.model.GrapeDao;
import net.i2037.cellar.model.GrapeDto;
import net.i2037.cellar.model.GrapeImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;

public class GrapeServiceImpl implements GrapeService {

	private static final Logger LOGGER = LoggerFactory.getLogger(GrapeServiceImpl.class);

	private GrapeDao grapeDao;
	
	@Override
	public List<GrapeDto> findAll() {
		LOGGER.info("Find all grapes");		
		List<Grape> grapes = grapeDao.findAll();
		return toDTOs(grapes);
	}

	@Override
	public void create(GrapeDto grape) {
		LOGGER.info("Creating grape: {}", grape);
		Grape copy = new GrapeImpl(grape);
		grapeDao.create(copy);
	}

	@Override
	public Integer countAll() {
		LOGGER.info("Counting grapes");
		GrapeDao dao = getGrapeDao();
		return dao.countAll().intValue();
	}

	@Override
	public void delete(Long id) {
		LOGGER.info("Deleting grape: {}", id);
		delete(Collections.singletonList(id));
	}
	
	private void delete(Collection<Long> ids) {
		GrapeDao dao = getGrapeDao();
		for (Long grapeId : ids) {
			GrapeImpl grape = new GrapeImpl();
			grape.setGrapeId(grapeId);
			dao.delete(grape);
		}			
	}
	
	private List<GrapeDto> toDTOs(List<Grape> grapes) {
		List<GrapeDto> copies = new ArrayList<GrapeDto>(grapes.size());
		for (Grape grape : grapes) {
			copies.add(toDto(grape));
		}
		return copies;
	}

	private GrapeDto toDto(Grape grape) {
		return new GrapeDto(grape);
	}

	public GrapeDao getGrapeDao() {
		return grapeDao;
	}

	@Required
	public void setGrapeDao(GrapeDao grapeDao) {
		this.grapeDao = grapeDao;
	}
}
