import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../components/navBarEmpleado';
import Footer from '../../components/footer';

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [tipoAsistencia, setTipoAsistencia] = useState('');

  // Obtener las mascotas según el tipo de asistencia
  useEffect(() => {
    if (tipoAsistencia) {
      const endpoint = tipoAsistencia === 'colegio' ? '/mascotas/colegio' : `/mascotas/reservas/${tipoAsistencia}`;
      axios.get(`http://localhost:5000${endpoint}`)
        .then(response => {
          setMascotas(response.data);
          setAsistencias(response.data.map(() => ({
            fecha: '',
            hora_llegada: '',
            hora_salida: '',
            asistio: false
          })));  // Inicializa el estado de asistencias
        })
        .catch(error => {
          console.error('Error al obtener mascotas:', error);
          setMascotas([]);  // Si hay un error o no hay mascotas, el array será vacío
        });
    }
  }, [tipoAsistencia]);

  // Manejar cambios en los inputs
  const handleInputChange = (e, index, field) => {
    const updatedAsistencias = [...asistencias];
    updatedAsistencias[index] = {
      ...updatedAsistencias[index],
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    };
    setAsistencias(updatedAsistencias);
  };

  // Registrar asistencias
  const handleSubmit = (e) => {
    e.preventDefault();
    asistencias.forEach(asistencia => {
      axios.post('http://localhost:5000/asistencias', asistencia)
        .then(() => {
          console.log('Asistencia registrada exitosamente');
        })
        .catch(error => {
          console.error('Error al registrar asistencia:', error);
        });
    });
    alert('Asistencias registradas exitosamente');
  };

  // Cambiar el tipo de asistencia y actualizar la lista de mascotas
  const handleTipoAsistenciaChange = (e) => {
    setTipoAsistencia(e.target.value);
  };

  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Registro de Asistencias</h2>
        <div style={styles.selectContainer}>
          <label style={styles.label}>Selecciona el tipo de asistencia:</label>
          <select style={styles.select} value={tipoAsistencia} onChange={handleTipoAsistenciaChange} required>
            <option value="">Selecciona una opción</option>
            <option value="colegio">Colegio</option>
            <option value="hotel">Hotel</option>
            <option value="pasadía">Pasadía</option>
          </select>
        </div>
        {tipoAsistencia && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <center>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>ID Mascota</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Celular</th>
                    <th>Fecha</th>
                    <th>Hora de Llegada</th>
                    <th>Hora de Salida</th>
                    <th>Asistió</th>
                  </tr>
                </thead>
                <tbody>
                  {mascotas.length > 0 ? (
                    mascotas.map((mascota, index) => (
                      <tr key={mascota.id_Mascota}>
                        <td>{mascota.id_Mascota}</td>
                        <td>{mascota.nombre}</td>
                        <td>{mascota.direccion_dueño}</td>
                        <td>{mascota.celular_dueño}</td>
                        <td>
                          <input
                            type="date"
                            style={styles.input}
                            value={asistencias[index]?.fecha || ''}
                            onChange={(e) => handleInputChange(e, index, 'fecha')}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            style={styles.input}
                            value={asistencias[index]?.hora_llegada || ''}
                            onChange={(e) => handleInputChange(e, index, 'hora_llegada')}
                            disabled={tipoAsistencia === 'colegio'}
                            required={tipoAsistencia !== 'colegio'}  // Hacer hora obligatoria para hotel y pasadía
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            style={styles.input}
                            value={asistencias[index]?.hora_salida || ''}
                            onChange={(e) => handleInputChange(e, index, 'hora_salida')}
                            disabled={tipoAsistencia === 'colegio'}
                            required={tipoAsistencia !== 'colegio'}  // Hacer hora obligatoria para hotel y pasadía
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={asistencias[index]?.asistio || false}
                            onChange={(e) => handleInputChange(e, index, 'asistio')}
                            disabled={tipoAsistencia !== 'colegio'}  // Checkbox solo para colegio
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={styles.noMascotas}>No se encuentran mascotas para este tipo de asistencia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </center>
            <div style={styles.buttonContainer}>
              <button type="submit" style={styles.button}>Registrar Asistencias</button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '65px auto', // Espacio adicional arriba y abajo del contenido
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
  },
  selectContainer: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  label: {
    marginRight: '10px',
    fontSize: '18px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '200px',
  },
  form: {
    marginTop: '20px',
  },
  tableContainer: {
    display: 'flex',
    justifyContent: 'center',  // Centrar la tabla horizontalmente
  },
  table: {
    width: '100%',
    maxWidth: '1000px', // Limitar el ancho máximo de la tabla
    borderCollapse: 'collapse',
    marginBottom: '30px',
    margin: '20px', // Esto asegurará que la tabla esté centrada
    marginLeft: '85%'
  },
  input: {
    padding: '5px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    textAlign: 'center',  // Centrar el botón
    marginBottom: '30px', // Añadir un espacio debajo del botón
    marginLeft: '133%'
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#218838',
  },
  noMascotas: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
};

export default Asistencias;
