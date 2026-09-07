import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PaymentResult from './components/PaymentResult';
import './styles.css';
import './checkout.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PaymentResult />
    <App />
  </React.StrictMode>
);
