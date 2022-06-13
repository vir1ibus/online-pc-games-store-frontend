import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './bootstrap/css/bootstrap.css';
import './css/style.css';
import {CookiesProvider} from "react-cookie";

const root = createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider>
        <App/>
    </CookiesProvider>
);

reportWebVitals();
