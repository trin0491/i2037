package net.i2037.cellar.model;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table( name = "wine" )
public class WineImpl implements Wine, Serializable {

	private Long wineId;
	private String name;
	private String description;
	private Short vintage;
	private GrapeImpl grape;
		
	@Min(0)
	@Max(5)
	private Short rating;

	public WineImpl(Wine wine) {
		this.wineId = wine.getWineId();
		this.name = wine.getName();
		this.description = wine.getDescription();
		this.vintage = wine.getVintage();
		this.rating = wine.getRating();
	}

	public WineImpl() {
	}

	@Id
	@GeneratedValue(generator="increment")
	@GenericGenerator(name="increment", strategy = "increment")
	public Long getWineId() {
		return wineId;
	}

	public void setWineId(Long wineId) {
		this.wineId = wineId;
	}

	@Override
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public Short getVintage() {
		return vintage;
	}

	public void setVintage(Short vintage) {
		this.vintage = vintage;
	}

	@Override
	public Short getRating() {
		return rating;
	}

	public void setRating(Short rating) {
		this.rating = rating;
	}

	@ManyToOne
	public GrapeImpl getGrape() {
		return grape;
	}

	public void setGrape(GrapeImpl grape) {
		this.grape = grape;
	}

	@Override
	@Transient
	public Long getGrapeId() {
		if (this.getGrape() != null) {
			return this.getGrape().getGrapeId();
		} else {
			return null;
		}
	}	
}
