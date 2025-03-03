import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Función para validar la contraseña antes de enviarla
  const validatePassword = (password) => {
    const minLength = 6;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,])[A-Za-z\d.,]{6,}$/;

    if (!password) {
      return "La contraseña es requerida.";
    }
    if (password.length < minLength) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!regex.test(password)) {
      return "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo (.,)";
    }
    return null; // La contraseña es válida
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    // Validar la contraseña antes de enviarla
    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/autenticacionUsuario/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre_usuario: username,
            email,
            password,
            avatar: 'uploads/avatar-default.jpg' // 👉 Aquí enviamos el avatar por defecto
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('Registro exitoso');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setMessage(data.error || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className="auth-container">
      <h2>Crear Cuenta</h2>
      {message && <p className="auth-message">{message}</p>}
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
