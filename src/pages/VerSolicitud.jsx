import React, { useState, useEffect } from "react";
import "./VerSolicitud.css";
import { FaCheckCircle, FaMapMarkerAlt, FaTools, FaTruck } from "react-icons/fa";
import loadingImage from "../assets/loading.png";
import { useNavigate } from "react-router-dom";

const VerSolicitud = () => {
  const [solicitud, setSolicitud] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ultimoEstado, setUltimoEstado] = useState(""); // ✅ Nuevo estado para controlar la barra
  const navigate = useNavigate();

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

        console.log("📋 Estado recibido desde la API (solicitud):", data.estado);

        setSolicitud(data);
        fetchHistorial(data._id);  // ✅ Llamada para obtener el historial
        setLoading(false);

      } catch (error) {
        setErrorMessage("Error al conectar con el servidor.");
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, []);

  const fetchHistorial = async (solicitudId) => {
    try {
      const response = await fetch(`https://backend-ronp.onrender.com/progresoT/usuario/${solicitudId}`);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error al obtener el historial de progreso.");
      }
  
      console.log("📋 Historial recibido desde la API:", data);
  
      setHistorial(data);
  
      // ✅ Accede correctamente al estado_solicitud desde el objeto
      const ultimo = data.estado_solicitud?.toLowerCase().trim() || "pendiente";
  
      if (!ultimo || ultimo === "") {
        console.log("⚠️ Estado vacío o no válido, asignando 'pendiente'");
        setUltimoEstado("pendiente");
      } else {
        console.log("📋 Último estado extraído del historial (limpio):", ultimo);
        setUltimoEstado(ultimo);
      }
  
      // ✅ Mostrar el modal si el último estado es "finalizado"
      if (ultimo === "finalizado") {
        setShowPaymentModal(true);
      }
  
    } catch (error) {
      console.error("Error al obtener el historial de progreso:", error);
    }
  };
  
  
  

  const handleProceedToPayment = () => {
    setShowPaymentModal(false);
    navigate("/pago"); // Redirige a la página de pago
  };

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

  const estados = ["pendiente", "en camino", "en lugar", "en proceso", "finalizado", "pagado"];

  const estadoIndex = estados.indexOf(ultimoEstado);

  if (estadoIndex === -1) {
    console.warn("⚠️ Estado no encontrado en la lista de estados:", ultimoEstado);
  } else {
    console.log("📋 Índice del estado en la barra de progreso:", estadoIndex);
  }
  


  return (
    <div className="solicitud1-container">
      <h2 className="titulo">Estado del Servicio</h2>

      <div className="progress-container">
        <div className="progress-line"></div>
        <div className="progress-steps">
          {estados.slice(1, 5).map((estado, index) => (
            <div key={estado} className={`progress-step ${estadoIndex >= index + 1 ? "active" : ""}`}>
              {index === 0 && <FaTruck className="progress-icon" />}
              {index === 1 && <FaMapMarkerAlt className="progress-icon" />}
              {index === 2 && <FaTools className="progress-icon" />}
              {index === 3 && <FaCheckCircle className="progress-icon" />}
              <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

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

      <div className="solicitud-codigo">
        <p>📌 <strong>Tu código de servicio es:</strong> <span className="codigo">{solicitud.codigo || "Se asignará un código cuando se acepte el servicio."}</span></p>
      </div>

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

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠ Pago Pendiente</h3>
            <p>Tu servicio ha finalizado. Por favor, procede al pago para completar el proceso.</p>
            <button className="proceed-button" onClick={handleProceedToPayment}>Proceder al Pago</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerSolicitud;
