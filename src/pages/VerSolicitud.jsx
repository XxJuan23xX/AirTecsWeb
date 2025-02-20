import React, { useState, useEffect } from "react";
import "./VerSolicitud.css";
import { FaCheckCircle, FaMapMarkerAlt, FaTools, FaTruck } from "react-icons/fa";
import loadingImage from "../assets/loading.png";

const VerSolicitud = () => {
  const [solicitud, setSolicitud] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitud = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("No estás autenticado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://backend-ronp.onrender.com/solicitudes/mi-solicitud", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.error || "Error al obtener la solicitud.");
          setLoading(false);
          return;
        }

        setTimeout(() => {
          setSolicitud(data);
          fetchHistorial(data._id);
          setLoading(false);
        }, 2000);
      } catch (error) {
        setErrorMessage("Error al conectar con el servidor.");
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, []);

  const fetchHistorial = async (solicitudId) => {
    try {
      const response = await fetch(`https://backend-ronp.onrender.com /progresoT/${solicitudId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al obtener el historial de progreso.");
      }

      setHistorial(data);
    } catch (error) {
      console.error("Error al obtener el historial de progreso:", error);
    }
  };

  useEffect(() => {
    if (solicitud && solicitud._id) {
      fetchHistorial(solicitud._id);
    }
  }, [solicitud]);

  if (loading) {
    return (
      <div className="loading-container">
        <img src={loadingImage} alt="Cargando..." className="loading-image" />
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <p className="loading-text">Cargando su solicitud...</p>
      </div>
    );
  }

  if (errorMessage) return <p className="error-message">{errorMessage}</p>;
  if (!solicitud) return <p className="loading-message">No tienes ninguna solicitud activa.</p>;

  // Estados en orden de progreso
  const estados = ["pendiente", "en camino", "en lugar", "en proceso", "finalizado"];

  // Obtener el último estado del historial si existe
  const ultimoEstado = historial.length > 0 ? historial[historial.length - 1].estado : solicitud.estado;
  
  // Determinar índice en la barra de progreso
  const estadoIndex = estados.indexOf(ultimoEstado);

  return (
    <div className="solicitud1-container">
      <h2 className="titulo">Estado del Servicio</h2>

      {/* 🔥 Barra de progreso mejorada */}
      <div className="progress-container">
        <div className="progress-line"></div>
        <div className="progress-steps">
          <div className={`progress-step ${estadoIndex >= 1 ? "active" : ""}`}>
            <FaTruck className="progress-icon" />
            <span>En camino</span>
          </div>
          <div className={`progress-step ${estadoIndex >= 2 ? "active" : ""}`}>
            <FaMapMarkerAlt className="progress-icon" />
            <span>En lugar</span>
          </div>
          <div className={`progress-step ${estadoIndex >= 3 ? "active" : ""}`}>
            <FaTools className="progress-icon" />
            <span>En proceso</span>
          </div>
          <div className={`progress-step ${estadoIndex >= 4 ? "active" : ""}`}>
            <FaCheckCircle className="progress-icon" />
            <span>Finalizado</span>
          </div>
        </div>
      </div>

      {/* 🔥 Detalles del servicio */}
      <div className="info-container">
        <div className="info-card">
          <h3>Detalles del Servicio</h3>
          <p><strong>Servicio:</strong> {solicitud.nombre_servicio || "No especificado"}</p>
          <p><strong>Dirección:</strong> {solicitud.direccion}</p>
          <p><strong>Fecha y Hora:</strong> {new Date(solicitud.fecha).toLocaleDateString()} {solicitud.hora}</p>
        </div>

        <div className="info-card">
          <h3>Especificaciones Técnicas</h3>
          <p><strong>Tipo de A/C:</strong> {solicitud.tipo_ac}</p>
          <p><strong>Marca:</strong> {solicitud.marca_ac}</p>
          <p><strong>Detalles:</strong> {solicitud.detalles}</p>
        </div>
      </div>

      {/* 🔥 Código de servicio */}
      <div className="solicitud-codigo">
        <p>📌 <strong>Tu código de servicio es:</strong> <span className="codigo">{solicitud.codigo || "Se asignará un código cuando se acepte el servicio."}</span></p>
      </div>

      {/* 🔥 Historial de progreso con mejor diseño */}
      {historial.length > 0 ? (
        <div className="historial-card">
          <h3>📜 Historial de Progreso</h3>
          {historial.map((item, index) => (
            <div key={index} className="historial-item">
              <p className="estado"><strong>{item.estado.replace("_", " ")}</strong></p>
              <p className="fecha">{new Date(item.timestamp).toLocaleString()}</p>
              <p className="detalles">{item.detalles}</p>
              <p className="tecnico"><strong>Técnico:</strong> {item.tecnico_email}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="historial-card">
          <h3>📜 Historial de Progreso</h3>
          <p>Aún no hay actualizaciones en el progreso del servicio.</p>
        </div>
      )}
    </div>
  );
};

export default VerSolicitud;
