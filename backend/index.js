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


// Nuevo endpoint para registrar mascotas
app.post('/api/mascotas', (req, res) => {
  const { nombre, raza, enfermedades, peso, edad, sexo, esterilizado, usuarioId } = req.body;

  console.log('Datos recibidos:', req.body);  // Verificar que los datos estén llegando correctamente

  // Verificar que todos los campos existan
  if (!nombre || !raza || !enfermedades || !peso || !edad || !sexo || !esterilizado || !usuarioId) {
    console.log('Campos faltantes:', req.body);
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const insertarMascotaQuery = `
    INSERT INTO mascotas (nombre, raza, enfermedades, peso, edad, sexo, esterilizado, id_UsuarioFK)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertarMascotaQuery, [nombre, raza, enfermedades, peso, edad, sexo, esterilizado, usuarioId], (err, result) => {
    if (err) {
      console.error('Error detallado en la inserción:', err);  // Imprimir detalles del error
      return res.status(500).json({ error: 'Error al registrar la mascota.' });
    }

    console.log('Mascota registrada exitosamente:', result);
    res.status(201).json({ message: 'Mascota registrada exitosamente', mascotaId: result.insertId });
  });
});


// Endpoint para obtener las mascotas de un usuario específico
app.get('/api/usuarios/:usuarioId/mascotas', (req, res) => {
  const usuarioId = req.params.usuarioId;
  console.log('ID de usuario recibido en backend:', usuarioId);

  const query = 'SELECT * FROM mascotas WHERE id_UsuarioFK = ?';

  db.query(query, [usuarioId], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return res.status(500).json({ error: 'Error al obtener las mascotas.' });
    }

    console.log('Resultados de la consulta:', results);

    if (results.length === 0) {
      console.log('No se encontraron mascotas para este usuario.');
      return res.status(404).json({ error: 'No se encontraron mascotas.' });
    }

    res.status(200).json(results);
  });
});

// Endpoint para obtener una mascota específica por su ID (más específico)
app.get('/api/mascotas/:mascotaId', (req, res) => {
  const mascotaId = req.params.mascotaId;  // ID de la mascota desde los parámetros de la URL
  console.log('ID de mascota recibido en backend:', mascotaId);

  const query = 'SELECT * FROM mascotas WHERE id_Mascota = ?';  // Filtramos por id_Mascota

  db.query(query, [mascotaId], (err, results) => {
    if (err) {
      console.error('Error al obtener la mascota:', err);
      return res.status(500).json({ error: 'Error al obtener la mascota.' });
    }

    if (results.length === 0) {
      console.log('No se encontró la mascota con este ID.');
      return res.status(404).json({ error: 'No se encontró la mascota.' });
    }

    console.log('Mascota encontrada:', results[0]);
    res.status(200).json(results[0]);
  });
});


// Endpoint para eliminar una mascota específica por su ID
app.delete('/api/mascotas/:id', (req, res) => {
  const mascotaId = req.params.id;
  console.log('ID de la mascota recibida para eliminar:', mascotaId);

  const query = 'DELETE FROM mascotas WHERE id_Mascota = ?';

  db.query(query, [mascotaId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la mascota:', err);
      return res.status(500).json({ error: 'Error al eliminar la mascota.' });
    }

    if (result.affectedRows === 0) {
      console.log('No se encontró la mascota para eliminar.');
      return res.status(404).json({ error: 'Mascota no encontrada.' });
    }

    console.log('Mascota eliminada exitosamente');
    res.status(200).json({ message: 'Mascota eliminada exitosamente' });
  });
});



// Ruta para registrar una nueva queja
app.post('/api/quejas', (req, res) => {
  const { contenido, usuarioId } = req.body;
  
  console.log('Datos recibidos para crear la queja:', req.body);

  // Verificamos que ambos campos existan
  if (!contenido || !usuarioId) {
    console.error('Contenido o usuarioId faltante');
    return res.status(400).json({ error: 'El contenido y el ID del usuario son obligatorios.' });
  }

  const query = `
    INSERT INTO quejas (contenido, id_UsuarioFK, fecha, hora)
    VALUES (?, ?, CURDATE(), CURTIME())`;

  db.query(query, [contenido, usuarioId], (err, result) => {
    if (err) {
      console.error('Error al registrar la queja en la base de datos:', err);
      return res.status(500).json({ error: 'Error al registrar la queja en la base de datos.' });
    }

    console.log('Queja registrada exitosamente con ID:', result.insertId);
    res.status(201).json({ message: 'Queja registrada exitosamente', quejaId: result.insertId });
  });
});




// Obtener todas las quejas de un usuario específico
app.get('/api/quejas/:usuarioId', (req, res) => {
  const usuarioId = req.params.usuarioId; // El ID del usuario obtenido desde la URL

  const query = `
    SELECT 
      quejas.id_Queja, 
      quejas.contenido, 
      quejas.fecha, 
      quejas.hora, 
      usuario.nombre, 
      usuario.correo, 
      usuario.celular 
    FROM 
      quejas 
    JOIN 
      usuario 
    ON 
      quejas.id_UsuarioFK = usuario.id_Usuario 
    WHERE 
      quejas.id_UsuarioFK = ?;
  `;

  db.query(query, [usuarioId], (err, results) => {
    if (err) {
      console.error('Error al obtener las quejas:', err);
      return res.status(500).json({ error: 'Error al obtener las quejas.' });
    }

    res.status(200).json(results); // Devolver los resultados en formato JSON
  });
});



// Ruta en el backend para actualizar una queja
app.put('/api/quejas/:id_Queja', (req, res) => {
  const quejaId = req.params.id_Queja;
  const { contenido } = req.body;

  const query = 'UPDATE quejas SET contenido = ? WHERE id_Queja = ?';

  db.query(query, [contenido, quejaId], (err, result) => {
      if (err) {
          console.error('Error al actualizar la queja:', err);
          return res.status(500).json({ error: 'Error al actualizar la queja' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Queja no encontrada' });
      }

      res.status(200).json({ message: 'Queja actualizada exitosamente' });
  });
});
