import React from 'react';
import './actualizarQuejaC.css';

const ActualizarQuejaC = () => {
    const actualizarQueja = (event) => {
        event.preventDefault();
        alert("Queja actualizada con éxito!");
        // Aquí puedes agregar la lógica para guardar la queja actualizada en tu base de datos
    };

    return (
        <>
            <header>
                <div className="logo">
                    <a href="../Menus/Cliente.html">
                        <img src="../img/logo.png" alt="Logo Parceritos Fieles" />
                    </a>
                </div>
                <nav>
                    <div className="nav">
                        <div className="dropdown">
                            <a href="#">Mascotas</a>
                            <div className="dropdown-content">
                                <a href="../Gestion_Clientes/RegistroMascota.html">Registrar</a>
                                <a href="../Gestion_Mascotas/PerfilMascota.html">Consultar</a>
                            </div>
                        </div>
                        <div className="dropdown">
                            <a href="#">Reservas</a>
                            <div className="dropdown-content">
                                <a href="../Gestion_Reserva/crear.html">Registrar</a>
                                <a href="../Gestion_Reserva/consultar.html">Consultar</a>
                            </div>
                        </div>
                        <div className="dropdown">
                            <a href="#">Quejas</a>
                            <div className="dropdown-content">
                                <a href="../Gestion_Reserva/crear.html">Crear</a>
                                <a href="">Consultar</a>
                            </div>
                        </div>
                        <div className="nav-item">
                            <a href="../Gestion_Clientes/Perfil.html">Perfil</a>
                        </div>
                    </div>
                </nav>
            </header>
            <main>
                <div className="container">
                    <div className="content">
                        <div className="logo">
                            <a href="../Menus/Cliente.html">
                                <img src="../img/logo.png" alt="Logo Parceritos Fieles" />
                            </a>
                        </div>
                        <h2>Actualizar Queja</h2>
                        <p>Por favor, actualice la información de su queja</p>
                        <form className="actualizar-form" onSubmit={actualizarQueja}>
                            <textarea id="queja" name="queja" rows="4" cols="50">
                                El servicio no fue satisfactorio y hubo problemas con la atención al cliente.
                            </textarea>
                            <br />
                            <button type="submit" className="guardar-btn">Guardar</button>
                        </form>
                    </div>
                </div>
            </main>
            <footer>
                <p>&copy; 2024 Parceritos Fieles</p>
                <ul className="social-media">
                    <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fab fa-facebook"></i></a></li>
                </ul>
            </footer>
        </>
    );
};

export default ActualizarQuejaC;
