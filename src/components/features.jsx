import React from "react";
import "./features.css";
import { FaEye, FaShieldAlt, FaClock } from "react-icons/fa"; // Importación de íconos

const Features = () => {
  return (
    <section className="features-section">
      <p className="section-subtitle">Por qué elegimos</p>
      <h2 className="section-title">Características de Nuestros Servicios</h2>
      <p className="section-description">
        La confianza y experiencia que necesitas para mantener tus equipos funcionando perfectamente
      </p>

      <div className="features-container">
        <div className="feature-card">
          <FaEye className="feature-icon" />
          <h3>Transparencia</h3>
          <p>Condiciones claras y justas en cada servicio.</p>
        </div>

        <div className="feature-card">
          <FaShieldAlt className="feature-icon" />
          <h3>Confiabilidad</h3>
          <p>Profesionales con experiencia comprobada.</p>
        </div>

        <div className="feature-card">
          <FaClock className="feature-icon" />
          <h3>Eficiencia</h3>
          <p>Servicios rápidos para tu comodidad.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
