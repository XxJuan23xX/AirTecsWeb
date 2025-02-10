import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FiMenu, FiX } from "react-icons/fi"; // Iconos para el menú
import logo from "../assets/navbar-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Estado para el sidebar

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAuthenticated = !!localStorage.getItem("token");

  // Función para abrir/cerrar menú y evitar scroll en el fondo
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("menu-open", !menuOpen);
  };

  // Cierra el sidebar si la pantalla se agranda
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
        document.body.classList.remove("menu-open");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" onClick={() => navigate('/')} />
      </div>

      {/* Menú principal visible en pantallas grandes */}
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
        <li><Link to="/faq">Preguntas Frecuentes</Link></li>

        {isAuthenticated && (
          <>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/Estado-Servicio">Consultar Servicio</Link></li> {/* 🔥 Nueva opción */}
          </>
        )}
      </ul>

      {/* Botón de sesión en pantallas grandes */}
      <div className="navbar-auth">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="navbar-button logout">
            Cerrar Sesión
          </button>
        ) : (
          <Link to="/login" className="navbar-button">
            Iniciar Sesión
          </Link>
        )}
      </div>

      {/* Icono de menú para pantallas pequeñas */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>

      {/* Sidebar (Menú desplegable en pantallas pequeñas) */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-sidebar" onClick={toggleMenu}>
          <FiX size={28} />
        </button>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
          <li><Link to="/servicios" onClick={toggleMenu}>Servicios</Link></li>
          <li><Link to="/sobre-nosotros" onClick={toggleMenu}>Sobre Nosotros</Link></li>
          <li><Link to="/faq" onClick={toggleMenu}>Preguntas Frecuentes</Link></li>

          {isAuthenticated && (
            <>
              <li><Link to="/enviar-solicitud" onClick={toggleMenu}>Enviar Solicitud</Link></li>
              <li><Link to="/consultar-servicio" onClick={toggleMenu}>Consultar Servicio</Link></li> {/* 🔥 Nueva opción */}
            </>
          )}

          <li>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="navbar-logout">
                Cerrar Sesión
              </button>
            ) : (
              <Link to="/login" className="navbar-button">Iniciar Sesión</Link>
            )}
          </li>
        </ul>
      </div>

      {/* Cerrar sidebar si se hace clic fuera */}
      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </nav>
  );
};

export default Navbar;
