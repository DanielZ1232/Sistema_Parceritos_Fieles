import React, { useState } from 'react';
import NavBarCliente from '../../components/navBarCliente'; 
import Footer from '../../components/footer'; 
import './crearQuejaC.css';
import Logo from '../../assets/Imagenes/logo.png'; 
import Swal from 'sweetalert2';

const CrearQuejaC = () => {
    const maxLength = 250; // Número máximo de caracteres permitidos
    const [text, setText] = useState(''); // Estado para almacenar el texto del textarea
    const [isSaving, setIsSaving] = useState(false); // Estado para manejar el estado de guardado

    const userId = localStorage.getItem('usuarioId'); // Obtén el ID del usuario desde el localStorage

    // Manejador para actualizar el texto y el contador de caracteres
    const handleChange = (event) => {
        const inputText = event.target.value;
        // Convierte la primera letra en mayúscula y el resto permanece igual
        const formattedText = inputText.charAt(0).toUpperCase() + inputText.slice(1);
        setText(formattedText);
    };

      // Manejador para guardar la queja
      const handleSave = async () => {
        if (!text.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor, escriba su queja antes de guardar.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/quejas', { // Ajusta la URL según la configuración de tu API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contenido: text, // El contenido de la queja
                    usuarioId: userId, // Asegurándote de pasar el 'usuarioId' correctamente
                }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Queja guardada con éxito.',
                    timer: 1500,
                    showConfirmButton: false
                });
                setText(''); // Limpia el textarea
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar la queja.',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar la queja.',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="crear-queja-container">
            <NavBarCliente />
            <div className="form-wrapper">
                <div className="form-container">
                    <img id="logo" src={Logo} alt="Parceritos Fieles" />
                    <h1 className="form-title">Crear Queja</h1>
                    <div className="textarea-wrapper">
                        <textarea 
                            placeholder="Escriba su queja" 
                            maxLength={maxLength} 
                            value={text}
                            onChange={handleChange}
                        />
                        <div className="char-count">
                            {maxLength - text.length} caracteres restantes {/* Aquí se muestra la cuenta regresiva */}
                        </div>
                    </div>
                    <button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
            <Footer className="footer" />
            {/* Botón flotante de WhatsApp */}
            <a href="https://wa.me/1234567890" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
            </a>
        </div>
    );
};

export default CrearQuejaC;
