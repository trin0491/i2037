package net.i2037.cellar.model;

public interface Wine {
	
	Long getWineId();
	
	String getName();
	
	String getDescription();
	
	Short getVintage();
		
	Short getRating();

	Long getGrapeId();	
}
