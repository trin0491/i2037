package net.i2037.cellar.model;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table( name = "grape" )
public class GrapeImpl implements Grape {

	private Long grapeId;
	private String name;
	private Set<WineImpl> wines;
	
	public GrapeImpl() {
		
	}
	
	public GrapeImpl(GrapeDto grape) {
		this.grapeId = grape.getGrapeId();
		this.name = grape.getName();
	}

	@Override
	@Id
	@GeneratedValue(generator="increment")
	@GenericGenerator(name="increment", strategy = "increment")
	public Long getGrapeId() {
		return grapeId;
	}

	@Override
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setGrapeId(Long id) {
		this.grapeId = id;
	}

	@OneToMany(mappedBy="grape", fetch=FetchType.LAZY)
	public Set<WineImpl> getWines() {
		return wines;
	}

	public void setWines(Set<WineImpl> wines) {
		this.wines = wines;
	}
}
