import React, { useState, useEffect } from 'react';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import './consultarQuejasC.css';
import Swal from 'sweetalert2';

const ConsultarQuejasC = () => {
    const [quejas, setQuejas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [quejaSeleccionada, setQuejaSeleccionada] = useState(null);
    const userId = localStorage.getItem('usuarioId');

    // Función para obtener las quejas del backend
    const fetchQuejas = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/quejas/${userId}`);
            let data = await response.json();

            if (!Array.isArray(data)) {
                console.error('La respuesta no es un array', data);
                data = []; 
            }

            // Ordenar las quejas por fecha en orden descendente
            data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            setQuejas(data);
        } catch (error) {
            console.error('Error al obtener las quejas:', error);
        }
    };

    useEffect(() => {
        fetchQuejas();
    }, []);

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
            await fetch(`http://localhost:5000/api/quejas/${quejaSeleccionada.id_Queja}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...quejaSeleccionada,
                    contenido: quejaSeleccionada.contenido,
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
    
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th> {/* Columna para la fecha */}
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Celular</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quejas.map((queja, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            {/* Mostrar solo la parte de la fecha */}
                                            <td>{queja.fecha ? new Date(queja.fecha).toLocaleDateString() : 'Desconocida'}</td>
                                            <td>{queja.nombre || 'Desconocido'}</td>
                                            <td>{queja.correo || 'Desconocido'}</td>
                                            <td>{queja.celular || 'Desconocido'}</td>
                                            <td>
                                                <i 
                                                    className="fas fa-eye" 
                                                    onClick={toggleQueja}
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                            </td>
                                        </tr>
                                        <tr className="queja-row" style={{ display: 'none' }}>
                                            <td colSpan="5"> {/* Ajustar colspan a 5 */}
                                                <div className="queja-content">
                                                    <p>{queja.contenido || 'No hay detalle de la queja.'}</p>
                                                    <button className="actualizar-btn" onClick={() => showUpdateModal(queja)}>Actualizar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer className="footer-sticky" />

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
                                value={quejaSeleccionada.contenido}
                                onChange={(e) => setQuejaSeleccionada({ ...quejaSeleccionada, contenido: e.target.value })}
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
