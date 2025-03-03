import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EnviarSolicitud from './pages/EnviarSolicitud';
import Servicios from "./pages/Servicios";
import EstadoSolicitud from './pages/VerSolicitud';
import ConektaPay from './pages/ConektaPay';
import Pago from './pages/pago';
import Perfil from './pages/Perfil';
import './App.css';

const App = () => {
  // ✅ Creamos las referencias para las secciones
  const sobreNosotrosRef = useRef(null);
  const faqRef = useRef(null);

  // ✅ Función para hacer scroll a una sección específica
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Router>
      {/* ✅ Pasamos las referencias y función al Navbar */}
      <Navbar 
        scrollToSection={scrollToSection} 
        sobreNosotrosRef={sobreNosotrosRef} 
        faqRef={faqRef} 
      />
      <Routes>
        {/* ✅ Pasamos las referencias y función al Home */}
        <Route 
          path="/" 
          element={<Home 
            scrollToSection={scrollToSection} 
            sobreNosotrosRef={sobreNosotrosRef} 
            faqRef={faqRef} 
          />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/Estado-Servicio" element={<EstadoSolicitud />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/enviar-solicitud/:id" element={<EnviarSolicitud />} />
        <Route path="/conekta-pay" element={<ConektaPay />} />
      </Routes>
    </Router>
  );
};

export default App;
