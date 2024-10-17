import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import NavBarCliente from '../../components/navBarCliente'; // Asegúrate de que la ruta es correcta
import Footer from '../../components/footer'; // Asegúrate de que la ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './PerfilMascota.css'; // Asegúrate de que esta ruta es correcta
import Swal from 'sweetalert2'; // Importa Swal

// Importa la imagen
import PerroImg from '../../assets/Imagenes/perro2.jpeg'; // Ajusta la ruta si es necesario

const PerfilMascota = () => {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const response = await fetch(`http://localhost:3002/Mascotas/${id}`); // URL del endpoint
        if (response.ok) {
          const data = await response.json();
          setMascota(data);
        } else {
          console.error('Error al obtener la mascota:', response.status);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchMascota();
  }, [id]);

  // Función para eliminar la mascota
  const handleEliminar = async () => {
    // Muestra el diálogo de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!",
      cancelButtonText: "Cancelar"
    });

    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3002/Mascotas/${id}`, {
          method: 'DELETE', // Método DELETE para eliminar el recurso
        });

        if (response.ok) {
          await Swal.fire({
            title: "Eliminado!",
            text: "Tu archivo ha sido eliminado.",
            icon: "success"
          });
          navigate('/consultar-mascota'); // Redirige a la página ConsultarMascotas después de eliminar
        } else {
          console.error('Error al eliminar la mascota:', response.status);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la mascota. Inténtelo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (error) {
        console.error('Error de red:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo eliminar la mascota. Inténtelo de nuevo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  return (
    <div className="page-container">
      <NavBarCliente />
      <div className="container-2">
        {mascota ? (
          <>
            <h1>Perfil de la Mascota</h1>
            <center>
              <div className="user-img">
                <img src={PerroImg} alt="Perfil de la mascota" /> {/* Usa la imagen importada */}
              </div>
            </center>
            <div className="info-section">
              <div className="info-ite">
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Nombre<br />{mascota.nombre}</span>
                </div>
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Edad<br />{mascota.edad} años</span>
                </div>
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Peso<br />{mascota.peso}</span>
                </div>
              </div>
              <div className="info-ite2">
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Raza<br />{mascota.raza}</span>
                </div>
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Enfermedades<br />{mascota.enfermedades}</span>
                </div>
                <div className="info-item-direc">
                  <i className="fa-solid fa-paw" />
                  <span>Esterilizado<br />{mascota.esterilizado === 'si' ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="boton">
              <center>
                <button onClick={handleEliminar} className="button">Eliminar</button>
              </center>
            </div>
          </>
        ) : (
          <p>Cargando perfil de la mascota...</p>
        )}
      </div>
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

export default PerfilMascota;
