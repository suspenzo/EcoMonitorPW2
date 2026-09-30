const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');

const app = express();

// Permitir peticiones desde el frontend
app.use(cors({
    origin: 'http://localhost:5173', // puerto por defecto de Vite
    credentials: true
}));

// Importar modelos
require('./models');

// Importar rutas
const rolRoutes = require('./Routes/RolRoutes');
const usuarioRoutes = require('./Routes/UsuarioRoutes');
const alertaRoutes = require('./Routes/AlertaRoutes');
const areaRoutes = require('./Routes/AreaRoutes');
const incidenteRoutes = require('./Routes/IncidenteRoutes');
const lecturaRoutes = require('./Routes/LecturaRoutes');
const medidorRoutes = require('./Routes/MedidorRoutes');
const metaRoutes = require('./Routes/MetaRoutes');
const permisoRoutes = require('./Routes/PermisoRoutes');
const recursoRoutes = require ('./Routes/RecursoRoutes');
const rol_permisoRoutes = require ('./Routes/Rol_PermisoRoutes');
const tarifaRoutes = require ('./Routes/TarifaRoutes');


// Middleware para recibir JSON
app.use(express.json());

// RUTA PRINCIPAL

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API funcionando correctamente'
    });
});

// RUTAS

app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/incidentes', incidenteRoutes);
app.use('/api/lecturas', lecturaRoutes);
app.use('/api/medidores', medidorRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/rol_permisos', rol_permisoRoutes);
app.use('/api/tarifas', tarifaRoutes);

// INICIAR SERVIDOR

async function iniciarServidor() {

    try {

        // Probar conexión con MySQL
        await sequelize.authenticate();

        console.log('✅ Conexión con MySQL establecida correctamente');

        // Sincronizar modelos con la base de datos
        await sequelize.sync();

        console.log('✅ Modelos sincronizados correctamente');

        // Iniciar servidor
        app.listen(3000, () => {
            console.log('🚀 Servidor ejecutándose en http://localhost:3000');
        });

    } catch (error) {

        console.error('❌ Error al iniciar el servidor:');
        console.error(error);

    }

}

iniciarServidor();
