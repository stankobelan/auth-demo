export class TokenHelper {
  static getToken(): string | null {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const token = userData._token;
        const tokenExpirationDate = new Date(userData._tokenExpirationDate);
        if (token && tokenExpirationDate > new Date()) {
          return token;
        } else {
          // Token has expired, remove user data
          localStorage.removeItem('userData');
          return null;
        }
      } catch (e) {
        // Invalid JSON in localStorage, remove corrupted data
        localStorage.removeItem('userData');
        return null;
      }
    }
    return null;
  }
}
