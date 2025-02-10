import React from "react";
import "./Home.css"; // Archivo de estilos
import tecnicoImage from "../assets/tecnico.png"; // Asegúrate de tener la imagen

const Home = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Servicios técnicos confiables y de calidad</h1>
        <p>
          Encuentra profesionales capacitados para reparar y mantener tus equipos de aire 
          acondicionado y refrigeración. ¡La mejor calidad y rapidez, a tu disposición!
        </p>
        <div className="buttons-container">
          <button className="primary-button">Comienza Ahora</button>
          <button className="secondary-button">Más Información</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={tecnicoImage} alt="Técnico profesional" />
      </div>
    </section>
  );
};

export default Home;
