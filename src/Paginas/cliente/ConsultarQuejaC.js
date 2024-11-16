import React, { useState, useEffect, useCallback } from 'react';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import Swal from 'sweetalert2';

const ConsultarQuejasC = () => {
    const [quejas, setQuejas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [expandedQuejaId, setExpandedQuejaId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [quejaSeleccionada, setQuejaSeleccionada] = useState(null);
    const userId = localStorage.getItem('usuarioId');

    const fetchQuejas = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/clientes/${userId}/quejas`);
            const data = await response.json();

            if (response.ok) {
                setQuejas(data.reverse());
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al obtener las quejas',
                    text: data.error || 'No se pudieron cargar las quejas.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al obtener las quejas',
                text: 'Ocurrió un problema al intentar cargar las quejas.',
            });
        }
    }, [userId]);

    useEffect(() => {
        fetchQuejas();
    }, [fetchQuejas]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuejas = quejas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(quejas.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const toggleExpand = (id) => {
        setExpandedQuejaId(expandedQuejaId === id ? null : id);
    };

    const showUpdateModal = (queja) => {
        if (!queja || !queja.id_Queja) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha seleccionado una queja válida para actualizar.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        setQuejaSeleccionada(queja);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setQuejaSeleccionada(null);
    };

    const actualizarQueja = async (event) => {
        event.preventDefault();

        if (!quejaSeleccionada || !quejaSeleccionada.id_Queja) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha seleccionado ninguna queja para actualizar.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/quejas/${quejaSeleccionada.id_Queja}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contenido: quejaSeleccionada.contenido,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'La queja ha sido actualizada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });

                fetchQuejas();
                closeModal();
            } else {
                const data = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar la queja',
                    text: data.error || 'Ocurrió un problema al intentar actualizar la queja.',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar la queja',
                text: 'Ocurrió un problema con la conexión al servidor.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBarCliente />
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">Mis Quejas</h2>
                <p className="text-gray-600 text-center mb-10">
                    Aquí puedes ver todas las quejas que has registrado en el sistema.
                </p>

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {currentQuejas.length > 0 ? (
                        currentQuejas.map((queja) => (
                            <div
                                key={queja.id_Queja}
                                className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${
                                    expandedQuejaId === queja.id_Queja ? 'max-h-full' : 'max-h-24'
                                }`}
                                onClick={() => toggleExpand(queja.id_Queja)}
                                style={{
                                    transition: 'max-height 0.3s ease',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    padding: '1rem', // Asegura márgenes internos iguales
                                }}
                            >
                                <p className="text-gray-500 text-sm">
                                    {queja.fecha ? new Date(queja.fecha).toLocaleDateString() : 'Fecha desconocida'}
                                </p>
                                <p className={`text-gray-800 mt-2 text-lg font-semibold ${expandedQuejaId !== queja.id_Queja ? 'truncate' : ''}`}>
                                    {queja.contenido || 'No hay contenido en la queja.'}
                                </p>
                                {expandedQuejaId === queja.id_Queja && (
                                    <button
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showUpdateModal(queja);
                                        }}
                                    >
                                        Editar Queja
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center col-span-4">
                            No tienes quejas registradas.
                        </p>
                    )}
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={prevPage}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-l hover:bg-gray-400 transition-colors duration-300"
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-gray-700 bg-white border-t border-b border-gray-300">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-r hover:bg-gray-400 transition-colors duration-300"
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
            <Footer />

            {modalVisible && quejaSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Editar Queja</h2>
                        <form onSubmit={actualizarQueja}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Fecha de la Queja
                                </label>
                                <input
                                    type="text"
                                    value={quejaSeleccionada.fecha ? new Date(quejaSeleccionada.fecha).toLocaleDateString() : 'Fecha desconocida'}
                                    disabled
                                    className="bg-gray-100 border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Contenido de la Queja
                                </label>
                                <textarea
                                    value={quejaSeleccionada.contenido}
                                    onChange={(e) =>
                                        setQuejaSeleccionada({ ...quejaSeleccionada, contenido: e.target.value })
                                    }
                                    rows="4"
                                    className="resize-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultarQuejasC;
