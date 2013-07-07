package net.i2037.cellar.model;

import java.io.Serializable;

public class WineDto implements Wine, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2367023618465277574L;
	
	private Long wineId;
	private Long grapeId;
	private String name;
	private String description;
	private Short vintage;
	private Short rating;

	public WineDto() {
		
	}
	
	public WineDto(Wine copy) {
		this.wineId = copy.getWineId();
		this.name = copy.getName();
		this.description = copy.getDescription();
		this.vintage = copy.getVintage();
		this.rating = copy.getRating();
		this.grapeId = copy.getGrapeId();
	}
	
	public Long getWineId() {
		return wineId;
	}

	public void setWineId(Long id) {
		this.wineId = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Short getVintage() {
		return vintage;
	}

	public void setVintage(Short vintage) {
		this.vintage = vintage;
	}

	public Short getRating() {
		return rating;
	}

	public void setRating(Short rating) {
		this.rating = rating;
	}

	public Long getGrapeId() {
		return grapeId;
	}

	public void setGrapeId(Long grapeId) {
		this.grapeId = grapeId;
	}
}
