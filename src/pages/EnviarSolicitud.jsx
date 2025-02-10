import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EnviarSolicitud.css";

const EnviarSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    direccion: "",
    marca_ac: "",
    tipo_ac: "",
    detalles: "",
  });

  const [step, setStep] = useState(1);
  const [orderInfo, setOrderInfo] = useState(null); // 🔥 Almacena el ID y el código de servicio
  const [errorMessage, setErrorMessage] = useState("");

  const progressPercentage = (step / 2) * 100;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 1 && (!formData.fecha || !formData.hora || !formData.direccion)) {
      setErrorMessage("Por favor, completa todos los campos antes de continuar.");
      return;
    }
    setErrorMessage("");
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    const requestData = {
      tipo_servicio_id: id.toString().padStart(24, "0"),
      ...formData,
    };

    try {
      const response = await fetch("https://backend-ronp.onrender.com/formulario/crear-solicitud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Error al enviar la solicitud.");
        return;
      }

      // ✅ Capturar el código de servicio correctamente
      setOrderInfo({
        id: data.solicitudId,
        codigo: data.codigo_inicial || "No disponible",
      });

    } catch (error) {
      setErrorMessage("Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="solicitud-container">
      <main className="solicitud-main">
        {!orderInfo ? (
          <div className="solicitud-card">
            <div className="solicitud-header">
              <h2>Solicitar Servicio</h2>
              <p>Complete el formulario para solicitar nuestro servicio</p>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="solicitud-form">
              {step === 1 && (
                <>
                  <label className="solicitud-label" htmlFor="fecha">
                    ¿Cuándo lo necesitas?
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      className="solicitud-input"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="solicitud-label" htmlFor="hora">
                    Selecciona un horario
                    <input
                      type="time"
                      id="hora"
                      name="hora"
                      className="solicitud-input"
                      value={formData.hora}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="solicitud-label" htmlFor="direccion">
                    ¿Dónde es el servicio?
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      className="solicitud-input"
                      placeholder="Escribe la dirección"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="solicitud-label" htmlFor="marca_ac">
                    ¿Cuál es la marca de aire acondicionado?
                    <select
                      id="marca_ac"
                      name="marca_ac"
                      className="solicitud-input"
                      value={formData.marca_ac}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Mirage">Mirage</option>
                      <option value="Mabe">Mabe</option>
                      <option value="Carrier">Carrier</option>
                      <option value="otra">Otra</option>
                    </select>
                  </label>

                  <label className="solicitud-label" htmlFor="tipo_ac">
                    ¿Selecciona el tipo de aire acondicionado?
                    <select
                      id="tipo_ac"
                      name="tipo_ac"
                      className="solicitud-input"
                      value={formData.tipo_ac}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Mini Split">Mini Split</option>
                      <option value="Ventana">Ventana</option>
                    </select>
                  </label>

                  <label className="solicitud-label" htmlFor="detalles">
                    ¿Necesitas agregar algún detalle?
                    <textarea
                      id="detalles"
                      name="detalles"
                      className="solicitud-input"
                      placeholder="Escribe más detalles..."
                      value={formData.detalles}
                      onChange={handleChange}
                    />
                  </label>
                </>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button type="button" onClick={handlePreviousStep} className="solicitud-btn secondary">
                    Anterior
                  </button>
                )}
                {step < 2 ? (
                  <button type="button" onClick={handleNextStep} className="solicitud-btn primary">
                    Siguiente
                  </button>
                ) : (
                  <button type="submit" className="solicitud-btn primary">
                    Enviar Solicitud
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          // 📌 Mostrar el código de servicio cuando se completa la solicitud
          <div className="confirmacion-pedido">
            <h2>¡Pedido Completado!</h2>
            <p>Tu número de orden es:</p>
            <h3 className="numero-orden">{orderInfo.id}</h3>
            <p>📌 <strong>Tu código de servicio es:</strong></p>
            <h3 className="codigo-servicio">{orderInfo.codigo}</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnviarSolicitud;
