import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { configureAuth, login as apiLogin } from './api';

const TOKEN_KEY = 'tereverde_token';

// Somente o token JWT é guardado (nunca a senha). SecureStore não existe na web.
const storage = {
  get: () =>
    Platform.OS === 'web'
      ? Promise.resolve(globalThis.localStorage?.getItem(TOKEN_KEY) ?? null)
      : SecureStore.getItemAsync(TOKEN_KEY),
  set: (value) =>
    Platform.OS === 'web'
      ? Promise.resolve(globalThis.localStorage?.setItem(TOKEN_KEY, value))
      : SecureStore.setItemAsync(TOKEN_KEY, value),
  remove: () =>
    Platform.OS === 'web'
      ? Promise.resolve(globalThis.localStorage?.removeItem(TOKEN_KEY))
      : SecureStore.deleteItemAsync(TOKEN_KEY),
};

function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp * 1000 < Date.now();
  } catch {
    return false;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const tokenRef = useRef(null);

  const update = useCallback((value) => {
    tokenRef.current = value;
    setToken(value);
  }, []);

  const logout = useCallback(async () => {
    update(null);
    await storage.remove();
  }, [update]);

  useEffect(() => {
    configureAuth({ getToken: () => tokenRef.current, onUnauthorized: logout });
    storage
      .get()
      .then((saved) => {
        if (saved && !isExpired(saved)) update(saved);
        else if (saved) storage.remove();
      })
      .finally(() => setReady(true));
  }, [logout, update]);

  const login = useCallback(
    async (email, password) => {
      const { token: newToken } = await apiLogin(email, password);
      update(newToken);
      await storage.set(newToken);
    },
    [update]
  );

  const value = useMemo(
    () => ({ token, ready, isLogged: !!token && !isExpired(token), login, logout }),
    [token, ready, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
