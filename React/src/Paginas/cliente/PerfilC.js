import React, { useState, useEffect } from 'react';
import NavBarCliente from '../../components/navBarCliente'; // Ajusta la ruta según tu estructura de carpetas
import Footer from '../../components/footer'; // Ajusta la ruta según tu estructura de carpetas
import './perfilC.css'; // Asegúrate de que la ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesomeIcon
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Importa los íconos
import { Link } from 'react-router-dom'; // Importa Link


import Usuario from '../../assets/Imagenes/usuario.png'

const PerfilC = () => {
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
    const userId = '1724787393052'; // ID del cliente actualmente autenticado

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3002/Usuarios');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Verificar los datos obtenidos
                const clienteData = data.find(user => user.id === userId); // Asegúrate de usar .find en lugar de .Usuarios.find
                console.log('Cliente encontrado:', clienteData);
                if (clienteData) {
                    setCliente(clienteData);
                } else {
                    console.error('Cliente no encontrado');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!cliente) {
        return <div>No se encontraron datos del cliente.</div>;
    }

    return (
        <div className="perfil-page">
            <NavBarCliente />
            <div className="perfil-container">
                <center>
                    <div className="perfil-user-img">
                        <h1>Mi Perfil</h1>
                        <br />
                        <img src={Usuario} alt="Perfil del Usuario" />
                    </div>
                </center>
                <div className="perfil-info-section">
                    <div className="perfil-info-item-group">
                        <div className="perfil-info-item">
                            <i className="fa-regular fa-user"></i>
                            <span>Nombre<br />{cliente.Nombre}</span>
                        </div>
                        <div className="perfil-info-item">
                            <i className="fa-regular fa-envelope"></i>
                            <span>Correo<br />{cliente.Correo}</span>
                        </div>
                        <div className="perfil-info-item">
                            <i className="fa-solid fa-phone"></i>
                            <span>Celular<br />{cliente.Celular}</span>
                        </div>
                        <div className="perfil-info-item">
                            <i className="fa-solid fa-list"></i>
                            <span>Tipo documento<br />{cliente.TipoDocumento}</span>
                        </div>
                    </div>
                    <div className="perfil-info-item-group">
                        <div className="perfil-info-item">
                            <i className="fa-regular fa-user"></i>
                            <span>Apellido<br />{cliente.Apellido}</span>
                        </div>
                        <div className="perfil-info-item">
                            <i className="fa-solid fa-lock"></i>
                            <span>Contraseña<br />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={cliente.Contraseña}
                                    readOnly
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={togglePasswordVisibility}
                                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                                />
                            </span>
                        </div>
                        <div className="perfil-info-item-direc">
                            <i className="fa-solid fa-map-location-dot"></i>
                            <span>Dirección<br />{cliente.Direccion}</span>
                        </div>
                        <div className="perfil-info-item-doc">
                            <i className="fa-solid fa-hashtag"></i>
                            <span>Numero documento<br />{cliente.NumeroDocumento}</span>
                        </div>
                    </div>
                </div>
                <div className="perfil-boton">
                    <center>
                    <Link to="/actualizar-perfil" className="perfil-button">Actualizar Datos</Link>
                    </center>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PerfilC;
