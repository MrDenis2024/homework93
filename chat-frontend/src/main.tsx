import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer position="bottom-right" />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
