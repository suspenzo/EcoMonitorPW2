import React from 'react';
import toast from 'react-hot-toast';
import { 
  LightningCharge, 
  Droplet, 
  CurrencyDollar, 
  ExclamationTriangle, 
  FileEarmarkExcel, 
  Download 
} from 'react-bootstrap-icons';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

import * as XLSX from 'xlsx';
import { mockConsumoDiario } from '../services/mockData';

export default function DashboardPage({ medidores = [] }) {
  // 1. CÁLCULOS DINÁMICOS BASADOS EN EL ESTADO REAL DE MEDIDORES
  const totalEnergiaKwh = medidores
    .filter((m) => m.tipo_recurso === 'ENERGIA')
    .reduce((acc, m) => acc + (Number(m.ultima_lectura) || 0), 0);

  const totalAguaM3 = medidores
    .filter((m) => m.tipo_recurso === 'AGUA')
    .reduce((acc, m) => acc + (Number(m.ultima_lectura) || 0), 0);

  // Estimación de costos en Bs (Tarifas base: Bs. 0.85 / kWh y Bs. 8.50 / m³)
  const costoEnergia = totalEnergiaKwh * 0.85;
  const costoAgua = totalAguaM3 * 8.50;
  const costoTotalBs = costoEnergia + costoAgua;
  const presupuestoTotalBs = 2500.00; // Presupuesto mensual de referencia

  // Conteo de medidores en estado de alerta o revisión
  const medidoresEnAlerta = medidores.filter((m) => m.estado === 'ALERTA').length;

  // 2. DATOS DINÁMICOS PARA LA GRÁFICA DE DISTRIBUCIÓN POR UBICACIÓN
  const datosDistribucionEnergia = medidores
    .filter((m) => m.tipo_recurso === 'ENERGIA')
    .map((m) => ({
      name: m.ubicacion,
      value: Number(m.ultima_lectura) || 0
    }));

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  // 3. EXPORTACIÓN A EXCEL CON MÚLTIPLES HOJAS Y NOTIFICACIÓN TOAST
  const handleExportarExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Hoja 1: Resumen de KPIs
      const resumenData = [
        { Indicador: 'Consumo Total Energía (kWh)', Valor: totalEnergiaKwh.toFixed(2) },
        { Indicador: 'Consumo Total Agua (m³)', Valor: totalAguaM3.toFixed(2) },
        { Indicador: 'Costo Total Estimado (Bs.)', Valor: costoTotalBs.toFixed(2) },
        { Indicador: 'Presupuesto Mensual (Bs.)', Valor: presupuestoTotalBs.toFixed(2) },
        { Indicador: 'Medidores en Alerta', Valor: medidoresEnAlerta }
      ];
      const wsResumen = XLSX.utils.json_to_sheet(resumenData);
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen KPIs');

      // Hoja 2: Detalle de Medidores
      const wsMedidores = XLSX.utils.json_to_sheet(medidores);
      XLSX.utils.book_append_sheet(wb, wsMedidores, 'Medidores');

      // Descarga del archivo
      XLSX.writeFile(wb, `Reporte_EcoMonitor_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      // Notificación Toast de éxito
      toast.success('Reporte Excel generado y descargado correctamente.');
    } catch (error) {
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
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Energía Acumulada</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalEnergiaKwh.toFixed(1)} <span className="text-sm font-normal text-slate-500">kWh</span></h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
              Calculado en vivo
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <LightningCharge className="text-2xl" />
          </div>
        </div>

        {/* KPI 2: Agua */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agua Acumulada</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalAguaM3.toFixed(1)} <span className="text-sm font-normal text-slate-500">m³</span></h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block">
              Calculado en vivo
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Droplet className="text-2xl" />
          </div>
        </div>

        {/* KPI 3: Costo Proyectado */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gasto Proyectado</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">Bs. {costoTotalBs.toFixed(2)}</h3>
            <p className="text-xs text-slate-400 mt-1">Límite: Bs. {presupuestoTotalBs.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CurrencyDollar className="text-2xl" />
          </div>
        </div>

        {/* KPI 4: Estado del Sistema */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sensores en Alerta</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{medidoresEnAlerta}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded mt-2 inline-block ${medidoresEnAlerta > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {medidoresEnAlerta > 0 ? 'Requieren Atención' : 'Operación Normal'}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${medidoresEnAlerta > 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
            <ExclamationTriangle className="text-2xl" />
          </div>
        </div>

      </div>

      {/* GRÁFICAS DEL DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfica de Consumo Diario (Histórico) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-4">Tendencia Semanal de Consumo</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockConsumoDiario}>
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

        {/* Gráfica Circular: Distribución por Medidores de Energía */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-4">Distribución Energía por Área</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosDistribucionEnergia}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {datosDistribucionEnergia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}