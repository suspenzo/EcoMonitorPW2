import React, { useState } from 'react';
import { 
  ExclamationTriangleFill, 
  Funnel, 
  CheckCircleFill, 
  ClockHistory, 
  Search,
  Check,
  Eye
} from 'react-bootstrap-icons';

export default function AlertasPage({ alertas = [], onCambiarEstado }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroSeveridad, setFiltroSeveridad] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Filtrado dinámico
  const alertasFiltradas = alertas.filter((a) => {
    const coincideBusqueda = 
      a.tipo_anomalia.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.codigo_medidor.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.detalle.toLowerCase().includes(busqueda.toLowerCase());

    const coincideSeveridad = filtroSeveridad === 'TODOS' || a.nivel === filtroSeveridad;
    const coincideEstado = filtroEstado === 'TODOS' || (a.estado || 'PENDIENTE') === filtroEstado;

    return coincideBusqueda && coincideSeveridad && coincideEstado;
  });

  const getBadgeSeveridad = (nivel) => {
    if (nivel === 'CRITICO') {
      return (
        <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
          <ExclamationTriangleFill className="text-rose-600" /> Crítico
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
        <ExclamationTriangleFill className="text-amber-600" /> Advertencia
      </span>
    );
  };

  const getBadgeEstado = (estado = 'PENDIENTE') => {
    switch (estado) {
      case 'RESUELTO':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
            <CheckCircleFill className="text-emerald-600" /> Resuelto
          </span>
        );
      case 'EN_REVISION':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
            <ClockHistory className="text-blue-600" /> En Revisión
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ExclamationTriangleFill className="text-amber-500" /> Centro de Gestión de Alertas y Anomalías
        </h2>
        <p className="text-sm text-slate-500">Supervisión y gestión de incidentes operativos detectados en la red.</p>
      </div>

      {/* Controles de Búsqueda y Filtrado */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por medidor o detalle..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Funnel className="text-slate-400 text-sm shrink-0" />
          <select
            value={filtroSeveridad}
            onChange={(e) => setFiltroSeveridad(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 text-sm bg-white text-slate-700 outline-none w-full md:w-auto"
          >
            <option value="TODOS">Todas las Severidades</option>
            <option value="CRITICO">Críticos</option>
            <option value="MEDIO">Medios</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 text-sm bg-white text-slate-700 outline-none w-full md:w-auto"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="RESUELTO">Resueltos</option>
          </select>
        </div>
      </div>

      {/* Listado de Alertas */}
      <div className="space-y-3">
        {alertasFiltradas.length > 0 ? (
          alertasFiltradas.map((alerta) => (
            <div 
              key={alerta.id_alerta} 
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getBadgeSeveridad(alerta.nivel)}
                  {getBadgeEstado(alerta.estado)}
                  <span className="text-xs text-slate-400 font-medium">{alerta.fecha}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-base">{alerta.tipo_anomalia}</h3>
                <p className="text-xs text-slate-600">
                  <span className="font-mono font-semibold text-slate-700">{alerta.codigo_medidor}</span> — {alerta.detalle}
                </p>
              </div>

              {/* Acciones de Cambio de Estado */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                {alerta.estado !== 'EN_REVISION' && alerta.estado !== 'RESUELTO' && (
                  <button
                    onClick={() => onCambiarEstado && onCambiarEstado(alerta.id_alerta, 'EN_REVISION')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye /> Revisar
                  </button>
                )}

                {alerta.estado !== 'RESUELTO' && (
                  <button
                    onClick={() => onCambiarEstado && onCambiarEstado(alerta.id_alerta, 'RESUELTO')}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Check /> Marcar Resuelto
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-400">
            No se encontraron alertas asociadas a los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}