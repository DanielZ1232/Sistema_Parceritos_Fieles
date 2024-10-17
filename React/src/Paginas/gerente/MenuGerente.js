import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import NavBarGerente from "../../components/navBarGerente";
import Footer from '../../components/footer';
import fondoImagen from '../../assets/Imagenes/perro1.jpeg'; // Importa la imagen

const MenuGerente = () => {
    const [empleados, setEmpleados] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [showClienteSearch, setShowClienteSearch] = useState(false);
    const [documentoBusqueda, setDocumentoBusqueda] = useState('');
    const [clienteEncontrado, setClienteEncontrado] = useState(null);

    useEffect(() => {
        // Fetch empleados
        fetch('http://localhost:3002/Usuarios/')
            .then(response => response.json())
            .then(data => setEmpleados(data))
            .catch(error => console.error('Error fetching employees:', error));

        // Fetch clientes
        fetch('http://localhost:3002/Usuarios')
            .then(response => response.json())
            .then(data => setClientes(data))
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    const handleAgregarEmpleadoClick = () => {
        setShowClienteSearch(true);
    };

    const handleBuscarCliente = () => {
        const cliente = clientes.find(cliente => cliente.NumeroDocumento === documentoBusqueda);
        setClienteEncontrado(cliente);
    };

    const handleCambioRol = (clienteId) => {
        const cliente = clientes.find(c => c.id === clienteId);

        if (cliente) {
            fetch(`http://localhost:3002/Usuarios/${clienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...cliente,
                    Rol: 'Empleado' // Aquí cambiamos el rol a "Empleado"
                }),
            })
            .then(response => response.json())
            .then(updatedCliente => {
                setEmpleados([...empleados, updatedCliente]);
                setClientes(clientes.filter(c => c.id !== clienteId));
                setClienteEncontrado(null);
                setDocumentoBusqueda('');
                setShowClienteSearch(false);

                // Mostrar la notificación de éxito
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Empleado agregado exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error('Error changing role:', error);
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error al agregar empleado",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        } else {
            console.error('Cliente no encontrado');
        }
    };

    const handleCloseModal = () => {
        setShowClienteSearch(false);
        setClienteEncontrado(null);
        setDocumentoBusqueda('');
    };

    return (
        <div>
            <NavBarGerente />
            <div 
                className="menu-gerente-container"
                style={{
                    backgroundImage: `url(${fondoImagen})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 'calc(80vh - 115px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    textAlign: 'center',
                    color: 'white',
                    margin: 0,
                    padding: 0
                }}
            >
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 1
                    }}
                />
                <div style={{ 
                    position: 'relative', 
                    zIndex: 2, 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: '#ffffff' 
                }}>
                    Bienvenido Gerente
                </div>
            </div>

            <div 
                style={{
                    textAlign: 'center',
                    margin: '20px auto',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: '80%',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 2,
                    position: 'relative'
                }}
            >
                <h2>¡Tu Equipo!</h2>
                <p>Las personas que hacen que todo suceda</p>
                <div 
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '20px'
                    }}
                >
                    {empleados.filter(empleado => empleado.Rol === 'Empleado').map((empleado) => (
                        <div 
                            key={empleado.id} 
                            style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '10px',
                                padding: '15px',
                                width: '200px',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center'
                            }}
                        >
                            <h3 style={{ color: '#000000' }}>{empleado.Nombre}</h3>
                            <p>{empleado.Rol}</p>
                        </div>
                    ))}
                </div>
                <button 
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginTop: '10px'
                    }}
                    onClick={handleAgregarEmpleadoClick}
                >
                    + Agregar Empleado
                </button>

                {showClienteSearch && (
                    <div 
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#ffffff',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            zIndex: 3,
                            width: '300px',
                            maxWidth: '90%'
                        }}
                    >
                        <div 
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                background: '#ff0000',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '5px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                zIndex: 4
                            }}
                            onClick={handleCloseModal}
                        >
                            ×
                        </div>
                        <h3 style={{ color: 'black' }}>Buscar Cliente para Agregar</h3>
                        <input
                            type="text"
                            placeholder="Número de Documento"
                            value={documentoBusqueda}
                            onChange={(e) => setDocumentoBusqueda(e.target.value)}
                            style={{
                                padding: '10px',
                                marginBottom: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                width: 'calc(100% - 22px)',
                                display: 'block',
                                margin: '10px auto'
                            }}
                        />
                        <button 
                            style={{
                                backgroundColor: '#03ac4f',
                                color: 'white',
                                padding: '10px 15px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                display: 'block',
                                margin: '0 auto'
                            }}
                            onClick={handleBuscarCliente}
                        >
                            Buscar
                        </button>

                        {clienteEncontrado && (
                            <div 
                                style={{
                                    marginTop: '20px',
                                    backgroundColor: '#e9ecef',
                                    padding: '10px',
                                    borderRadius: '5px'
                                }}
                            >
                                <p>{clienteEncontrado.Nombre} {clienteEncontrado.Apellido}</p>
                                <button 
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        padding: '5px 10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleCambioRol(clienteEncontrado.id)}
                                >
                                    Cambiar a Empleado
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MenuGerente;
