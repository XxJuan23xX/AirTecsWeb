import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "./Modal"; // Importa el Modal personalizado
import "./pago.css";

const Pago = () => {
  const { id } = useParams();
  const [metodoPago, setMetodoPago] = useState("");
  const [formData, setFormData] = useState({
    nombreTitular: "",
    numeroTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
  });

  const [servicio, setServicio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [modalContent, setModalContent] = useState({ title: "", message: "" }); // Contenido del modal

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No se encontró el token de autenticación.");
        }

        const response = await fetch(`https://airtecs-lgfl.onrender.com/solicitudes/mi-solicitud`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al obtener el servicio.");
        }

        setServicio(data);
      } catch (error) {
        console.error("Error al obtener el servicio:", error);
        setErrorMessage(error.message || "Error al obtener los detalles del servicio.");
      }
    };

    fetchServicio();
  }, [id]);

  const handleMetodoPagoChange = (metodo) => {
    setMetodoPago(metodo);
    setPaymentSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const pagoData = {
        solicitud_id: servicio._id,
        monto: servicio.monto,
        metodo_pago: metodoPago,
      };

      if (metodoPago === "tarjeta") {
        pagoData.nombre_titular = formData.nombreTitular;
        pagoData.numero_tarjeta = formData.numeroTarjeta;
        pagoData.cvv = formData.cvv;
        pagoData.fecha_expiracion = formData.fechaExpiracion;
      }

      const response = await fetch("https://airtecs-lgfl.onrender.com/pagos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(pagoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pago.");
      }

      setIsProcessing(false);
      setPaymentSuccess(true);

      if (metodoPago === "oxxo") {
        setModalContent({
          title: "Referencia OXXO Generada",
          message: `Tu referencia OXXO es: ${data.pago.referencia_oxxo}`,
        });
      } else if (metodoPago === "tarjeta") {
        setModalContent({
          title: "Pago Exitoso",
          message: "Tu pago con tarjeta fue procesado correctamente.",
        });
      } else if (metodoPago === "efectivo") {
        setModalContent({
          title: "Pago en Efectivo",
          message: "El técnico confirmará el pago en efectivo.",
        });
      }

      setIsModalOpen(true); // Abre el modal

    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setErrorMessage(error.message || "Error al procesar el pago.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="pago-container">
      <h2 className="pago-titulo">💳 Selecciona tu Método de Pago</h2>

      {errorMessage && <p className="pago-error">{errorMessage}</p>}

      {!servicio ? (
        <p>Cargando detalles del servicio...</p>
      ) : (
        <>
          <div className="metodo-pago-opciones">
            <button
              className={`metodo-boton ${metodoPago === "oxxo" ? "activo" : ""}`}
              onClick={() => handleMetodoPagoChange("oxxo")}
            >
              🧾 OXXO Pay
            </button>

            <button
              className={`metodo-boton ${metodoPago === "tarjeta" ? "activo" : ""}`}
              onClick={() => handleMetodoPagoChange("tarjeta")}
            >
              💳 Tarjeta
            </button>

            <button
              className={`metodo-boton ${metodoPago === "efectivo" ? "activo" : ""}`}
              onClick={() => handleMetodoPagoChange("efectivo")}
            >
              💵 Efectivo
            </button>
          </div>

          <div className="pago-detalles">
            <h3>Detalles del Servicio</h3>
            <p><strong>Servicio:</strong> {servicio.nombre_servicio}</p>
            <p><strong>Precio:</strong> ${parseFloat(servicio.monto).toFixed(2)} MXN</p>
          </div>

          {metodoPago && !paymentSuccess && (
            <form className="pago-formulario" onSubmit={handleSubmit}>
              <h3>
                {metodoPago === "tarjeta" && "💳 Ingresa los datos de tu Tarjeta"}
                {metodoPago === "oxxo" && "🧾 Confirmar Pago vía OXXO Pay"}
                {metodoPago === "efectivo" && "💵 Confirmar Pago en Efectivo"}
              </h3>

              {metodoPago === "tarjeta" && (
                <>
                  <input
                    type="text"
                    name="nombreTitular"
                    placeholder="Nombre del Titular"
                    value={formData.nombreTitular}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="text"
                    name="numeroTarjeta"
                    placeholder="Número de Tarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleChange}
                    maxLength="16"
                    required
                  />

                  <div className="pago-form-row">
                    <input
                      type="text"
                      name="fechaExpiracion"
                      placeholder="MM/AA"
                      value={formData.fechaExpiracion}
                      onChange={handleChange}
                      maxLength="5"
                      required
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength="4"
                      required
                    />
                  </div>
                </>
              )}

              {metodoPago === "oxxo" && (
                <p className="pago-info">
                  Al confirmar, se generará una referencia para realizar tu pago en cualquier tienda OXXO.
                </p>
              )}

              {metodoPago === "efectivo" && (
                <p className="pago-info">
                  Has seleccionado pagar en efectivo. El técnico confirmará el pago al finalizar el servicio.
                </p>
              )}

              <button type="submit" className="pago-boton" disabled={isProcessing}>
                {isProcessing ? "Procesando..." : "Confirmar Pago"}
              </button>
            </form>
          )}
        </>
      )}

      {/* Modal para mostrar mensajes */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </div>
  );
};

export default Pago;
