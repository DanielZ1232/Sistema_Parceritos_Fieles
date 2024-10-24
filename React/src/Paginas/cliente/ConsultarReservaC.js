import React, { useState, useEffect } from 'react';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import styles from './ConsultarReservaC.module.css'; // Importa los estilos como módulo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const ConsultarReservaC = () => {
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterState, setFilterState] = useState(''); // Estado para el filtro de estado
  const [availableDates, setAvailableDates] = useState([]); // Estado para fechas disponibles
  const [states, setStates] = useState([]); // Estado para estados únicos
  const userId = localStorage.getItem('usuarioId');
  console.log(userId);  // Asegúrate de que esto muestre el ID correcto

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reservas/${userId}`);
        if (response.ok) {
          const reservasData = await response.json();
          setReservas(reservasData);
          setFilteredReservas(reservasData);
    
          // Extraer fechas únicas para el filtro
          const dates = Array.from(new Set(reservasData.map(reserva => reserva.fecha_Inicio)));
          setAvailableDates(dates);
    
          // Extraer estados únicos
          const estados = Array.from(new Set(reservasData.map(reserva => reserva.estado || 'Por Confirmar')));
          setStates(estados);
        } else {
          console.error('Error al obtener las reservas:', response.status);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchReservas();
  }, [userId]);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/reservas/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setReservas(reservas.filter(reserva => reserva.id !== id));
          setFilteredReservas(filteredReservas.filter(reserva => reserva.id !== id));

          Swal.fire({
            title: '¡Cancelada!',
            text: 'La reserva ha sido cancelada.',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        } else {
          console.error('Error al cancelar la reserva:', response.status);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);
    filterReservations(selectedDate, filterState);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFilterState(selectedState);
    filterReservations(filterDate, selectedState);
  };

  const filterReservations = (date, state) => {
    let filtered = reservas;
    if (date) {
      filtered = filtered.filter(reserva => reserva.fecha_Inicio === date);
    }
    if (state) {
      filtered = filtered.filter(reserva => reserva.estado === state);
    }
    setFilteredReservas(filtered);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBarCliente />
      <div className={styles.container}>
        <h2>Mis Reservas</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="filterDate">Filtrar por fecha:</label>
            <input 
              type="date" 
              id="filterDate" 
              value={filterDate}
              onChange={handleDateChange}
              min={availableDates.length > 0 ? availableDates[0] : ''} 
            />
          </div>
          <div>
            <label htmlFor="filterState">Filtrar por estado:</label>
            <select 
              id="filterState"
              value={filterState}
              onChange={handleStateChange}
            >
              <option value="">Todos</option>
              {states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha Inicio</th>
              <th>Fecha Final</th>
              <th>Celular</th>
              <th>Correo</th>
              <th>Mascota</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservas.length > 0 ? (
              filteredReservas.map(reserva => (
                <tr key={reserva.id_Reservas}>
                  <td>{new Date(reserva.fecha_Inicio).toLocaleDateString()}</td>
                  <td>{new Date(reserva.fecha_Fin).toLocaleDateString()}</td>
                  <td>{reserva.celular}</td>
                  <td>{reserva.correo}</td>
                  <td>{reserva.nombreMascota}</td>
                  <td>{reserva.estado || 'Por Confirmar'}</td>
                  <td>
                    <FontAwesomeIcon 
                      icon={faTimes} 
                      size="lg" 
                      className={styles.cancelIcon} 
                      onClick={() => handleCancel(reserva.id_Reservas)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No hay reservas disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer className={styles.footer} />
      <a href="https://wa.me/1234567890" className={styles.whatsappButton} target="_blank" rel="noopener noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default ConsultarReservaC;
