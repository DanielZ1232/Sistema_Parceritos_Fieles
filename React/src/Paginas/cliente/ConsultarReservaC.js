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

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch('http://localhost:3002/Reservas');
        if (response.ok) {
          const reservasData = await response.json();
          const userReservas = reservasData.filter(reserva => reserva.usuarioId === userId);
          setReservas(userReservas);
          setFilteredReservas(userReservas);

          // Extrae las fechas únicas de las reservas para el filtro
          const dates = Array.from(new Set(userReservas.map(reserva => reserva.fechaInicio)));
          setAvailableDates(dates);

          // Extrae los estados únicos de las reservas para el filtro
          const estados = Array.from(new Set(userReservas.map(reserva => reserva.estado || 'Por Confirmar')));
          setStates(estados);

          // Añade los estados "Cancelada" y "Asistida" si no están ya en los estados disponibles
          const additionalStates = ['Cancelada', 'Asistida'];
          additionalStates.forEach(state => {
            if (!estados.includes(state)) {
              setStates(prevStates => [...prevStates, state]);
            }
          });
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
    // Mostrar confirmación antes de cancelar la reserva
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Color del botón de confirmar
      cancelButtonColor: '#d33', // Color del botón de cancelar
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3002/Reservas/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setReservas(reservas.filter(reserva => reserva.id !== id));
          setFilteredReservas(filteredReservas.filter(reserva => reserva.id !== id));

          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Cancelada!',
            text: 'La reserva ha sido cancelada.',
            icon: 'success',
            confirmButtonColor: '#3085d6' // Color del botón de confirmar
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
      filtered = filtered.filter(reserva => reserva.fechaInicio === date);
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
              min={availableDates.length > 0 ? availableDates[0] : ''} // Establece la fecha mínima disponible
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
            {filteredReservas.map(reserva => (
              <tr key={reserva.id}>
                <td>{reserva.fechaInicio}</td>
                <td>{reserva.fechaFinal}</td>
                <td>{reserva.celular}</td>
                <td>{reserva.correo}</td>
                <td>{reserva.mascota}</td>
                <td>{reserva.estado || 'Por Confirmar'}</td>
                <td>
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    size="lg" 
                    className={styles.cancelIcon} 
                    onClick={() => handleCancel(reserva.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer className={styles.footer} />
      {/* Botón flotante de WhatsApp */}
      <a href="https://wa.me/1234567890" className={styles.whatsappButton} target="_blank" rel="noopener noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default ConsultarReservaC;
