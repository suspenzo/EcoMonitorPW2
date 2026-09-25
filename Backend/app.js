const express = require('express');
const sequelize = require('./config/database');

// Importar modelos
const Rol = require('./models/Rol');

// Importar rutas
const rolRoutes = require('./routes/rolRoutes');

const app = express();

// Middleware para recibir JSON
app.use(express.json());

// ========================================
// RUTA PRINCIPAL
// ========================================

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API funcionando correctamente'
    });
});

// ========================================
// RUTAS
// ========================================

app.use('/api/roles', rolRoutes);

// ========================================
// INICIAR SERVIDOR
// ========================================

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
