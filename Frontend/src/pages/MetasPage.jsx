import React, { useState } from 'react';
import { 
  Bullseye, 
  PlusLg, 
  XLg, 
  LightningChargeFill, 
  DropletFill 
} from 'react-bootstrap-icons';

export default function MetasPage({ metas = [], onAgregarMeta }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    nombre_meta: '',
    tipo_recurso: 'ENERGIA',
    limite_mensual: '',
    consumo_actual: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAgregarMeta) {
      onAgregarMeta({
        ...formData,
        limite_mensual: parseFloat(formData.limite_mensual) || 0,
        consumo_actual: parseFloat(formData.consumo_actual) || 0,
        unidad: formData.tipo_recurso === 'ENERGIA' ? 'kWh' : 'm³'
      });
    }
    setFormData({
      nombre_meta: '',
      tipo_recurso: 'ENERGIA',
      limite_mensual: '',
      consumo_actual: 0
    });
    setModalAbierto(false);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Botón Nueva Meta */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bullseye className="text-emerald-600" /> Metas de Ahorro y Sostenibilidad
          </h2>
          <p className="text-sm text-slate-500">Establece límites mensuales de consumo para controlar la eficiencia operativa.</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow transition flex items-center gap-2 cursor-pointer"
        >
          <PlusLg /> Establecer Nueva Meta
        </button>
      </div>

      {/* Grid de Tarjetas de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metas.map((meta) => {
          const porcentaje = Math.min(
            Math.round((meta.consumo_actual / meta.limite_mensual) * 100),
            100
          );
          const esSobrepasado = meta.consumo_actual > meta.limite_mensual;

          return (
            <div key={meta.id_meta} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {meta.tipo_recurso}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg">{meta.nombre_meta}</h3>
                </div>
                {meta.tipo_recurso === 'ENERGIA' ? (
                  <LightningChargeFill className="text-blue-500 text-2xl" />
                ) : (
                  <DropletFill className="text-cyan-500 text-2xl" />
                )}
              </div>

              {/* Barra de Progreso */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">
                    {meta.consumo_actual} / {meta.limite_mensual} {meta.unidad}
                  </span>
                  <span className={esSobrepasado ? 'text-rose-600' : 'text-emerald-600'}>
                    {porcentaje}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      esSobrepasado ? 'bg-rose-500' : porcentaje > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Estado: <strong className={esSobrepasado ? 'text-rose-600' : 'text-emerald-600'}>
                  {esSobrepasado ? 'Límite Excedido' : 'Bajo Control'}
                </strong></span>
                <span>Mes Actual</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Registrar Nueva Meta */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <PlusLg className="text-emerald-400" /> Crear Nueva Meta de Consumo
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
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombre de la Meta</label>
                <input
                  type="text"
                  name="nombre_meta"
                  required
                  placeholder="Ej. Meta Eficiencia Planta Alta"
                  value={formData.nombre_meta}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tipo de Recurso</label>
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
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Límite Máximo Mensual</label>
                <input
                  type="number"
                  name="limite_mensual"
                  required
                  placeholder="Ej. 1500"
                  value={formData.limite_mensual}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                  Guardar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}