package net.i2037.cellar.util;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;


public class PasswordEncoderApp {

	public static void main(String[] args) {
		if (args.length < 2) {
			System.err.println("usage: PasswordEncoder <secret> <password>");
			System.exit(-1);
		}
		String secret = args[0];
		String plainTextPassword = args[1];
		
		PasswordEncoderApp app = new PasswordEncoderApp();
		
		app.encode(secret, plainTextPassword);		
	}

	private void encode(String secret, String plainText) {
		PasswordEncoder encoder = getPasswordEncoder(secret);	
		System.out.println(encoder.encode(plainText));
	}

	private PasswordEncoder getPasswordEncoder(String secret) {
		return new StandardPasswordEncoder(secret);
	}

}
