package net.i2037.foursquare;

import java.util.Map;

import org.springframework.web.client.RestTemplate;

public class FourSquareServiceImpl implements FourSquareService {

	private static final String URL = "https://api.foursquare.com/v2/venues/4d7ab1dcc7fca143778121a2?client_id=MJTHR3UEY3DPQH3NTNFOVECMAB3AIZWFH3YUDOEXDPRED0HQ&client_secret=B1SLXUAG5SK05XND3NWB02DISYLKI2NWEYAJEED0302BWRDM&v=20131027";
	
	private RestTemplate fourSquareTemplate;
	
	@Override
	public Map<String, Object> getVenue(String venueId) {
		return fourSquareTemplate.getForObject(URL, Map.class);
	}

	public RestTemplate getFourSquareTemplate() {
		return fourSquareTemplate;
	}

	public void setFourSquareTemplate(RestTemplate fourSquareTemplate) {
		this.fourSquareTemplate = fourSquareTemplate;
	}

}
