import React, { useState, useEffect } from 'react';
import {
  LightningCharge,
  Droplet,
  PlusLg,
  Search,
  Funnel,
  XLg,
  CheckCircleFill,
  ExclamationTriangleFill,
  Tools,
  GeoAlt
} from 'react-bootstrap-icons';

export default function MedidoresPage({ medidores = [], areas = [], onAgregarMedidor }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Formulario para registro — ahora guardamos id_area en lugar de texto libre
  const [formData, setFormData] = useState({
    codigo: '',
    tipo_recurso: 'ENERGIA',
    id_area: '',              // ← cambio clave
    ultima_lectura: '',
    estado: 'ACTIVO'
  });

  // Cuando se abre el modal y aún no hay id_area, seleccionamos la primera área
  useEffect(() => {
    if (modalAbierto && !formData.id_area && areas.length > 0) {
      setFormData((prev) => ({ ...prev, id_area: areas[0].id_area }));
    }
  }, [modalAbierto, areas, formData.id_area]);

  // Filtros dinámicos
  const medidoresFiltrados = medidores.filter((m) => {
    const coincideBusqueda =
      m.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === 'TODOS' || m.tipo_recurso === filtroTipo;
    const coincideEstado = filtroEstado === 'TODOS' || m.estado === filtroEstado;

    return coincideBusqueda && coincideTipo && coincideEstado;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.id_area) {
      alert('Debes seleccionar un área. Si no hay áreas creadas, registra una primero.');
      return;
    }

    if (onAgregarMedidor) {
      onAgregarMedidor({
        ...formData,
        id_area: Number(formData.id_area),
        ultima_lectura: parseFloat(formData.ultima_lectura) || 0,
        unidad: formData.tipo_recurso === 'ENERGIA' ? 'kWh' : 'm³'
      });
    }

    setFormData({
      codigo: '',
      tipo_recurso: 'ENERGIA',
      id_area: areas[0]?.id_area || '',
      ultima_lectura: '',
      estado: 'ACTIVO'
    });
    setModalAbierto(false);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setFormData({
      codigo: '',
      tipo_recurso: 'ENERGIA',
      id_area: areas[0]?.id_area || '',
      ultima_lectura: '',
      estado: 'ACTIVO'
    });
  };

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
            <CheckCircleFill className="text-emerald-600" /> Activo
          </span>
        );
      case 'ALERTA':
        return (
          <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
            <ExclamationTriangleFill className="text-rose-600" /> Alerta
          </span>
        );
      case 'MANTENIMIENTO':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
            <Tools className="text-amber-600" /> Mantenimiento
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LightningCharge className="text-emerald-600" /> Inventario de Medidores
          </h2>
          <p className="text-sm text-slate-500">Gestión de dispositivos de telemetría y sensores instalados.</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow transition flex items-center gap-2 cursor-pointer"
        >
          <PlusLg /> Registrar Medidor
        </button>
      </div>

      {/* Controles de Búsqueda y Filtrado */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por código o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Funnel className="text-slate-400 text-sm shrink-0" />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 text-sm bg-white text-slate-700 outline-none w-full md:w-auto"
          >
            <option value="TODOS">Todos los Recursos</option>
            <option value="ENERGIA">Energía (kWh)</option>
            <option value="AGUA">Agua (m³)</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-slate-300 rounded-lg p-2 text-sm bg-white text-slate-700 outline-none w-full md:w-auto"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="ALERTA">En Alerta</option>
            <option value="MANTENIMIENTO">En Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Ubicación</th>
                <th className="px-6 py-3">Última Lectura</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medidoresFiltrados.length > 0 ? (
                medidoresFiltrados.map((m) => (
                  <tr key={m.id_medidor} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{m.codigo}</td>
                    <td className="px-6 py-4">
                      {m.tipo_recurso === 'ENERGIA' ? (
                        <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                          <LightningCharge /> Energía
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-cyan-600 font-semibold">
                          <Droplet /> Agua
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{m.ubicacion}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {m.ultima_lectura} <span className="text-xs font-normal text-slate-500">{m.unidad}</span>
                    </td>
                    <td className="px-6 py-4">{getBadgeEstado(m.estado)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No se encontraron medidores con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Nuevo Medidor */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <PlusLg className="text-emerald-400" /> Registrar Nuevo Medidor
              </h3>
              <button
                onClick={handleCerrarModal}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XLg />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Código del Dispositivo
                </label>
                <input
                  type="text"
                  name="codigo"
                  required
                  placeholder="Ej. MED-ENG-03"
                  value={formData.codigo}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Tipo Recurso
                  </label>
                  <select
                    name="tipo_recurso"
                    value={formData.tipo_recurso}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50"
                  >
                    <option value="ENERGIA">ENERGIA (kWh)</option>
                    <option value="AGUA">AGUA (m³)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Estado Inicial
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50"
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="ALERTA">ALERTA</option>
                    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                  </select>
                </div>
              </div>

              {/* ▼▼▼ CAMBIO: Ahora es un select con las áreas de la BD ▼▼▼ */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center gap-1">
                  <GeoAlt className="text-emerald-600" /> Ubicación / Área
                </label>
                {areas.length > 0 ? (
                  <select
                    name="id_area"
                    required
                    value={formData.id_area}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {areas.map((area) => (
                      <option key={area.id_area} value={area.id_area}>
                        {area.nombre}
                        {!area.activo && ' (inactiva)'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg">
                    No hay áreas registradas. Ve a la pestaña <strong>Áreas</strong> y crea al menos una antes de registrar medidores.
                  </div>
                )}
              </div>
              {/* ▲▲▲ FIN DEL CAMBIO ▲▲▲ */}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Lectura Inicial
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="ultima_lectura"
                  required
                  placeholder="0.0"
                  value={formData.ultima_lectura}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCerrarModal}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={areas.length === 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
                >
                  Guardar Medidor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}