import React, { useState } from 'react';
import { Calculator, CashCoin, InfoCircle } from 'react-bootstrap-icons';

export default function SimuladorPage() {
  const [kwh, setKwh] = useState(1240);
  const [m3, setM3] = useState(88);
  const [tarifaKwh, setTarifaKwh] = useState(1.10);
  const [tarifaM3, setTarifaM3] = useState(6.50);

  const costoEnergia = kwh * tarifaKwh;
  const costoAgua = m3 * tarifaM3;
  const costoTotal = costoEnergia + costoAgua;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="text-emerald-600" /> Simulador de Estimación Tarifaria
        </h2>
        <p className="text-sm text-slate-500">Calcula la proyección del costo total ingresando tus tarifas por kWh y m³.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Entradas de Configuración */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Parámetros de Consumo y Tarifas</h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Consumo Eléctrico Proyectado (kWh)</label>
            <input
              type="number"
              value={kwh}
              onChange={(e) => setKwh(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tarifa Energía (Bs. / kWh)</label>
            <input
              type="number"
              step="0.01"
              value={tarifaKwh}
              onChange={(e) => setTarifaKwh(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <hr className="border-slate-100" />

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Consumo Agua Proyectado (m³)</label>
            <input
              type="number"
              value={m3}
              onChange={(e) => setM3(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tarifa Agua (Bs. / m³)</label>
            <input
              type="number"
              step="0.01"
              value={tarifaM3}
              onChange={(e) => setTarifaM3(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Proyección del Resultado */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-400 text-lg flex items-center gap-2">
              <CashCoin /> Proyección de Factura Final
            </h3>

            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Energía ({kwh} kWh x {tarifaKwh} Bs.)</span>
                <span className="font-bold">{costoEnergia.toFixed(2)} Bs.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Agua ({m3} m³ x {tarifaM3} Bs.)</span>
                <span className="font-bold">{costoAgua.toFixed(2)} Bs.</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Proyectado a Pagar</span>
              <div className="text-4xl font-extrabold text-emerald-400 mt-1">
                {costoTotal.toFixed(2)} <span className="text-xl font-normal text-white">Bs.</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
            <InfoCircle className="text-emerald-400 text-base shrink-0 mt-0.5" />
            <span>Los valores son estimaciones dinámicas y no incluyen cargos fijos de distribución local.</span>
          </div>
        </div>

      </div>
    </div>
  );
}