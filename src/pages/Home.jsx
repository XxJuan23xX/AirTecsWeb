import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import tecnicoImage from "../assets/tecnico.png";
import { 
  FaFan, 
  FaTools, 
  FaSnowflake, 
  FaThermometerHalf, 
  FaChevronUp, 
  FaChevronDown, 
  FaClipboardCheck, 
  FaMoneyBillWave, 
  FaShieldAlt 
} from "react-icons/fa";

const faqsData = [
  {
    question: "¿Cómo funciona el servicio?",
    answer: "Conectamos técnicos certificados con usuarios que requieren mantenimiento o reparación, asegurando calidad y rapidez."
  },
  {
    question: "¿Cuál es el costo del mantenimiento?",
    answer: "El precio fijo es de 850, del cual el 15% se retiene para la plataforma y el resto se transfiere al técnico."
  },
  {
    question: "¿Cómo se realiza el pago?",
    answer: "El usuario paga a través de métodos seguros integrados en la plataforma, como Conekta, una vez finalizado el servicio."
  },
  {
    question: "¿Qué garantía ofrecen?",
    answer: "Todos nuestros técnicos cuentan con certificaciones y ofrecemos garantía en cada servicio realizado."
  }
];

const Home = ({ scrollToSection, sobreNosotrosRef, faqRef }) => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Servicios técnicos confiables y de calidad</h1>
          <p>Encuentra profesionales capacitados para reparar y mantener tus equipos de aire acondicionado y refrigeración.</p>
          <div className="buttons-container">
            <button className="primary-button">Comienza Ahora</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={tecnicoImage} alt="Técnico profesional" />
        </div>
      </section>

      {/* 🔥 Beneficios Section (ahora representa "Sobre Nosotros") */}
      <section ref={sobreNosotrosRef} className="beneficios-section scroll-section">
        <div className="beneficios-container">
          <h2 className="beneficios-title">Beneficios de Contratar Nuestros Servicios</h2>
          <div className="beneficios-grid">
            <div className="beneficio-card">
              <div className="beneficio-icon">
                <FaClipboardCheck size={40} className="icon-blue" />
              </div>
              <h3 className="beneficio-title">Proceso Simplificado</h3>
              <p className="beneficio-desc">
                Contrata un servicio fácilmente a través de nuestro formulario en línea. Un técnico capacitado aceptará tu solicitud rápidamente.
              </p>
            </div>
            <div className="beneficio-card">
              <div className="beneficio-icon">
                <FaTools size={40} className="icon-blue" />
              </div>
              <h3 className="beneficio-title">Servicios Ofrecidos</h3>
              <p className="beneficio-desc">
                Ofrecemos mantenimiento y reparación de aires acondicionados y refrigeradores, con técnicos altamente capacitados.
              </p>
            </div>
            <div className="beneficio-card">
              <div className="beneficio-icon">
                <FaMoneyBillWave size={40} className="icon-blue" />
              </div>
              <h3 className="beneficio-title">Precios Transparentes</h3>
              <p className="beneficio-desc">
                Tarifa fija de $850, sin costos ocultos. Además, ofrecemos descuentos y promociones para clientes frecuentes.
              </p>
            </div>
            <div className="beneficio-card">
              <div className="beneficio-icon">
                <FaShieldAlt size={40} className="icon-blue" />
              </div>
              <h3 className="beneficio-title">Garantía y Seguridad</h3>
              <p className="beneficio-desc">
                Garantía de un mes en todos nuestros servicios, con seguimiento post-servicio y atención al cliente permanente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Preguntas Frecuentes Section */}
      <section ref={faqRef} id="faq" className="faq-section scroll-section">
        <div className="faq-container">
          <motion.div
            className="faq-header"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="faq-label">Dudas Comunes</span>
            <h2 className="faq-title">Preguntas Frecuentes</h2>
            <p className="faq-description">Encuentra respuestas a las preguntas más comunes sobre nuestros servicios.</p>
          </motion.div>
          <div className="faq-items">
            {faqsData.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button className="faq-button" onClick={() => toggleFAQ(index)}>
                  {faq.question}
                  {activeFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <AnimatePresence>
                  {activeFAQ === index && (
                    <motion.div
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
