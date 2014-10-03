package net.i2037.cellar.util;

import java.util.concurrent.Callable;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth.consumer.OAuthSecurityContext;
import org.springframework.security.oauth.consumer.OAuthSecurityContextHolder;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

public abstract class RequestAwareCallable<T> implements Callable<T> {
	private final SecurityContext securityContext;
	private final RequestAttributes requestAttributes;
	private final OAuthSecurityContext oauthContext; // oauth 1	
	private Thread thread;

	public RequestAwareCallable() {
		this.securityContext = SecurityContextHolder.getContext();
		this.requestAttributes = RequestContextHolder.getRequestAttributes();
		oauthContext = OAuthSecurityContextHolder.getContext();
		this.thread = Thread.currentThread();
	}

	@Override
	public T call() throws Exception {
		try {
			SecurityContextHolder.setContext(securityContext);
			RequestContextHolder.setRequestAttributes(requestAttributes);
			OAuthSecurityContextHolder.setContext(oauthContext);
			return doCall();
		} finally {
			if (Thread.currentThread() != thread) {
				RequestContextHolder.resetRequestAttributes();
				SecurityContextHolder.clearContext();
				OAuthSecurityContextHolder.setContext(null);
			}
			thread = null;
		}
	}

	protected abstract T doCall() throws Exception;
}