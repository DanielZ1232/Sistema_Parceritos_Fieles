import React, { useState, useEffect } from 'react';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import './consultarQuejasC.css';
import Swal from 'sweetalert2';

const ConsultarQuejasC = () => {
    const [quejas, setQuejas] = useState([]);
    const [usuarios, setUsuarios] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [quejaSeleccionada, setQuejaSeleccionada] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState(''); // Nuevo estado para el filtro de fecha
    const userId = localStorage.getItem('usuarioId');

    const fetchQuejas = async () => {
        try {
            const response = await fetch('http://localhost:3002/Quejas');
            let data = await response.json();

            // Filtrar las quejas por el usuario
            let filteredQuejas = data.filter(queja => queja.usuarioId === userId);

            // Ordenar las quejas de manera descendente por el orden de registro (la más reciente primero)
            filteredQuejas.reverse();

            // Filtrar por fecha si se selecciona en el filtro
            if (fechaFiltro) {
                filteredQuejas = filteredQuejas.filter(queja => new Date(queja.fecha) >= new Date(fechaFiltro));
            }

            setQuejas(filteredQuejas);

            const usuariosResponse = await fetch('http://localhost:3002/Usuarios');
            const usuariosData = await usuariosResponse.json();
            const usuariosMap = usuariosData.reduce((acc, usuario) => {
                acc[usuario.id] = usuario;
                return acc;
            }, {});
            setUsuarios(usuariosMap);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchQuejas();
    }, [fechaFiltro]);

    const toggleQueja = (event) => {
        const row = event.currentTarget.closest('tr').nextElementSibling;
        if (row.style.display === 'none') {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    };

    const showUpdateModal = (queja) => {
        setQuejaSeleccionada(queja);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setQuejaSeleccionada(null);
    };

    const actualizarQueja = async (event) => {
        event.preventDefault();

        try {
            await fetch(`http://localhost:3002/Quejas/${quejaSeleccionada.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...quejaSeleccionada,
                    texto: quejaSeleccionada.texto,
                }),
            });

            await Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'La queja ha sido actualizada con éxito',
                showConfirmButton: false,
                timer: 1500
            });

            fetchQuejas();
            closeModal();
        } catch (error) {
            console.error('Error al actualizar la queja:', error);
        }
    };

    return (
        <div className="page-wrapper">
            <NavBarCliente />
            <div className="container">
                <div className="content">
                    <h2>Quejas</h2>
                    <p>Estas son las quejas registradas por usted en el sistema</p>

                    {/* Filtro por fecha */}
                    <div className="filter-section">
                        <label htmlFor="fechaFiltro">Filtrar por fecha (desde): </label>
                        <input
                            type="date"
                            id="fechaFiltro"
                            value={fechaFiltro}
                            onChange={(e) => setFechaFiltro(e.target.value)}
                        />
                    </div>
                    <br></br>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Celular</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quejas.map((queja, index) => {
                                    const usuario = usuarios[queja.usuarioId] || {};
                                    return (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>{queja.fecha || 'Desconocida'}</td>
                                                <td>{queja.hora || 'Desconocida'}</td>
                                                <td>{usuario.Nombre || 'Desconocido'}</td>
                                                <td>{usuario.Correo || 'Desconocido'}</td>
                                                <td>{usuario.Celular || 'Desconocido'}</td>
                                                <td>
                                                    <i 
                                                        className="fas fa-eye" 
                                                        onClick={toggleQueja}
                                                        style={{ cursor: 'pointer' }}
                                                    ></i>
                                                </td>
                                            </tr>
                                            <tr className="queja-row" style={{ display: 'none' }}>
                                                <td colSpan="6">
                                                    <div className="queja-content">
                                                        <p>{queja.texto || 'No hay detalle de la queja.'}</p>
                                                        <button className="actualizar-btn" onClick={() => showUpdateModal(queja)}>Actualizar</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer className="footer-sticky" />
            <a href="https://wa.me/1234567890" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
            </a>

            {modalVisible && quejaSeleccionada && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <form className="actualizar-form" onSubmit={actualizarQueja}>
                            <h2>Actualizar Queja</h2>
                            <textarea 
                                id="queja" 
                                name="queja" 
                                rows="4" 
                                cols="50"
                                value={quejaSeleccionada.texto}
                                onChange={(e) => setQuejaSeleccionada({ ...quejaSeleccionada, texto: e.target.value })}
                            />
                            <br />
                            <button type="submit" className="guardar-btn">Guardar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultarQuejasC;
