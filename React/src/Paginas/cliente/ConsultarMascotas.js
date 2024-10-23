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
  const userId = localStorage.getItem('usuarioId');
console.log('Usuario ID:', userId);  // Verifica que el usuarioId se obtiene correctamente


useEffect(() => {
  const fetchMascotas = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${userId}/mascotas`);
      if (response.ok) {
        const data = await response.json();
        console.log('Datos obtenidos desde el backend:', data);
        setMascotas(data);
      } else {
        console.error('Error al obtener las mascotas:', response.status);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  if (userId) {
    fetchMascotas();
  } else {
    console.log('Usuario ID no encontrado en localStorage');
  }
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
                      <tr key={mascota.id_Mascota}>
                        <td>{mascota.nombre}</td>
                        <td>{mascota.raza}</td>
                        <td>{mascota.edad}</td>
                        <td>
                        <Link to={`/perfil-mascota/${mascota.id_Mascota}`}>
                        <FontAwesomeIcon icon={faUser} size="lg" className="profile-icon"
                            style={{textDecoration: 'none', color: 'black'}} 
                           />
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
