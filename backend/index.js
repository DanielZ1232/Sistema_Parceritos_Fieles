const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

function handleDisconnect() {
// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(function (err) {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    setTimeout(handleDisconnect, 2000);  // Reintentar la conexión en 2 segundos
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

db.on('error', function (err) {
  console.error('Error de conexión a MySQL:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    handleDisconnect();  // Reconectar automáticamente si la conexión se pierde
  } else {
    throw err;
  }
});

return db;
}

const db = handleDisconnect();


// Ruta para obtener usuarios
// Obtener todos los usuarios
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM usuario';
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener los usuarios.' });
      }
      res.status(200).json(results);
    });
  });
  
  // Ruta para crear un usuario
  app.post('/api/register', (req, res) => {
    const { Nombre, Apellido, Correo, Celular, Direccion, TipoDocumento, NumeroDocumento, Contraseña } = req.body;
  
    if (!Nombre || !Apellido || !Correo || !Celular || !Direccion || !TipoDocumento || !NumeroDocumento || !Contraseña) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
  
    // Verificar si el usuario ya existe
    const verificarUsuarioQuery = 'SELECT * FROM usuario WHERE correo = ?';
    db.query(verificarUsuarioQuery, [Correo], (err, results) => {
      if (err) {
        console.error('Error al verificar el usuario:', err.message);
        return res.status(500).json({ error: 'Error al verificar el usuario.' });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ error: 'Ya existe un usuario con este correo.' });
      }
  
      // Crear el nuevo usuario en la tabla 'usuario'
      const crearUsuarioQuery = `
        INSERT INTO usuario (nombre, apellido, correo, direccion, tipo_Documento, numero_Documento, celular, contraseña, rol) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Cliente')
      `;
  
      db.query(crearUsuarioQuery, [Nombre, Apellido, Correo, Direccion, TipoDocumento, NumeroDocumento, Celular, Contraseña], (err, result) => {
        if (err) {
          console.error('Error al crear el usuario:', err.message);
          return res.status(500).json({ error: 'Error al crear el usuario.' });
        }
  
        console.log('Usuario creado exitosamente con ID:', result.insertId);
        res.status(201).json({ message: 'Usuario registrado exitosamente como Cliente.' });
      });
    });
  });
  
  
  
  
  
  
  

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



app.post('/api/login', (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  const buscarUsuarioQuery = 'SELECT * FROM usuario WHERE correo = ?';

  // Agregar logs para depurar
  console.log("Realizando consulta SQL para el correo:", correo);

  db.query(buscarUsuarioQuery, [correo], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err.message);  // Agregar el mensaje exacto del error
      return res.status(500).json({ error: 'Error al verificar el usuario.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const usuario = results[0];

    if (usuario.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      usuarioId: usuario.id_Usuario,
      nombre: usuario.nombre,
      rol: usuario.rol
    });
  });
});








