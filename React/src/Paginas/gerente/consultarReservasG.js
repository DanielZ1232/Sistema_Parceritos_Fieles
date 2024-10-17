import React, { useEffect, useState } from 'react';
import NavBarGerente from '../../components/navBarGerente';
import Footer from '../../components/footer';
import './consultarReservasG.css';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const ConsultarReservasG = () => {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3002/Reservas/');
        // Invertir el orden de los registros para que el último registro sea el primero
        const data = respuesta.data.reverse();
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };

    fetchReservas();
  }, []);

  const confirmarReserva = async (index) => {
    const reserva = reservas[index];
    
    // Mostrar confirmación antes de confirmar la reserva
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const nuevaReserva = { ...reserva, estado: 'Confirmada' };

        try {
          await axios.put(`http://localhost:3002/Reservas/${reserva.id}`, nuevaReserva);
          const nuevasReservas = reservas.map((reserva, i) =>
            i === index ? nuevaReserva : reserva
          );
          setReservas(nuevasReservas);

          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Confirmado!',
            text: 'La reserva ha sido confirmada.',
            icon: 'success'
          });
        } catch (error) {
          console.error('Error al confirmar la reserva:', error);
        }
      }
    });
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const reservasFiltradas = reservas.filter((reserva) =>
    filtro === 'todos' ? true : reserva.estado === filtro
  );

  return (
    <div>
      <NavBarGerente />
      <div className="consultarReservasG-container">
        <h2>Reservas</h2>
        <p>Estas son las últimas reservas que has hecho</p>
        <div className="consultarReservasG-filterContainer">
          <select
            className="consultarReservasG-filterSelect"
            value={filtro}
            onChange={handleFiltroChange}
          >
            <option value="todos">Todos</option>
            <option value="Por Confirmar">Por confirmar</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Asistida">Asistida</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <div className="consultarReservasG-tableContainer">
          <table className="consultarReservasG-table">
            <thead>
              <tr>
                <th className="consultarReservasG-th">Fecha de inicio</th>
                <th className="consultarReservasG-th">Fecha de final</th>
                <th className="consultarReservasG-th">Celular</th>
                <th className="consultarReservasG-th">Correo</th>
                <th className="consultarReservasG-th">Estado</th>
                <th className="consultarReservasG-th"></th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((reserva, index) => (
                <tr key={reserva.id}>
                  <td className="consultarReservasG-td">{reserva.fechaInicio}</td>
                  <td className="consultarReservasG-td">{reserva.fechaFinal}</td>
                  <td className="consultarReservasG-td">{reserva.celular}</td>
                  <td className="consultarReservasG-td">{reserva.correo}</td>
                  <td className="consultarReservasG-td">{reserva.estado}</td>
                  <td className="consultarReservasG-td">
                    {reserva.estado === 'Por Confirmar' && (
                      <i
                        className="fa-solid fa-check consultarReservasG-icon"
                        onClick={() => confirmarReserva(index)}
                      />
                    )}
                    {reserva.estado === 'Confirmada' && (
                      <i className="fa-solid fa-check consultarReservasG-icon" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultarReservasG;
