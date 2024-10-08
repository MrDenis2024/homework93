import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {Provider} from 'react-redux';
import {persistor, store} from './app/store';
import {PersistGate} from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
  <Provider store={store} >
    <PersistGate persistor={persistor}>
      <ToastContainer position="bottom-right" />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
