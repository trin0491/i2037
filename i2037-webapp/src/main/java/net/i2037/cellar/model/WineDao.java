package net.i2037.cellar.model;

import java.util.List;

public interface WineDao {
	List<Wine> findAll();
	List<Wine> findAll(int index, int pageSize);
	void create(Wine wine);
	void delete(Wine wine);
	Long countAll();
	Wine readById(Long wineId);
	void update(Wine wine);
}