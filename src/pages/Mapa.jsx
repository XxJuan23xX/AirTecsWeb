import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Mapa = ({ coordenadas, setCoordenadas, direccion = "", setDireccion }) => {
  useEffect(() => {
    if (window.google) {
      console.log("Google Maps ya está cargado.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Google Maps script cargado correctamente.");

      // Definir los límites de Mérida, Yucatán
      const bounds = {
        north: 21.1750,
        south: 20.9000,
        east: -89.5000,
        west: -89.8000,
      };

      // Función para verificar si las coordenadas están dentro de los límites
      const isWithinBounds = (coords) => {
        return (
          coords.lat >= bounds.south &&
          coords.lat <= bounds.north &&
          coords.lng >= bounds.west &&
          coords.lng <= bounds.east
        );
      };

      const map = new window.google.maps.Map(document.getElementById("google-map"), {
        center: coordenadas,
        zoom: 13,
        restriction: {
          latLngBounds: bounds,
          strictBounds: true,
        },
      });

      const marker = new window.google.maps.Marker({
        position: coordenadas,
        map,
        title: "Ubicación seleccionada",
      });

      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("direccion")
      );
      autocomplete.setFields(["address_components", "geometry", "formatted_address"]);
      autocomplete.setBounds(bounds);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.error("No se encontró la geometría del lugar.");
          return;
        }

        const newCoordenadas = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        console.log("Nuevas coordenadas desde autocomplete:", newCoordenadas);
        setCoordenadas(newCoordenadas);

        // Verificar si las coordenadas están dentro de los límites
        if (!isWithinBounds(newCoordenadas)) {
          setDireccion("Dirección no disponible");
        } else {
          setDireccion(place.formatted_address || "Dirección no disponible");
        }

        map.setCenter(newCoordenadas);
        marker.setPosition(newCoordenadas);
      });

      map.addListener("click", (event) => {
        console.log("Clic en el mapa detectado.");
        const latLng = event.latLng;
        const newCoordenadas = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        console.log("Nuevas coordenadas desde clic:", newCoordenadas);

        setCoordenadas(newCoordenadas);
        marker.setPosition(newCoordenadas);

        // Si el clic ocurre fuera de Mérida, forzamos la dirección a "Dirección no disponible"
        if (!isWithinBounds(newCoordenadas)) {
          setDireccion("Dirección no disponible");
          return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          console.log("Respuesta del geocodificador:", { results, status });
          if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
            const address =
              results[0].formatted_address ||
              results[0].address_components.map((comp) => comp.long_name).join(", ") ||
              "Dirección no disponible";
            console.log("Dirección obtenida:", address);
            setDireccion(address);
          } else {
            console.error("Error en la geocodificación:", status);
            setDireccion("Dirección no disponible");
          }
        });
      });
    };

    return () => {
      // Asegurarse de remover el script al desmontar el componente
      document.body.removeChild(script);
    };
  }, [coordenadas, setCoordenadas, setDireccion]);

  return (
    <div
      id="google-map"
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    ></div>
  );
};

Mapa.propTypes = {
  coordenadas: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  setCoordenadas: PropTypes.func.isRequired,
  direccion: PropTypes.string,
  setDireccion: PropTypes.func.isRequired,
};

export default Mapa;
