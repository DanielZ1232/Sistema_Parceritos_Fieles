import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

const CrearReserva = () => {
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFinal: '',
    idMascota: '',
    celular: '',
    correo: '',
    tipoServicio: '',
    estado: 'Por Confirmar',
  });

  const [mascotas, setMascotas] = useState([]);
  const userId = localStorage.getItem('usuarioId');  // ID del usuario
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/usuarios/${userId}/mascotas`);
        setMascotas(response.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener las mascotas. Inténtalo de nuevo más tarde.',
        });
      }
    };

    fetchMascotas();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ID del usuario no encontrado. Por favor, inicie sesión nuevamente.',
      });
      return;
    }

    const reserva = {
      fechaInicio: formData.fechaInicio,
      fechaFinal: formData.fechaFinal,
      idMascota: formData.idMascota,
      usuarioId: userId,  // El ID del usuario se obtiene del localStorage
      tipoServicio: formData.tipoServicio,
    };

    console.log('Datos enviados:', reserva);  // Verificar los datos enviados

    try {
      const response = await axios.post('http://localhost:5000/api/reservas', reserva, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Reserva creada exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });

        // **Enviar el correo de confirmación utilizando EmailJS**
        const templateParams = {
          to_name: 'Usuario',
          from_name: 'Parceritos Fieles',
          to_email: formData.correo,  // El correo del usuario que hizo la reserva
          fechaInicio: formData.fechaInicio,
          fechaFinal: formData.fechaFinal,
          tipoServicio: formData.tipoServicio,  // Tipo de servicio (hotel/estadia)
          mascota: formData.idMascota,
          celular: formData.celular,
          correo: formData.correo,
        };

        try {
          await emailjs.send(
            'service_91sjn3i',  // ID del servicio en EmailJS
            'template_tybdlva', // ID de la plantilla en EmailJS
            templateParams,
            'QyL_P2wB9V3Z0clnB'  // Tu User ID de EmailJS
          );

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Correo de confirmación enviado exitosamente',
            showConfirmButton: false,
            timer: 1500,
          });

        } catch (emailError) {
          console.error('Error al enviar el correo:', emailError);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar el correo de confirmación. Inténtalo de nuevo.',
          });
        }

        // Reiniciar el formulario después de crear la reserva
        setFormData({
          fechaInicio: '',
          fechaFinal: '',
          idMascota: '',
          celular: '',
          correo: '',
          tipoServicio: '',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear la reserva. Inténtalo de nuevo más tarde.',
        });
      }
    } catch (error) {
      console.error('Error en la creación de la reserva:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error de red. Inténtalo de nuevo más tarde.',
      });
    }
  };

  return (
    <div style={styles.pageContainer}>
      <NavBarCliente />
      <div style={styles.formWrapper}>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="fechaInicio">Fecha de inicio</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  min={today}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="fechaFinal">Fecha de final</label>
                <input
                  type="date"
                  id="fechaFinal"
                  name="fechaFinal"
                  value={formData.fechaFinal}
                  onChange={handleChange}
                  min={today}
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="idMascota">Seleccione mascota</label>
                <select
                  id="idMascota"
                  name="idMascota"
                  value={formData.idMascota}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {mascotas.map((mascota) => (
                    <option key={mascota.id_Mascota} value={mascota.id_Mascota}>
                      {mascota.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="tipoServicio">Seleccione servicio</label>
                <select
                  id="tipoServicio"
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="hotel">hotel</option>
                  <option value="estadia">estadia</option>
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="celular">Celular</label>
                <input
                  type="tel"
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  placeholder="Ingrese su número de celular"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Ingrese su correo electrónico"
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.buttonContainer}>
              <button type="submit" style={styles.submitButton}>Registrar</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
  },
  formWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    padding: '20px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    width: '100%',
    justifyItems: 'center',
  },
  formRow: {
    display: 'contents',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '280px',
    gap: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    gridColumn: 'span 2',
    display: 'flex',
    justifyContent: 'center',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default CrearReserva;
