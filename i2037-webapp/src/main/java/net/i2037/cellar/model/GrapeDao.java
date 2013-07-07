package net.i2037.cellar.model;

import java.util.List;

public interface GrapeDao {
	
	public List<Grape> findAll();
	
	public void create(Grape grape);
	
	public void delete(Grape grape);
	
	public Long countAll();
}
