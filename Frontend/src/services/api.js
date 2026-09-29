import api from '../api/axios';

// Helper para no repetir código
const crud = (recurso) => ({
    getAll: () => api.get(`/${recurso}`).then(r => r.data),
    getById: (id) => api.get(`/${recurso}/${id}`).then(r => r.data),
    create: (data) => api.post(`/${recurso}`, data).then(r => r.data),
    update: (id, data) => api.put(`/${recurso}/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/${recurso}/${id}`).then(r => r.data)
});

export const alertasAPI = crud('alertas');
export const areasAPI = crud('areas');
export const incidentesAPI = crud('incidentes');
export const lecturasAPI = crud('lecturas');
export const medidoresAPI = crud('medidores');
export const metasAPI = crud('metas');
export const permisosAPI = crud('permisos');
export const recursosAPI = crud('recursos');
export const rolesAPI = crud('roles');
export const tarifasAPI = crud('tarifas');
export const usuariosAPI = crud('usuarios');

// Endpoint especial para rol_permiso
export const rolPermisosAPI = {
    getAll: () => api.get('/rol-permisos').then(r => r.data),
    create: (data) => api.post('/rol-permisos', data).then(r => r.data),
    delete: (id_rol, id_permiso) => api.delete(`/rol-permisos/${id_rol}/${id_permiso}`).then(r => r.data)
};