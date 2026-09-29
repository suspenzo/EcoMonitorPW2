export const mockKpis = {
  energia_kwh: 1240.50,
  energia_variacion: -5.2,
  agua_m3: 88.20,
  agua_variacion: 12.4,
  costo_total_bs: 1850.00,
  presupuesto_total_bs: 2000.00
};

export const mockMedidores = [
  { id_medidor: 1, codigo: 'MED-ENG-01', tipo_recurso: 'ENERGIA', ubicacion: 'Planta Principal - Producción', ultima_lectura: 1240.5, unidad: 'kWh', estado: 'ACTIVO' },
  { id_medidor: 2, codigo: 'MED-AGU-01', tipo_recurso: 'AGUA', ubicacion: 'Cocina & Comedor', ultima_lectura: 45.2, unidad: 'm³', estado: 'ALERTA' },
  { id_medidor: 3, codigo: 'MED-ENG-02', tipo_recurso: 'ENERGIA', ubicacion: 'Oficinas Administrativas', ultima_lectura: 520.1, unidad: 'kWh', estado: 'ACTIVO' },
  { id_medidor: 4, codigo: 'MED-AGU-02', tipo_recurso: 'AGUA', ubicacion: 'Baños - Sector A', ultima_lectura: 43.0, unidad: 'm³', estado: 'ACTIVO' }
];

export const mockAlertasIniciales = [
  { id_alerta: 1, fecha: '2026-09-26 14:30', tipo_anomalia: 'Fuga Potencial / Consumo Continuo', codigo_medidor: 'MED-AGU-01', detalle: 'Consumo nocturno atípico (+40% sobre el promedio).', nivel: 'CRITICO', estado: 'PENDIENTE' },
  { id_alerta: 2, fecha: '2026-09-25 18:10', tipo_anomalia: 'Pico de Consumo Eléctrico', codigo_medidor: 'MED-ENG-01', detalle: 'Superó el umbral máximo de 200 kWh/hora.', nivel: 'ADVERTENCIA', estado: 'PENDIENTE' }
];

export const mockMetasIniciales = [
  { id_meta: 1, nombre_meta: 'Reducir consumo eléctrico en producción', tipo_recurso: 'ENERGIA', limite_mensual: 1100, consumo_actual: 1240.5, unidad: 'kWh' },
  { id_meta: 2, nombre_meta: 'Controlar consumo de agua en oficinas', tipo_recurso: 'AGUA', limite_mensual: 75, consumo_actual: 88.2, unidad: 'm³' }
];

export const mockConsumoDiario = [
  { dia: 'lun 21', energia_kwh: 180, agua_m3: 11 },
  { dia: 'mar 22', energia_kwh: 210, agua_m3: 12 },
  { dia: 'mié 23', energia_kwh: 195, agua_m3: 10 },
  { dia: 'jue 24', energia_kwh: 230, agua_m3: 15 },
  { dia: 'vie 25', energia_kwh: 240, agua_m3: 14 },
  { dia: 'sáb 26', energia_kwh: 160, agua_m3: 9 },
  { dia: 'dom 27', energia_kwh: 205, agua_m3: 14 }
];