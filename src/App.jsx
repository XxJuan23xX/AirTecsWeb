import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EnviarSolicitud from './pages/EnviarSolicitud';
import Servicios from "./pages/Servicios";
import EstadoSolicitud from './pages/VerSolicitud';
import ConektaPay from './pages/ConektaPay';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/Estado-Servicio" element={<EstadoSolicitud />} />
        {/* Ruta corregida: acepta un ID dinámico */}
        <Route path="/enviar-solicitud/:id" element={<EnviarSolicitud />} />
        <Route path="/conekta-pay" element={<ConektaPay />} />

      </Routes>
    </Router>
  );
};

export default App;
