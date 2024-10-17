import React, { useState, useEffect } from 'react';
import NavBarCliente from '../../components/navBarCliente'; // Asegúrate de que la ruta es correcta
import Footer from '../../components/footer'; // Asegúrate de que la ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Importa faUser desde 'free-solid-svg-icons'
import './consultarMascotas.css'; // Asegúrate de que esta ruta es correcta
import { Link } from 'react-router-dom';

const ConsultarMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const userId = localStorage.getItem('usuarioId'); // Obtén el ID del usuario desde el localStorage

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch('http://localhost:3002/Mascotas'); // URL del endpoint
        if (response.ok) {
          const data = await response.json();
          console.log('Datos obtenidos:', data);
          
          // Filtra las mascotas del usuario actual
          const filteredMascotas = data.filter(mascota => mascota.usuarioId === String(userId));
          console.log('Mascotas filtradas:', filteredMascotas);
          
          setMascotas(filteredMascotas);
        } else {
          console.error('Error al obtener las mascotas:', response.status);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchMascotas();
  }, [userId]);

  return (
    <div className="page-container">
      <NavBarCliente />
      <main>
        <section className="container">
          <div className="content">
            <h2>Consultar Mascotas</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Raza</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mascotas.length > 0 ? (
                    mascotas.map((mascota) => (
                      <tr key={mascota.id}>
                        <td>{mascota.nombre}</td>
                        <td>{mascota.raza}</td>
                        <td>{mascota.edad}</td>
                        <td>
                          <Link to={`/perfil-mascota/${mascota.id}`}>
                            <FontAwesomeIcon icon={faUser} size="lg" className="profile-icon"
                            style={{textDecoration: 'none',
                              color: 'black'
                            }} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No se encontraron mascotas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {/* Círculo flotante con WhatsApp */}
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

export default ConsultarMascotas;
