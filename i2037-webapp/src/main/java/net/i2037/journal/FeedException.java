package net.i2037.journal;

public class FeedException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FeedException() {
		super();
	}

	public FeedException(String message, Throwable cause) {
		super(message, cause);
	}

	public FeedException(String message) {
		super(message);
	}

	public FeedException(Throwable cause) {
		super(cause);
	}
	
}
