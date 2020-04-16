import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  // with useCallback, it will only run once and not re-run thereafter
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    // Either we have an existing expirationDate or we create a new one
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    
    setTokenExpirationDate(tokenExpirationDate);
    
    // Access browser API localStorage and add an entry called userData and store a text by stringifying JSON object
    localStorage.setItem(
      'userData', JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    //remove the property userData from the localStorage when we logout
    localStorage.removeItem('userData');
  }, []);

  // For logging out once token expires
  useEffect(() => {
    if(token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // For keeping user logged in after browser refresh
  // useEffect runs after the render cycle. 
  useEffect(() => {
    // Access browser API and get data stored in userData which will be in "JSON" text
    // Use JSON parse to convert the text back to JSON object format
    const storedData = JSON.parse(localStorage.getItem('userData'));

    // If we have a token stored then we can log the user in. Also check if storedData expiration date has not expired
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };

}