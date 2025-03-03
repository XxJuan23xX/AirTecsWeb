import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Perfil.css";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

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
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUser();
  }, []);

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Subir la nueva foto de perfil
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Por favor, selecciona una imagen.");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://airtecs-lgfl.onrender.com/autenticacionUsuario/update-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Actualizar el avatar en el estado
      setUser((prevUser) => ({
        ...prevUser,
        avatar: response.data.avatarUrl,
      }));

      setUploadMessage("¡Avatar actualizado exitosamente!");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setUploadMessage("Error al actualizar el avatar.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  if (!user) {
    return <div className="perfil-loading">Cargando datos del usuario...</div>;
  }

  return (
    <div className="perfil-container">
      <h2 className="perfil-title">Perfil de Usuario</h2>
      <img
        src={user.avatar.startsWith("http") ? user.avatar : `https://airtecs-lgfl.onrender.com/${user.avatar}`}
        alt="Avatar"
        className="perfil-avatar"
      />
      <div className="perfil-info">
        <p><strong>Nombre de Usuario:</strong> {user.nombre_usuario}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Actualizar Avatar */}
      <div className="perfil-update-avatar">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Subiendo..." : "Actualizar Avatar"}
        </button>
        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </div>
    </div>
  );
};

export default Perfil;
