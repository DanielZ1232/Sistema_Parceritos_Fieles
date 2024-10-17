import React, { useState } from 'react';
import NavBarCliente from '../../components/navBarCliente'; // Asegúrate de que esta ruta es correcta
import Footer from '../../components/footer'; // Asegúrate de que esta ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './registrar_mascota.css'; // Asegúrate de que esta ruta es correcta
import Swal from 'sweetalert2';

const RegistroMascota = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    enfermedades: '',
    peso: '',
    edad: '',
    sexo: '',
    esterilizado: '', // Valor inicial como cadena vacía
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear el valor solo si el campo es 'nombre'
    let formattedValue = value;
    if (name === 'nombre') {
      formattedValue = value
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase()); // Capitaliza la primera letra
    } else if (name === 'edad') {
      // Validar que el valor de edad no sea negativo
      formattedValue = value;
      if (parseInt(value, 10) < 0) {
        formattedValue = '';
        Swal.fire({
          icon: 'warning',
          title: 'Edad Inválida',
          text: 'La edad no puede ser negativa.',
          confirmButtonText: 'Aceptar'
        });
      }
    }

    // Depuración
    console.log(`Campo: ${name}, Valor: ${formattedValue}`);

    // Actualizar el estado del formulario
    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtén el ID del usuario desde el localStorage
    const usuarioId = localStorage.getItem('usuarioId'); // Ajusta la clave si es diferente

    // Asegúrate de que el ID del usuario se agregue al formData
    const formDataConUsuario = { ...formData, usuarioId };

    try {
      const response = await fetch('http://localhost:3002/Mascotas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataConUsuario)
      });

      if (response.ok) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Mascota registrada exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
        setFormData({
          nombre: '',
          raza: '',
          enfermedades: '',
          peso: '',
          edad: '',
          sexo: '',
          esterilizado: '', // Restablece a cadena vacía
        });
      } else {
        console.error('Error al registrar la mascota:', response.status);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar la mascota',
          text: 'Por favor, intente nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error('Error de red:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo registrar la mascota. Inténtelo de nuevo más tarde.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className="page-container">
      <NavBarCliente />
      <div className="container-2">
        <h2>Registro de Mascotas</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                placeholder="Ingrese el nombre" 
                value={formData.nombre}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="raza">Raza:</label>
              <input 
                type="text" 
                id="raza" 
                name="raza" 
                placeholder="Ingrese la raza" 
                value={formData.raza}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="enfermedades">Enfermedades:</label>
              <input 
                type="text" 
                id="enfermedades" 
                name="enfermedades" 
                placeholder="Ingrese si tiene enfermedades" 
                value={formData.enfermedades}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="peso">Peso:</label>
              <input 
                type="text" 
                id="peso" 
                name="peso" 
                placeholder="Ingrese el peso" 
                value={formData.peso}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edad">Edad:</label>
              <input 
                type="number" 
                id="edad" 
                name="edad" 
                placeholder="Ingrese la edad" 
                value={formData.edad}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="sexo">Sexo:</label>
              <input 
                type="text" 
                id="sexo" 
                name="sexo" 
                placeholder="Ingrese el sexo" 
                value={formData.sexo}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="esterilizado">¿Está Esterilizado?</label>
              <select 
                id="esterilizado" 
                name="esterilizado" 
                value={formData.esterilizado}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <center>
            <button className="boton" type="submit">Guardar</button>
          </center>
        </form>
      </div>
      <Footer />
      <a 
        href="https://wa.me/3103409688" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
      </a>
    </div>
  );
};

export default RegistroMascota;
