import React from 'react';
import toast from 'react-hot-toast';
import {
  LightningCharge,
  Droplet,
  CurrencyDollar,
  ExclamationTriangle,
  FileEarmarkExcel,
  PeopleFill
} from 'react-bootstrap-icons';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import * as XLSX from 'xlsx';

export default function DashboardPage({
  medidores = [],
  alertas = [],
  tarifas = [],
  lecturas = [],
  recursos = []
}) {
  // ─── HELPERS ────────────────────────────────────────────────
  const idRecursoDeTipo = (tipo) => {
    const buscado = tipo === 'AGUA' ? 'AGUA' : 'ENERG';
    return recursos.find(r => r.nombre.toUpperCase().includes(buscado))?.id_recurso;
  };

  const idsMedidoresDeRecurso = (tipo) => {
    const idRec = idRecursoDeTipo(tipo);
    if (!idRec) return [];
    return medidores.filter(m => m.id_recurso === idRec).map(m => m.id_medidor);
  };

  // ─── CONSUMO REAL ACUMULADO (suma de 'consumo' de todas las lecturas) ───
  const idsMedEnergia = idsMedidoresDeRecurso('ENERGIA');
  const idsMedAgua = idsMedidoresDeRecurso('AGUA');

  const totalEnergiaKwh = lecturas
    .filter(l => idsMedEnergia.includes(l.id_medidor))
    .reduce((acc, l) => acc + Number(l.consumo || 0), 0);

  const totalAguaM3 = lecturas
    .filter(l => idsMedAgua.includes(l.id_medidor))
    .reduce((acc, l) => acc + Number(l.consumo || 0), 0);

  // ─── TARIFA ACTIVA POR RECURSO ─────────────────────────────
  const tarifaActivaDe = (tipo) => {
    const idRec = idRecursoDeTipo(tipo);
    if (!idRec) return null;
    const hoy = new Date();
    const activas = tarifas.filter(t => t.id_recurso === idRec && t.activo);
    return activas.find(t =>
      new Date(t.fecha_inicio) <= hoy && new Date(t.fecha_fin) >= hoy
    ) || activas[0] || null;
  };

  const tarifaEnergia = tarifaActivaDe('ENERGIA');
  const tarifaAgua = tarifaActivaDe('AGUA');

  const precioEnergia = Number(tarifaEnergia?.precio_unitario || 0);
  const precioAgua = Number(tarifaAgua?.precio_unitario || 0);
  const cargoFijoEnergia = Number(tarifaEnergia?.cargo_fijo || 0);
  const cargoFijoAgua = Number(tarifaAgua?.cargo_fijo || 0);

  const costoEnergia = totalEnergiaKwh * precioEnergia + cargoFijoEnergia;
  const costoAgua = totalAguaM3 * precioAgua + cargoFijoAgua;
  const costoTotalBs = costoEnergia + costoAgua;

  // ─── ALERTAS ────────────────────────────────────────────────
  const alertasPendientes = alertas.filter(a =>
    a.estado === 'PENDIENTE' || a.estado === 'EN_REVISION'
  );
  const alertasCriticas = alertasPendientes.filter(a => a.nivel === 'CRITICO').length;

  // ─── DISTRIBUCIÓN ENERGÍA POR ÁREA ──────────────────────────
  const datosDistribucionEnergia = (() => {
    const porArea = {};
    medidores
      .filter(m => m.id_recurso === idRecursoDeTipo('ENERGIA'))
      .forEach(m => {
        const areaNombre = m.ubicacion || 'Sin área';
        const consumo = lecturas
          .filter(l => l.id_medidor === m.id_medidor)
          .reduce((acc, l) => acc + Number(l.consumo || 0), 0);
        porArea[areaNombre] = (porArea[areaNombre] || 0) + consumo;
      });
    return Object.entries(porArea)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .filter(d => d.value > 0);
  })();

  // ─── TENDENCIA ÚLTIMOS 7 DÍAS (desde lecturas reales) ───────
  const tendenciaSemanal = (() => {
    const dias = [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      dias.push({
        fechaKey: d.toISOString().slice(0, 10),
        dia: d.toLocaleDateString('es-BO', { weekday: 'short' }),
        energia_kwh: 0,
        agua_m3: 0
      });
    }
    lecturas.forEach(l => {
      const key = (l.fecha_lectura || '').slice(0, 10);
      const bucket = dias.find(d => d.fechaKey === key);
      if (!bucket) return;
      const consumo = Number(l.consumo || 0);
      if (idsMedEnergia.includes(l.id_medidor)) bucket.energia_kwh += consumo;
      else if (idsMedAgua.includes(l.id_medidor)) bucket.agua_m3 += consumo;
    });
    return dias.map(d => ({
      dia: d.dia,
      energia_kwh: Number(d.energia_kwh.toFixed(2)),
      agua_m3: Number(d.agua_m3.toFixed(2))
    }));
  })();

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  // ─── EXPORTAR EXCEL ─────────────────────────────────────────
  const handleExportarExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const resumenData = [
        { Indicador: 'Consumo Total Energía (kWh)', Valor: totalEnergiaKwh.toFixed(2) },
        { Indicador: 'Consumo Total Agua (m³)', Valor: totalAguaM3.toFixed(2) },
        { Indicador: 'Tarifa Energía aplicada (Bs/kWh)', Valor: precioEnergia.toFixed(2) },
        { Indicador: 'Tarifa Agua aplicada (Bs/m³)', Valor: precioAgua.toFixed(2) },
        { Indicador: 'Costo Total Estimado (Bs.)', Valor: costoTotalBs.toFixed(2) },
        { Indicador: 'Alertas Pendientes', Valor: alertasPendientes.length },
        { Indicador: 'Alertas Críticas', Valor: alertasCriticas }
      ];
      const wsResumen = XLSX.utils.json_to_sheet(resumenData);
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen KPIs');

      const wsMedidores = XLSX.utils.json_to_sheet(medidores);
      XLSX.utils.book_append_sheet(wb, wsMedidores, 'Medidores');

      const wsAlertas = XLSX.utils.json_to_sheet(alertas);
      XLSX.utils.book_append_sheet(wb, wsAlertas, 'Alertas');

      XLSX.writeFile(wb, `Reporte_EcoMonitor_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Reporte Excel generado y descargado correctamente.');
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al generar el archivo Excel.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Encabezado y Acción de Exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel Principal de Eficiencia</h2>
          <p className="text-slate-500 text-sm">Monitoreo dinámico de recursos e indicadores de sostenibilidad</p>
        </div>
        <button
          onClick={handleExportarExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <FileEarmarkExcel className="text-lg" />
          Exportar Reporte Excel
        </button>
      </div>

      {/* TARJETAS DE KPIS DINÁMICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* KPI 1: Energía */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Energía Consumida</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {totalEnergiaKwh.toFixed(1)} <span className="text-sm font-normal text-slate-500">kWh</span>
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
              {precioEnergia > 0 ? `Tarifa: Bs. ${precioEnergia.toFixed(2)}/kWh` : 'Sin tarifa activa'}
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <LightningCharge className="text-2xl" />
          </div>
        </div>

        {/* KPI 2: Agua */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agua Consumida</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {totalAguaM3.toFixed(1)} <span className="text-sm font-normal text-slate-500">m³</span>
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block">
              {precioAgua > 0 ? `Tarifa: Bs. ${precioAgua.toFixed(2)}/m³` : 'Sin tarifa activa'}
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Droplet className="text-2xl" />
          </div>
        </div>

        {/* KPI 3: Costo Proyectado */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gasto Estimado</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">Bs. {costoTotalBs.toFixed(2)}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Energía: Bs. {costoEnergia.toFixed(2)} · Agua: Bs. {costoAgua.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CurrencyDollar className="text-2xl" />
          </div>
        </div>

        {/* KPI 4: Alertas pendientes */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alertas Pendientes</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{alertasPendientes.length}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded mt-2 inline-block ${
              alertasCriticas > 0 ? 'bg-rose-50 text-rose-600'
              : alertasPendientes.length > 0 ? 'bg-amber-50 text-amber-600'
              : 'bg-emerald-50 text-emerald-600'
            }`}>
              {alertasCriticas > 0
                ? `${alertasCriticas} crítica(s)`
                : alertasPendientes.length > 0 ? 'Requieren Atención' : 'Sin pendientes'}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${
            alertasPendientes.length > 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
          }`}>
            <ExclamationTriangle className="text-2xl" />
          </div>
        </div>

      </div>

      {/* GRÁFICAS DEL DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tendencia semanal */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-4">
            Consumo de los Últimos 7 Días
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tendenciaSemanal}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', border: 'none' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Bar dataKey="energia_kwh" name="Energía (kWh)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agua_m3" name="Agua (m³)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por área */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-4">Distribución Energía por Área</h3>
          <div className="h-72 w-full">
            {datosDistribucionEnergia.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosDistribucionEnergia}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={4} dataKey="value"
                  >
                    {datosDistribucionEnergia.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-4">
                Aún no hay lecturas de energía para mostrar la distribución por área.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}