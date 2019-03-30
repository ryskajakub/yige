// src/app-client.js
import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

window.onload = () => {
  ReactDOM.render(<AppRoutes/>, document.getElementById('main'));
};