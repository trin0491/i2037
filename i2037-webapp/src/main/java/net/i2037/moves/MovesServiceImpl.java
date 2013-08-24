package net.i2037.moves;

import java.util.List;
import java.util.Map;

import org.springframework.web.client.RestTemplate;

public class MovesServiceImpl implements MovesService {

	private static final String MOVES_API_V1 = "https://api.moves-app.com/api/v1/";
	
	private RestTemplate movesTemplate;

	private String getUrl(String suffix) {
		return MOVES_API_V1 + suffix;
	}
	
	@Override
	public Map<String, Object> getUserProfile() {
		return movesTemplate.getForObject(getUrl("user/profile"), Map.class);
	}

	public RestTemplate getMovesTemplate() {
		return movesTemplate;
	}

	public void setMovesTemplate(RestTemplate movesTemplate) {
		this.movesTemplate = movesTemplate;
	}

	@Override
	public List<?> getDailySummary(String date) {
		return movesTemplate.getForObject(getUrl("user/summary/daily/" + date), List.class);
	}

	@Override
	public List<?> getDailyPlaces(String date) {
		return movesTemplate.getForObject(getUrl("user/places/daily/" + date), List.class);		
	}
}
