import React, { useState } from 'react';
import {
  Building,
  PlusLg,
  Search,
  Funnel,
  XLg,
  CheckCircleFill,
  XCircleFill,
  PencilSquare,
  Trash,
  GeoAlt
} from 'react-bootstrap-icons';

export default function AreasPage({ areas = [], onAgregarArea, onActualizarArea, onEliminarArea }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [areaEdicion, setAreaEdicion] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true
  });

  // Filtros dinámicos
  const areasFiltradas = areas.filter((a) => {
    const coincideBusqueda =
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (a.descripcion || '').toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === 'TODOS' ||
      (filtroEstado === 'ACTIVAS' && a.activo) ||
      (filtroEstado === 'INACTIVAS' && !a.activo);

    return coincideBusqueda && coincideEstado;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const abrirModalCrear = () => {
    setAreaEdicion(null);
    setFormData({ nombre: '', descripcion: '', activo: true });
    setModalAbierto(true);
  };

  const abrirModalEditar = (area) => {
    setAreaEdicion(area);
    setFormData({
      nombre: area.nombre,
      descripcion: area.descripcion || '',
      activo: area.activo
    });
    setModalAbierto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) return;

    if (areaEdicion) {
      onActualizarArea && onActualizarArea(areaEdicion.id_area, formData);
    } else {
      onAgregarArea && onAgregarArea(formData);
    }

    setModalAbierto(false);
    setAreaEdicion(null);
  };

  const handleEliminar = (area) => {
    if (window.confirm(`¿Eliminar el área "${area.nombre}"? Esta acción no se puede deshacer.`)) {
      onEliminarArea && onEliminarArea(area.id_area);
    }
  };

  const getBadgeEstado = (activo) => {
    if (activo) {
      return (
        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
          <CheckCircleFill className="text-emerald-600" /> Activa
        </span>
      );
    }
    return (
      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
        <XCircleFill className="text-slate-500" /> Inactiva
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="text-emerald-600" /> Gestión de Áreas del Edificio
          </h2>
          <p className="text-sm text-slate-500">
            Registra y administra las áreas operativas (Producción, Administración, Diseño, etc.).
          </p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow transition flex items-center gap-2 cursor-pointer"
        >
          <PlusLg /> Registrar Área
        </button>
      </div>

      {/* Controles de Búsqueda y Filtrado */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Funnel className="text-slate-400 text-sm shrink-0" />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 text-sm bg-white text-slate-700 outline-none w-full md:w-auto"
          >
            <option value="TODOS">Todas</option>
            <option value="ACTIVAS">Solo Activas</option>
            <option value="INACTIVAS">Solo Inactivas</option>
          </select>
        </div>
      </div>

      {/* Tarjetas / Tabla */}
      {areasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areasFiltradas.map((area) => (
            <div
              key={area.id_area}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                    <GeoAlt className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{area.nombre}</h3>
                    <p className="text-xs text-slate-400 font-mono">ID #{area.id_area}</p>
                  </div>
                </div>
                {getBadgeEstado(area.activo)}
              </div>

              <p className="text-xs text-slate-600 min-h-[2.5rem]">
                {area.descripcion || <span className="italic text-slate-400">Sin descripción</span>}
              </p>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-medium">
                  Creada: {area.fecha_creacion ? new Date(area.fecha_creacion).toLocaleDateString() : '—'}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => abrirModalEditar(area)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="Editar"
                  >
                    <PencilSquare />
                  </button>
                  <button
                    onClick={() => handleEliminar(area)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 text-center rounded-xl border border-slate-200 text-slate-400">
          No se encontraron áreas con los filtros seleccionados.
        </div>
      )}

      {/* Modal Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                {areaEdicion ? (
                  <><PencilSquare className="text-emerald-400" /> Editar Área</>
                ) : (
                  <><PlusLg className="text-emerald-400" /> Registrar Nueva Área</>
                )}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XLg />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nombre del Área
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Ej. Producción, Administración, Diseño..."
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows="3"
                  placeholder="Describe brevemente el uso de esta área..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="activo"
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
                <label htmlFor="activo" className="text-sm text-slate-700 cursor-pointer">
                  Área activa
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
                >
                  {areaEdicion ? 'Guardar Cambios' : 'Registrar Área'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}