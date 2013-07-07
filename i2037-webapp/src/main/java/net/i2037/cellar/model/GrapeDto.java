package net.i2037.cellar.model;

import java.io.Serializable;

public class GrapeDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2837139652266940421L;
	
	private Long grapeId;
	private String name;
	
	public GrapeDto() {
		
	}
	
	public GrapeDto(Grape grape) {
		this.setGrapeId(grape.getGrapeId());
		this.name = grape.getName();
	}
	
	public Long getGrapeId() {
		return grapeId;
	}

	public void setGrapeId(Long grapeId) {
		this.grapeId = grapeId;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
