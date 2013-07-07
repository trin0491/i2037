package net.i2037.cellar;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import net.i2037.cellar.model.Wine;
import net.i2037.cellar.model.WineDao;
import net.i2037.cellar.model.WineDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;

public class WineServiceImpl implements WineService {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(WineServiceImpl.class);

	private WineDao wineDao;
		
	@Override
	public List<WineDto> findAll() {
		LOGGER.info("Find all wines");
		List<Wine> wines = wineDao.findAll();
		return toDTOs(wines);
	}

	@Override
	public List<WineDto> query(int index, int pageSize) {
		LOGGER.info("Find all wines from {} to {}", index, pageSize);
		List<Wine> wines = wineDao.findAll(index, pageSize);
		return toDTOs(wines);
	}

	private List<WineDto> toDTOs(List<Wine> wines) {
		List<WineDto> copies = new ArrayList<WineDto>(wines.size());
		for (Wine wine : wines) {
			copies.add(toDto(wine));
		}
		return copies;
	}

	private WineDto toDto(Wine wine) {
		return new WineDto(wine);
	}

	@Override
	public void create(WineDto wine) {
		LOGGER.info("Create wine: {}", wine);
		wineDao.create(wine);
	}

	@Override
	public void delete(Long wineId) {
		this.delete(Collections.singletonList(wineId));
	}

	@Override
	public void delete(Collection<Long> wineIds) {
		LOGGER.info("Deleting wines: {}", wineIds);
		for (Long wineId : wineIds) {
			WineDto wine = new WineDto();
			wine.setWineId(wineId);
			wineDao.delete(wine);
		}
	}

	@Override
	public Integer countAll() {
		LOGGER.info("Counting wines");
		Long count = wineDao.countAll();
		return count.intValue();
	}

	@Override
	public WineDto readById(Long wineId) {
		LOGGER.info("Read wine by ID: {}", wineId);
		Wine wine = wineDao.readById(wineId);
		return toDto(wine);
	}

	@Override
	public void update(WineDto wine) {
		LOGGER.info("Updating wine: {}", wine);
		wineDao.update(wine);
	}

	public WineDao getWineDao() {
		return wineDao;
	}

	@Required
	public void setWineDao(WineDao wineDao) {
		this.wineDao = wineDao;
	}
}
