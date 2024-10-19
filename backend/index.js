const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos MySQL');

   // Verificación de conexión con una consulta simple
   db.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Error de conexión:', err.message);
    } else {
      console.log('Conexión a la base de datos exitosa');
    }
  });
});


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
  app.post('/api/users', (req, res) => {
    const { Nombre, Apellido, Correo, Celular, Direccion, TipoDocumento, NumeroDocumento, Contraseña, Rol } = req.body;
  
    if (!Nombre || !Apellido || !Correo || !Celular || !Direccion || !TipoDocumento || !NumeroDocumento || !Contraseña || !Rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
  
    const verificarUsuarioQuery = 'SELECT * FROM usuario WHERE correo = ?';
    db.query(verificarUsuarioQuery, [Correo], (err, results) => {
      if (err) {
        console.error('Error al verificar el usuario:', err.message); // Muestra el mensaje del error en la consola
        return res.status(500).json({ error: 'Error al verificar el usuario.' });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ error: 'Ya existe un usuario con este correo.' });
      }
  
      const crearUsuarioQuery = `
        INSERT INTO usuario (nombre, apellido, correo, direccion, tipo_Documento, numero_Documento, celular, contraseña, rol) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(crearUsuarioQuery, [Nombre, Apellido, Correo, Direccion, TipoDocumento, NumeroDocumento, Celular, Contraseña, Rol], (err, results) => {
        if (err) {
          console.error('Error al crear el usuario:', err.message);
          return res.status(500).json({ error: 'Error al crear el usuario.' });
        }
  
        res.status(201).json({ message: 'Usuario creado exitosamente.', id: results.insertId });
      });
    });
  });
  
  
  

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



app.post('/api/login', (req, res) => {
  const { correo, contraseña } = req.body;

  // Verifica que ambos campos están presentes
  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  // Consulta para buscar el usuario por correo
  const buscarUsuarioQuery = 'SELECT * FROM usuario WHERE correo = ?';
  db.query(buscarUsuarioQuery, [correo], (err, results) => {
    if (err) {
      console.error('Error al verificar el usuario:', err.message);
      return res.status(500).json({ error: 'Error al verificar el usuario.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const usuario = results[0];

    // Verificación de contraseña
    if (usuario.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    // Inicio de sesión exitoso - devolver también el nombre del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      usuarioId: usuario.id_Usuario,
      nombre: usuario.nombre,  // Incluir el nombre del usuario en la respuesta
      rol: usuario.rol
    });
  });
});





