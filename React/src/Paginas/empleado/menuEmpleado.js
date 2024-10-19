import React, { useState, useEffect } from 'react';
import styled from 'styled-components'; // Usa Axios para hacer la llamada a la API
import Perro1 from '../../assets/Imagenes/perro1.jpeg';
import Perro2 from '../../assets/Imagenes/perro2.jpeg';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  text-align: center;
  font-size: 3rem;
  font-family: Poppins-Light;
  font-weight: bold;
  z-index: 1;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  z-index: 2;
  background: transparent;
  margin-top: 26px;
  font-family: Poppins-ExtraLight;
  font-size: large;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  margin-right: 61px;
`;

const Dropdown = styled.div`
  position: relative;

  &:hover .dropdown-content {
    display: block;
  }
`;

const Link = styled.a`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const DropdownContentLink = styled.a`
  display: block;
  color: black;
  padding: 8px 10px;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const MenuEmpleado = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el nombre del usuario desde localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    console.log("Nombre de usuario desde localStorage:", nombreUsuario);

    if (nombreUsuario) {
      setNombre(nombreUsuario); // Asignar el nombre al estado si está presente
    } else {
      console.log('No se encontró el nombre del usuario en localStorage');
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sesión cerrada con éxito',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      localStorage.removeItem('userToken');
      navigate('/');
    });
  };

  return (
    <div>
      <HeroSection>
        <Navbar>
          {/* Enlaces con Dropdowns */}
          <NavLinks>
            <Dropdown>
              <Link href="/menuEmpleado">Inicio</Link>
            </Dropdown>
            <Dropdown>
              <Link href="#">Mascotas</Link>
              <DropdownContent className="dropdown-content">
                <DropdownContentLink href="/consultarMascotasE">Consultar</DropdownContentLink>
              </DropdownContent>
            </Dropdown>
            <Dropdown>
              <Link href="#">Reservas</Link>
              <DropdownContent className="dropdown-content">
                <DropdownContentLink href="/consultarReservasE">Consultar</DropdownContentLink>
              </DropdownContent>
            </Dropdown>
            <Dropdown>
              <Link href="#">Quejas</Link>
              <DropdownContent className="dropdown-content">
                <DropdownContentLink href="/consultarQuejaE">Consultar</DropdownContentLink>
              </DropdownContent>
            </Dropdown>
            <Dropdown>
              <Link href="#">Cuenta</Link>
              <DropdownContent className="dropdown-content">
                <DropdownContentLink href="/miPerfilE">Mi Perfil</DropdownContentLink>
                <DropdownContentLink href="#" onClick={handleLogout}>Cerrar sesión</DropdownContentLink>
              </DropdownContent>
            </Dropdown>
          </NavLinks>
        </Navbar>

        <HeroImage src={Perro1} alt="Perro1" />
        <HeroText>Bienvenido, {nombre}</HeroText>
      </HeroSection>

      {/* Sección de mascotas asignadas */}
      <section className="team" style={{ backgroundColor: '#fff', padding: '2rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Mascotas Asignadas</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
          <div style={{ margin: '1rem', textAlign: 'center', width: '200px' }}>
            <img src={Perro2} alt="Mascota Asignada" style={{ width: '250px', height: '250px', borderRadius: '70%', marginLeft: '-25px' }} />
            <h3>Mascota Asignada</h3>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuEmpleado;
