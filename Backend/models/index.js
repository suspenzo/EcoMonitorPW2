const Rol = require('./Rol');
const Usuario = require('./Usuario');
// const Producto = require('./Producto');
// Un Rol tiene muchos Usuarios

Rol.hasMany(Usuario, {
    foreignKey: 'id_rol'
});

// Un Usuario pertenece a un Rol
Usuario.belongsTo(Rol, {
    foreignKey: 'id_rol'
});

module.exports = {
    Rol,
    Usuario
  //  Producto
};