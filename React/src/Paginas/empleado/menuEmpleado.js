import React from 'react';
import Perro1 from '../../assets/Imagenes/perro1.jpeg';
import Perro2 from '../../assets/Imagenes/perro2.jpeg';
import NavBar from '../../components/navBarEmpleado';
import Footer from '../../components/footer';

const menuEmpleado = () => {
  // Estilos en línea
  const styles = {
    // General Styling
    body: {
      fontFamily: 'sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f5f5f5',
    },
    hero: {
      position: 'relative',
      width: '100%',
      height: 'calc(80vh - 100px)', // Ajustar altura menos la altura del header
      overflow: 'hidden',
      marginTop: '0px', // Quitar margen superior
    },
    heroImage: {
      width: '100%',
      height: '100%',
      zIndex: 0, // Imagen detrás del texto y del dropdown
    },
    heroImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    heroText: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      background: 'rgba(0, 0, 0, 0.7)', // Fondo negro semi-transparente
      textAlign: 'center',
      fontSize: 'xx-large',
      fontFamily: 'cursive',
      zIndex: 1, // Texto por encima de la imagen
    },
    // Team Section Styling
    team: {
      backgroundColor: '#fff',
      padding: '2rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginTop: '20px', // Margen superior para separación del héroe
    },
    teamTitle: {
      textAlign: 'center',
    },
    teamMembers: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '2rem',
    },
    teamMember: {
      margin: '1rem',
      textAlign: 'center',
      width: '200px',
    },
    teamMemberImg: {
      width: '250px',
      height: '250px',
      borderRadius: '70%',
      marginLeft: '-25px',
    },
    addMember: {
      display: 'block',
      margin: '2rem auto',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    plusIcon: {
      marginRight: '10px',
    },
    // Footer Styling
    footer: {
      backgroundColor: '#333',
      color: '#fff',
      padding: '1rem',
      textAlign: 'center',
    },
    socialMedia: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'inline-block',
    },
    socialMediaItem: {
      display: 'inline-block',
      margin: '0 10px',
    },
    socialMediaLink: {
      color: '#fff',
    },
    // Estilos adicionales para el texto específico
    textBlack: {
      color: 'black',
    },
  };

  return (
    <div>
      <NavBar />
      <div style={styles.body}>
        <section className="hero" style={styles.hero}>
          <div style={styles.heroImage}>
            <img src={Perro1} alt="Perro1" style={styles.heroImageImg} />
            <div className="hero-text" style={styles.heroText}>
              <h1>Bienvenido Empleado</h1>
            </div>
          </div>
        </section>
        <section className="team" style={styles.team}>
          <h2 style={styles.teamTitle}>Mascotas Asignadas</h2>
          <div className="team-members" style={styles.teamMembers}>
            <div className="team-member" style={styles.teamMember}>
              <img src={Perro2} alt="Team Member Profile Pic" style={styles.teamMemberImg} />
              <h3 style={styles.textBlack}>Rocky</h3> {/* Aplica el color negro */}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default menuEmpleado;
