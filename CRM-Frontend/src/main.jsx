import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UserProvider } from '../src/Contexts/UserContext.jsx';
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <UserProvider>
  <Auth0Provider
    domain="dev-btad0jdv6jenv1st.us.auth0.com"
    clientId="XgU5lrQZVLmmNo4Hx04zhg6VLFlPJpFa"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
  </UserProvider>
  
  </StrictMode>

)
