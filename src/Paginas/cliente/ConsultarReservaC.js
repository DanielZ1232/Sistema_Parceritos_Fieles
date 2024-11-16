// JSX en el archivo ConsultarReservaC.js o equivalente
import React, { useState, useEffect } from 'react';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import styles from './ConsultarReservaC.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const ConsultarReservaC = () => {
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterState, setFilterState] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [states, setStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTitle, setShowTitle] = useState(false);
  const itemsPerPage = 4;
  const userId = localStorage.getItem('usuarioId');

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clientes/${userId}/reservas`);
        if (response.ok) {
          const userReservas = await response.json();
          setReservas(userReservas);
          setFilteredReservas(userReservas);

          const dates = Array.from(new Set(userReservas.map(reserva => reserva.fecha_inicio)));
          setAvailableDates(dates);

          const estados = Array.from(new Set(userReservas.map(reserva => reserva.estado || 'Por Confirmar')));
          setStates(estados);

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
    setShowTitle(true); // Activa la animación del título
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
          setReservas(reservas.filter(reserva => reserva.id_Reserva !== id));
          setFilteredReservas(filteredReservas.filter(reserva => reserva.id_Reserva !== id));

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
      filtered = filtered.filter(reserva => reserva.fecha_inicio === date);
    }
    if (state) {
      filtered = filtered.filter(reserva => reserva.estado === state);
    }
    setFilteredReservas(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservas = filteredReservas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReservas.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBarCliente />
      <div className={styles.container}>
        <h2 className={`${styles.title} ${showTitle ? styles.fadeIn : ''}`}>Mis Reservas</h2>
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <label htmlFor="filterDate">Filtrar por fecha:</label>
            <input 
              type="date" 
              id="filterDate" 
              value={filterDate}
              onChange={handleDateChange}
              min={availableDates.length > 0 ? availableDates[0] : ''} 
            />
          </div>
          <div className={styles.filterGroup}>
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
        <div className={styles.gridContainer}>
          {currentReservas.length > 0 ? (
            currentReservas.map(reserva => (
              <div key={reserva.id_Reservas} className={styles.card}>
                <h3>{reserva.nombre_mascota}</h3>
                <p>Fecha Inicio: {new Date(reserva.fecha_Inicio).toLocaleDateString()}</p>
                <p>Fecha Final: {reserva.fecha_Fin ? new Date(reserva.fecha_Fin).toLocaleDateString() : '-'}</p>
                <p>Estado: {reserva.estado || 'Por Confirmar'}</p>
                <FontAwesomeIcon 
                  icon={faTimes} 
                  size="lg" 
                  className={styles.cancelIcon} 
                  onClick={() => handleCancel(reserva.id_Reserva)}
                />
              </div>
            ))
          ) : (
            <p>No hay reservas disponibles</p>
          )}
        </div>
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1} className={styles.paginationButton}>
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className={styles.paginationButton}>
            Siguiente
          </button>
        </div>
      </div>
      <Footer className={styles.footer} />
      <a href="https://wa.me/1234567890" className={styles.whatsappButton} target="_blank" rel="noopener noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default ConsultarReservaC;
