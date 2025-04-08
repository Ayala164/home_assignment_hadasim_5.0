import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'; // ייבוא של ה-Provider
import { persistor, store } from './redux/store'; // וודא שאתה מייבא את ה-store שלך

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>  
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
);

// אם אתה רוצה למדוד ביצועים באפליקציה שלך, העבר פונקציה להדפיס תוצאות
// לדוגמה: reportWebVitals(console.log)
reportWebVitals();