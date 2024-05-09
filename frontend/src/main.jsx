import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GlobalStoreContextProvider } from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <GlobalStoreContextProvider>
      <App />
    </GlobalStoreContextProvider>
  // </React.StrictMode>,
)
