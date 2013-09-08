package net.i2037.oauth2;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.RedirectStrategy;

public class AngularRedirectStrategy implements RedirectStrategy {

	private static final Logger LOGGER = LoggerFactory.getLogger(AngularRedirectStrategy.class);
		
	private static class JSONRedirect implements Serializable {
		/**
		 * 
		 */
		private static final long serialVersionUID = 2917992213345709399L;

		private String redirectTo;
		
		public JSONRedirect(String url) {
			this.setRedirectTo(url);
		}

		public String getRedirectTo() {
			return redirectTo;
		}

		public void setRedirectTo(String redirectTo) {
			this.redirectTo = redirectTo;
		}
	}
	
	@Override
	public void sendRedirect(HttpServletRequest request, HttpServletResponse response,
			String url) throws IOException {		
		
		LOGGER.debug("Return JSON redirect to: {}", url);
		
		response.setContentType("application/json");
		JSONRedirect redirect = new JSONRedirect(url);
		
		ObjectMapper mapper = new ObjectMapper();
		PrintWriter writer = response.getWriter();
		mapper.writeValue(writer, redirect);
		writer.flush();
	}
}
