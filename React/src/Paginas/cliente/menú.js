import React from 'react';
import './menu.css'; // Importa el CSS específico para el menú
import Perro1 from '../../assets/Imagenes/perro1.jpeg';
import NavBarCliente from '../../components/navBarCliente'; // Asegúrate de importar tu componente NavBarCliente
import Footer from '../../components/footer'; // Asegúrate de importar tu componente Footer
import Perro2 from '../../assets/Imagenes/perro2.jpeg';


const Menu = () => {
  return (
    <div>
      <NavBarCliente /> {/* Llama al componente NavBarCliente */}

      <main>
        <section className="hero">
          <div className="hero-image">
            <img src={Perro1} alt="Perro" />
            <div className="hero-text">
              <h1>Bienvenido Cliente</h1>
            </div>
          </div>
        </section>

        <section className="team">
          <h2>Mis Mascotas</h2>
          <div className="team-members">
            <div className="team-member">
              <img src={Perro2} alt="Team Member Profile Pic" />
              <h3>Rocky</h3>
            </div>
          </div>
        </section>
      </main>

      <Footer /> {/* Usa el componente Footer */}

      {/* Botón flotante de WhatsApp */}
      <a href="https://wa.me/1234567890" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default Menu;
