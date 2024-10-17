import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import styles from './CrearReserva.module.css';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

const CrearReserva = () => {
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFinal: '',
    mascota: '',
    celular: '',
    correo: '',
    estado: 'Por Confirmar'
  });

  const [mascotas, setMascotas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('usuarioId'));

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMascotas = async () => {
      if (!userId) return; // Asegurarse de que userId esté disponible
      try {
        const response = await axios.get('http://localhost:3002/Mascotas');
        const mascotasUsuario = response.data.filter(mascota => mascota.usuarioId === userId);
        setMascotas(mascotasUsuario);
      } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener las mascotas. Inténtalo de nuevo más tarde.',
        });
      }
    };

    fetchMascotas();
  }, [userId]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3002/Usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los usuarios. Inténtalo de nuevo más tarde.',
        });
      }
    };

    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error('ID del usuario no encontrado en localStorage');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ID del usuario no encontrado. Por favor, inicie sesión nuevamente.'
      });
      return;
    }

    const reserva = {
      ...formData,
      usuarioId: userId
    };

    try {
      const response = await axios.post('http://localhost:3002/Reservas', reserva, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Reserva creada exitosamente",
          showConfirmButton: false,
          timer: 1500
        });

        const usuario = usuarios.find(user => user.id === userId);

        if (!usuario) {
          console.error('Usuario no encontrado');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario no encontrado. Verifique su sesión.',
          });
          return;
        }

        const templateParams = {
          to_name: usuario.Nombre,
          from_name: 'Tu Aplicación',
          to_email: usuario.Correo,
          fechaInicio: formData.fechaInicio,
          fechaFinal: formData.fechaFinal,
          mascota: formData.mascota,
          celular: formData.celular,
          correo: formData.correo
        };

        try {
          await emailjs.send(
            'service_91sjn3i',
            'template_tybdlva',
            templateParams,
            'QyL_P2wB9V3Z0clnB'
          );
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Correo de confirmación enviado exitosamente",
            showConfirmButton: false,
            timer: 1500
          });
        } catch (emailError) {
          console.error('Error al enviar el correo:', emailError);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar el correo. Inténtalo de nuevo más tarde.',
          });
        }

        setFormData({
          fechaInicio: '',
          fechaFinal: '',
          mascota: '',
          celular: '',
          correo: ''
        });
      } else {
        console.error('Error al crear la reserva:', response.status);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear la reserva. Inténtalo de nuevo más tarde.',
        });
      }
    } catch (error) {
      console.error('Error de red:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error de red. Inténtalo de nuevo más tarde.',
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBarCliente />
      <div className={styles.container}>
        <h2>Crear Reserva</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fechaInicio">Fecha de inicio:</label>
              <input 
                type="date" 
                id="fechaInicio" 
                name="fechaInicio" 
                value={formData.fechaInicio}
                onChange={handleChange}
                min={today}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="fechaFinal">Fecha de final:</label>
              <input 
                type="date" 
                id="fechaFinal" 
                name="fechaFinal" 
                value={formData.fechaFinal}
                onChange={handleChange}
                min={today}
                required 
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="mascota">Seleccione mascota:</label>
              <select 
                id="mascota" 
                name="mascota" 
                value={formData.mascota}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                {mascotas.map(mascota => (
                  <option key={mascota.id} value={mascota.nombre}>
                    {mascota.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="celular">Celular:</label>
              <input 
                type="tel" 
                id="celular" 
                name="celular" 
                placeholder="Ingrese su número de celular" 
                value={formData.celular}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="correo">Correo:</label>
            <input 
              type="email" 
              id="correo" 
              name="correo" 
              placeholder="Ingrese su correo electrónico" 
              value={formData.correo}
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className={styles.button}>Registrar</button>
        </form>
      </div>
      <Footer className={styles.footer} />
      <a href="https://wa.me/1234567890" className={styles.whatsappButton} target="_blank" rel="noopener noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default CrearReserva;
