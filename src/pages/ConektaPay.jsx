// src/pages/ConektaPay.jsx
import React, { useState, useEffect } from "react";

const ConektaPay = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar el script de Conekta y configurar la clave pública
  useEffect(() => {
    if (!window.Conekta) {
      const script = document.createElement("script");
      script.src = "https://cdn.conekta.io/js/latest/conekta.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Configura la clave pública desde tu entorno
        window.Conekta.setPublicKey(import.meta.env.VITE_CONEKTA_PUBLIC_KEY);
        console.log("Conekta cargado correctamente");
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setPaymentStatus("");
    setLoading(true);

    const cardData = {
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
        name: cardHolder,
      },
    };

    // Tokeniza la tarjeta
    window.Conekta.Token.create(cardData, tokenResponseHandler, errorHandler);
  };

  const tokenResponseHandler = async (response) => {
    // El token generado estará en response.token.id
    const token = response.token.id;
    console.log("Token generado:", token);

    try {
      // Envía el token y otros datos al backend para crear el cargo
      const res = await fetch("https://airtecs-lgfl.onrender.com/conekta/crear-pago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token, // Token generado por Conekta.js
          amount: 85000, // 850 se convierte a 85000 centavos
          descripcion: "Pago de mantenimiento",
          tecnico_id: "ID_DEL_TECNICO", // Puedes reemplazarlo según corresponda
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPaymentStatus("Pago realizado correctamente");
      } else {
        setErrorMessage(data.error || "Error al procesar el pago");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const errorHandler = (error) => {
    setErrorMessage(error.message_to_purchaser || "Error al tokenizar la tarjeta");
    setLoading(false);
  };

  return (
    <div className="conekta-pay-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Proceder al Pago</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número de Tarjeta:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Número de tarjeta"
            required
          />
        </div>
        <div className="form-group">
          <label>Mes de Expiración:</label>
          <input
            type="text"
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value)}
            placeholder="MM"
            required
          />
        </div>
        <div className="form-group">
          <label>Año de Expiración:</label>
          <input
            type="text"
            value={expYear}
            onChange={(e) => setExpYear(e.target.value)}
            placeholder="YYYY"
            required
          />
        </div>
        <div className="form-group">
          <label>CVC:</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="CVC"
            required
          />
        </div>
        <div className="form-group">
          <label>Nombre del Titular:</label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            placeholder="Nombre en la tarjeta"
            required
          />
        </div>
        <button type="submit" disabled={loading || !window.Conekta}>
          {loading ? "Procesando..." : "Pagar"}
        </button>
      </form>
      {paymentStatus && <p style={{ color: "green" }}>{paymentStatus}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default ConektaPay;
