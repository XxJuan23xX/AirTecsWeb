import React from "react";
import { useNavigate } from "react-router-dom";
import "./Servicios.css"; 
import img1 from "../assets/img1.jpg"; 
import img2 from "../assets/img3.png"; 
import img3 from "../assets/img2.jpg"; 
import img4 from "../assets/img4.jpg"; 

const servicios = [
  {
    id: 1,
    titulo: "Mantenimiento de aires acondicionados",
    descripcion: "Servicio de mantenimiento general de aires acondicionados.",
    imagen: img1,
  },
  {
    id: 2,
    titulo: "Reparación de aires acondicionados",
    descripcion: "Reparación de fallas y problemas en aires acondicionados.",
    imagen: img2,
  },
  {
    id: 3,
    titulo: "Limpieza de refrigeradores",
    descripcion: "Limpieza profunda y mantenimiento de refrigeradores.",
    imagen: img3,
  },
  {
    id: 4,
    titulo: "Reparación de refrigeradores",
    descripcion: "Reparación de daños y fallas en refrigeradores.",
    imagen: img4,
  },
];

const Servicios = () => {
  const navigate = useNavigate();

  const handleSolicitarServicio = (id) => {
    navigate(`/enviar-solicitud/${id}`);
  };

  return (
    <div className="servicios-container">
      <h1 className="titulo">Nuestros Servicios</h1>
      <div className="servicios-grid">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="servicio-card">
            <img src={servicio.imagen} alt={servicio.titulo} className="servicio-imagen" />
            <div className="servicio-info">
              <h3>{servicio.titulo}</h3>
              <p>{servicio.descripcion}</p>
              <button onClick={() => handleSolicitarServicio(servicio.id)} className="btn-solicitar">
                Solicitar Servicio
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
