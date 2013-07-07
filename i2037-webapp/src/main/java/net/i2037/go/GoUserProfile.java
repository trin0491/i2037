package net.i2037.go;

public class GoUserProfile {

	private String userId;
	private Profile profile;
		
	public static class Profile {
		private String firstDate;

		public String getFirstDate() {
			return firstDate;
		}

		public void setFirstDate(String firstDate) {
			this.firstDate = firstDate;
		}
	}
	
	public Profile getProfile() {
		return profile;
	}
	
	public void setProfile(Profile profile) {
		this.profile = profile;
	}
	
	public String getUserId() {
		return userId;
	}
	
	public void setUserId(String userId) {
		this.userId = userId;
	}
}
