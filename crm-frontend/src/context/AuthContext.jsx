import { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '../keycloak';
import { customerAPI } from '../services/api';

const AuthContext = createContext(null);

let initialized = false;

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized) return;
    initialized = true;

    keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then(async (auth) => {
        if (auth) {
          localStorage.setItem('kc_token', keycloak.token);
          setAuthenticated(true);
          const currentUser = {
            username: keycloak.tokenParsed?.preferred_username,
            email: keycloak.tokenParsed?.email,
            roles: keycloak.tokenParsed?.realm_access?.roles ?? [],
          };
          setUser(currentUser);

          // If user is a USER, fetch their customer account
          if (currentUser.roles.includes('USER')) {
            try {
              const { data } = await customerAPI.search(currentUser.email, { size: 1 });
              if (data?.content?.length > 0) {
                setCustomer(data.content[0]);
              }
            } catch (err) {
              console.error('Failed to fetch customer account:', err);
            }
          }

          keycloak.onTokenExpired = () => {
            keycloak.updateToken(60).then((refreshed) => {
              if (refreshed) {
                localStorage.setItem('kc_token', keycloak.token);
              }
            }).catch(() => {
              console.warn('Token refresh failed — logging out');
              keycloak.logout();
            });
          };
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Keycloak init failed:', err);
        setLoading(false);
      });
  }, []);

  const hasRole = (roles) => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role));
  };

  const logout = () => {
    localStorage.removeItem('kc_token');
    initialized = false;
    keycloak.logout({ redirectUri: window.location.origin });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280',
        fontFamily: 'sans-serif'
      }}>
        Connexion en cours...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authenticated, user, customer, logout, keycloak, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
