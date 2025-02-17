import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Mapa = ({ coordenadas, setCoordenadas, direccion, setDireccion }) => {
  const [position, setPosition] = useState(coordenadas);

  // Coordenadas para restringir a Mérida, Yucatán
  const bounds = {
    north: 21.1750, // Límite norte de Mérida
    south: 20.9000, // Límite sur de Mérida
    east: -89.5000, // Límite este de Mérida
    west: -89.8000, // Límite oeste de Mérida
  };

  // Cargar el script de Google Maps dinámicamente
  useEffect(() => {
    if (window.google) return; // Si Google Maps ya está cargado, no lo recargamos

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Después de cargar el script, inicializar Google Maps
      const map = new window.google.maps.Map(document.getElementById("google-map"), {
        center: coordenadas,
        zoom: 13,
        restriction: {
          latLngBounds: bounds,
          strictBounds: true,  // Esto asegura que el mapa no pueda salir de los límites
        },
      });

      // Agregar marcador inicial
      const marker = new window.google.maps.Marker({
        position: coordenadas,
        map,
        title: "Ubicación seleccionada",
      });

      // Configurar el autocompletado para la dirección
      const autocomplete = new window.google.maps.places.Autocomplete(document.getElementById("direccion"));
      autocomplete.setFields(["address_components", "geometry"]);

      // Restringir autocompletado a Mérida, Yucatán
      autocomplete.setBounds(bounds);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        // Establecer nuevas coordenadas en el formulario
        setCoordenadas({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });

        setDireccion(place.formatted_address);

        // Centrar el mapa en la nueva ubicación
        map.setCenter(place.geometry.location);
        marker.setPosition(place.geometry.location);
      });

      // Detectar clics en el mapa
      window.google.maps.event.addListener(map, "click", (event) => {
        const latLng = event.latLng;
        setPosition([latLng.lat(), latLng.lng()]);
        setCoordenadas({
          lat: latLng.lat(),
          lng: latLng.lng(),
        });

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              setDireccion(results[0].formatted_address);
            }
          }
        });
      });
    };
  }, [coordenadas, setCoordenadas, setDireccion]);

  return (
    <div id="google-map" style={{ height: "300px", width: "100%", borderRadius: "10px" }}></div>
  );
};

Mapa.propTypes = {
  coordenadas: PropTypes.object.isRequired,
  setCoordenadas: PropTypes.func.isRequired,
  direccion: PropTypes.string.isRequired,
  setDireccion: PropTypes.func.isRequired,
};

export default Mapa;
