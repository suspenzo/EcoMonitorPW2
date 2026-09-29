const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Permiso = require('./Permiso');
const Recurso = require('./Recurso');
const Tarifa = require('./Tarifa');
const Incidente = require('./Incidente');
const Medidor = require('./Medidor');
const Area = require('./Area');
const Meta = require('./Meta');
const Lectura = require('./Lectura');
const Alerta = require('./Alerta');
const Rol_Permiso = require('./Rol_Permiso');


// USUARIO - N:1  - ROL
// Un Rol tiene muchos Usuarios
Rol.hasMany(Usuario, {
    foreignKey: 'id_rol'
});

// Un Usuario pertenece a un Rol
Usuario.belongsTo(Rol, {
    foreignKey: 'id_rol'
});


// RECURSO - N:1  - TARIFA
Recurso.hasMany(Tarifa, {
    foreignKey: 'id_recurso'
});

Tarifa.belongsTo(Recurso, {
    foreignKey: 'id_recurso'
});

// INCIDENTES - N:1  - USUARIO
Usuario.hasMany(Incidente, {
    foreignKey: 'id_usuario'
});

Incidente.belongsTo(Usuario, {
    foreignKey: 'id_usuario'
});

// INCIDENTES - N:1  - AREA
Area.hasMany(Incidente, {
    foreignKey: 'id_area'
});

Incidente.belongsTo(Area, {
    foreignKey: 'id_area'
});

// MEDIDOR - N:1  - RECURSO
Recurso.hasMany(Medidor, {
    foreignKey: 'id_recurso'
});

Medidor.belongsTo(Recurso, {
    foreignKey: 'id_recurso'
});

// MEDIDOR - N:1  - AREA
Area.hasMany(Medidor, {
    foreignKey: 'id_area'
});

Medidor.belongsTo(Area, {
    foreignKey: 'id_area'
});

// META - N:1  - AREA
Area.hasMany(Meta, {
    foreignKey: 'id_area'
});

Meta.belongsTo(Area, {
    foreignKey: 'id_area'
});

// META - N:1  - RECURSO
Recurso.hasMany(Meta, {
    foreignKey: 'id_recurso'
});

Meta.belongsTo(Recurso, {
    foreignKey: 'id_recurso'
});


// LECTURA - N:1  - MEDIDOR
Medidor.hasMany(Lectura, {
    foreignKey: 'id_medidor'
});

Lectura.belongsTo(Medidor, {
    foreignKey: 'id_medidor'
});

// LECTURA - N:1  - USUARIO
Usuario.hasMany(Lectura, {
    foreignKey: 'id_usuario'
});

Lectura.belongsTo(Usuario, {
    foreignKey: 'id_usuario'
});

// ALERTA - N:1  - LECTURA
Lectura.hasMany(Alerta, {
    foreignKey: 'id_lectura'
});

Alerta.belongsTo(Lectura, {
    foreignKey: 'id_lectura'
});

// ALERTA - N:1  - USUARIO
Usuario.hasMany(Alerta, {
    foreignKey: 'id_usuario'
});

Alerta.belongsTo(Usuario, {
    foreignKey: 'id_usuario'
});

// ROL_PERMISO 

Rol_Permiso.belongsTo (Permiso, {
    foreignKey: 'id_permiso'
});

Rol_Permiso.belongsTo (Rol, {
    foreignKey: 'id_rol'
});

Permiso.hasMany(Rol_Permiso, {
    foreignKey: 'id_permiso'
});

Rol.hasMany(Rol_Permiso, {
    foreignKey: 'id_rol'
});



module.exports = {
    Rol,
    Usuario,
    Permiso,
    Recurso,
    Tarifa,
    Incidente,
    Medidor,
    Area,
    Meta,
    Lectura,
    Alerta,
    Rol_Permiso
};