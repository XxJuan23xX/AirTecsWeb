import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FiMenu, FiX } from "react-icons/fi"; // Iconos para el menú
import logo from "../assets/navbar-logo.png";
import axios from "axios";

const Navbar = ({ scrollToSection, sobreNosotrosRef, faqRef }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAuthenticated = !!localStorage.getItem("token");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("menu-open", !menuOpen);
  };

  const toggleAvatarMenu = () => {
    setAvatarMenuOpen(!avatarMenuOpen);
  };

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get("https://airtecs-lgfl.onrender.com/autenticacionUsuario/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" onClick={() => navigate('/')} />
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>

        {/* ✅ "Sobre Nosotros" ahora es un Link con la misma clase */}
        <li>
          <Link
            to="/"
            className="navbar-item"
            onClick={(e) => {
              e.preventDefault();
              if (sobreNosotrosRef?.current) {
                scrollToSection(sobreNosotrosRef);
              } else {
                navigate("/");
                setTimeout(() => scrollToSection(sobreNosotrosRef), 300);
              }
            }}
          >
            Sobre Nosotros
          </Link>
        </li>

        {/* ✅ "Preguntas Frecuentes" también es un Link con la misma clase */}
        <li>
          <Link
            to="/"
            className="navbar-item"
            onClick={(e) => {
              e.preventDefault();
              if (faqRef?.current) {
                scrollToSection(faqRef);
              } else {
                navigate("/");
                setTimeout(() => scrollToSection(faqRef), 300);
              }
            }}
          >
            Preguntas Frecuentes
          </Link>
        </li>

        {isAuthenticated && (
          <>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/Estado-Servicio">Consultar Servicio</Link></li>
          </>
        )}
      </ul>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <>
            {user && (
              <div className="avatar-container" onClick={toggleAvatarMenu}>
                <img
                  src={user.avatar.startsWith("http") ? user.avatar : `https://airtecs-lgfl.onrender.com/${user.avatar}`}
                  alt="Avatar"
                  className="navbar-avatar"
                />
                {avatarMenuOpen && (
                  <div className="avatar-menu">
                    <button onClick={() => navigate('/perfil')}>Ver Perfil</button>
                  </div>
                )}
              </div>
            )}
            <button onClick={handleLogout} className="navbar-button logout">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-button">
            Iniciar Sesión
          </Link>
        )}
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>

      {/* Sidebar para móviles */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-sidebar" onClick={toggleMenu}>
          <FiX size={28} />
        </button>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
          <li><Link to="/servicios" onClick={toggleMenu}>Servicios</Link></li>

          <li>
            <button
              className="sidebar-link"
              onClick={(e) => {
                e.preventDefault();
                if (sobreNosotrosRef?.current) {
                  scrollToSection(sobreNosotrosRef);
                  toggleMenu();
                } else {
                  navigate("/");
                  setTimeout(() => {
                    scrollToSection(sobreNosotrosRef);
                    toggleMenu();
                  }, 300);
                }
              }}
            >
              Sobre Nosotros
            </button>
          </li>

          <li>
            <button
              className="sidebar-link"
              onClick={(e) => {
                e.preventDefault();
                if (faqRef?.current) {
                  scrollToSection(faqRef);
                  toggleMenu();
                } else {
                  navigate("/");
                  setTimeout(() => {
                    scrollToSection(faqRef);
                    toggleMenu();
                  }, 300);
                }
              }}
            >
              Preguntas Frecuentes
            </button>
          </li>

          {isAuthenticated && (
            <>
              <li><Link to="/enviar-solicitud" onClick={toggleMenu}>Enviar Solicitud</Link></li>
              <li><Link to="/consultar-servicio" onClick={toggleMenu}>Consultar Servicio</Link></li>
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

      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </nav>
  );
};

export default Navbar;
