import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";
import loginImage from "../assets/login-image.webp";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("page-login");
    return () => document.body.classList.remove("page-login");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/autenticacionUsuario/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("🔹 Respuesta del backend:", data);

      if (response.ok) {
        setMessage("Inicio de sesión exitoso");

        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("✅ Token almacenado:", data.token);
          setTimeout(() => navigate("/"), 1000);
        } else {
          console.warn("⚠️ No se recibió un token válido.");
          setMessage("Error: No se recibió un token válido.");
        }
      } else {
        setMessage(data.error || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      setMessage("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Sección de imagen */}
        <div className="login-image-section">
          <img src={loginImage} alt="Técnico" className="login-image" />
        </div>

        {/* Sección del formulario */}
        <div className="login-form-section">
          <h2 className="login-title">Bienvenido de vuelta</h2>
          <p className="login-subtext">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="login-register-link">
              Regístrate aquí
            </a>
          </p>

          {message && <p className="login-message">{message}</p>}
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
