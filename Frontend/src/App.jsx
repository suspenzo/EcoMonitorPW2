import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import {
  Speedometer2,
  LightningCharge,
  BoxArrowInDown,
  ExclamationTriangle,
  Bullseye,
  PersonCircle,
  Tree,
  Gear,
  Calculator,
  Building
} from 'react-bootstrap-icons';

import DashboardPage from './pages/DashboardPage';
import MedidoresPage from './pages/MedidoresPage';
import CargaLecturasPage from './pages/CargaLecturasPage';
import AlertasPage from './pages/AlertasPage';
import MetasPage from './pages/MetasPage';
import SimuladorPage from './pages/SimuladorPage';
import AreasPage from './pages/AreasPage';
import AdminSettingsPage from './pages/AdminSettingsPage';


import {
  alertasAPI, areasAPI, lecturasAPI, medidoresAPI, metasAPI, recursosAPI,
  tarifasAPI, permisosAPI, rolesAPI, rolPermisosAPI, usuariosAPI, umbralesAPI
} from './services/api';

import {
  mapearMedidor, mapearAlerta, mapearMeta,
  estadoAlertaParaBackend, resolverIdRecurso, resolverIdArea
} from './services/normalizers';

// ID de usuario por defecto para crear registros que lo requieran.
// Cámbialo si tienes autenticación real.
const USUARIO_DEFAULT = 1;

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ============ ESTADO ============
  const [medidores, setMedidores] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [metas, setMetas] = useState([]);

  // Datos crudos necesarios para normalizar
  const [recursos, setRecursos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [lecturasCrudas, setLecturasCrudas] = useState([]);

  const [tarifas, setTarifas] = useState([]);
const [permisos, setPermisos] = useState([]);
const [roles, setRoles] = useState([]);
const [rolPermisos, setRolPermisos] = useState([]);
const [usuarios, setUsuarios] = useState([]);
const [umbrales, setUmbrales] = useState([]);

  const [cargando, setCargando] = useState(true);

  // ============ CARGA INICIAL ============
  const cargarTodo = useCallback(async () => {
    setCargando(true);
    try {
      const [
        recursosData, areasData, medidoresData, lecturasData, alertasData, metasData,
        tarifasData, permisosData, rolesData, rolPermisosData, usuariosData, umbralesData
      ] = await Promise.all([
        recursosAPI.getAll(),
        areasAPI.getAll(),
        medidoresAPI.getAll(),
        lecturasAPI.getAll(),
        alertasAPI.getAll(),
        metasAPI.getAll(),
        tarifasAPI.getAll(),
        permisosAPI.getAll(),
        rolesAPI.getAll(),
        rolPermisosAPI.getAll(),
        usuariosAPI.getAll(),
        // Si el backend aún no tiene umbrales, envolvemos en catch para no romper todo:
        umbralesAPI.getAll()
      ]);

      // Guardamos crudos
      setRecursos(recursosData);
      setAreas(areasData);
      setLecturasCrudas(lecturasData);
      setTarifas(tarifasData);
      setPermisos(permisosData);
      setRoles(rolesData);
      // Aseguramos una key única para la tabla (composite PK)
      setRolPermisos(rolPermisosData.map(rp => ({ ...rp, id_rol_key: `${rp.id_rol}-${rp.id_permiso}` })));
      setUsuarios(usuariosData);
      setUmbrales(umbralesData);

      // Normalizamos
      const medidoresNorm = medidoresData.map(m =>
        mapearMedidor(m, recursosData, areasData, lecturasData)
      );

      const alertasNorm = alertasData.map(a =>
        mapearAlerta(a, lecturasData, medidoresData)
      );

      const metasNorm = metasData.map(m =>
        mapearMeta(m, recursosData, medidoresNorm)
      );

      setMedidores(medidoresNorm);
      setAlertas(alertasNorm);
      setMetas(metasNorm);
    } catch (error) {
      toast.error('Error al cargar datos del servidor. Verifica que el backend esté corriendo.');
      console.error(error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);



    // ============ HANDLER: AGREGAR ÁREA ============
  const handleAgregarArea = async (nuevaArea) => {
    try {
      await areasAPI.create({
        nombre: nuevaArea.nombre,
        descripcion: nuevaArea.descripcion,
        activo: nuevaArea.activo
      });
      toast.success(`Área "${nuevaArea.nombre}" registrada correctamente.`);
      await cargarTodo();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al registrar el área.');
    }
  };

  // ============ HANDLER: ACTUALIZAR ÁREA ============
  const handleActualizarArea = async (idArea, datos) => {
    try {
      await areasAPI.update(idArea, {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        activo: datos.activo
      });
      toast.success(`Área "${datos.nombre}" actualizada correctamente.`);
      await cargarTodo();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al actualizar el área.');
    }
  };

  // ============ HANDLER: ELIMINAR ÁREA ============
  const handleEliminarArea = async (idArea) => {
    try {
      await areasAPI.delete(idArea);
      toast.success('Área eliminada correctamente.');
      await cargarTodo();
    } catch (error) {
      // Si tiene FKs (medidores, incidentes, metas), el backend devolverá un error
      toast.error(
        error.response?.data?.mensaje ||
        'No se puede eliminar: el área tiene registros asociados.'
      );
    }
  };
  const handleAgregarMedidor = async (nuevo) => {
  try {
    const id_recurso = resolverIdRecurso(nuevo.tipo_recurso, recursos);

    if (!id_recurso) {
      toast.error('No existe un recurso (Energía/Agua) en el backend.');
      return;
    }

    if (!nuevo.id_area) {
      toast.error('Debes seleccionar un área.');
      return;
    }

    // 1) Creamos el medidor
    const { medidor } = await medidoresAPI.create({
      id_recurso,
      id_area: nuevo.id_area,      // ← ya viene del select
      codigo: nuevo.codigo,
      nombre: nuevo.codigo,
      activo: nuevo.estado === 'ACTIVO'
    });

    // 2) Creamos la lectura inicial
    if (nuevo.ultima_lectura !== undefined && nuevo.ultima_lectura !== '') {
      await lecturasAPI.create({
        id_medidor: medidor.id_medidor,
        id_usuario: USUARIO_DEFAULT,
        valor_lectura: Number(nuevo.ultima_lectura),
        consumo: 0,
        observacion: 'Lectura inicial'
      });
    }

    toast.success(`Medidor ${nuevo.codigo} registrado exitosamente.`);
    await cargarTodo();
  } catch (error) {
    toast.error(error.response?.data?.mensaje || 'Error al registrar medidor.');
  }
};

  // ============ HANDLER: ACTUALIZAR LECTURA ============
  const handleActualizarLectura = async (identificador, nuevoValor) => {
    const valorNumerico = parseFloat(nuevoValor);

    if (isNaN(valorNumerico) || valorNumerico < 0) {
      toast.error('Por favor ingresa una lectura numérica válida.');
      return;
    }

    const medidorAfectado = medidores.find(
      m => m.id_medidor === Number(identificador) || m.codigo === String(identificador)
    );

    if (!medidorAfectado) {
      toast.error('No se encontró el medidor especificado.');
      return;
    }

    if (valorNumerico < medidorAfectado.ultima_lectura) {
      toast.error(
        `La nueva lectura (${valorNumerico}) no puede ser menor a la anterior (${medidorAfectado.ultima_lectura}).`
      );
      return;
    }

    try {
      // Calculamos consumo = nueva - anterior
      const consumo = valorNumerico - medidorAfectado.ultima_lectura;

      await lecturasAPI.create({
        id_medidor: medidorAfectado.id_medidor,
        id_usuario: USUARIO_DEFAULT,
        valor_lectura: valorNumerico,
        consumo
      });

      toast.success(`Lectura actualizada a ${valorNumerico} ${medidorAfectado.unidad}`);

      // Detección automática de pico
      if (valorNumerico > 1500) {
        await alertasAPI.create({
          id_lectura: 0, // ⚠️ Ver nota abajo
          id_usuario: USUARIO_DEFAULT,
          tipo: 'Lectura Crítica Detectada',
          descripcion: `Se registró una lectura atípica de ${valorNumerico} ${medidorAfectado.unidad}.`,
          nivel: 'CRITICO',
          estado: 'NUEVA'
        });
        toast('¡Alerta crítica generada por alto consumo!', { icon: '⚠️' });
      }

      await cargarTodo();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al registrar lectura.');
    }
  };

  // ============ HANDLER: CAMBIAR ESTADO DE ALERTA ============
  const handleCambiarEstadoAlerta = async (idAlerta, nuevoEstado) => {
    try {
      await alertasAPI.update(idAlerta, {
        estado: estadoAlertaParaBackend(nuevoEstado),
        fecha_resolucion: nuevoEstado === 'RESUELTO' ? new Date() : null
      });
      toast.success(`Alerta marcada como ${nuevoEstado.toLowerCase()}`);
      await cargarTodo();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al actualizar alerta.');
    }
  };

  // ============ HANDLER: AGREGAR META ============
  const handleAgregarMeta = async (nuevaMeta) => {
    if (!nuevaMeta.nombre_meta || nuevaMeta.limite_mensual <= 0) {
      toast.error('Ingresa una descripción válida y un límite mayor a 0.');
      return;
    }

    try {
      const id_recurso = resolverIdRecurso(nuevaMeta.tipo_recurso, recursos);
      const id_area = resolverIdArea('', areas);

      if (!id_recurso || !id_area) {
        toast.error('Falta un recurso o área en el backend.');
        return;
      }

      const hoy = new Date();
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      await metasAPI.create({
        id_area,
        id_recurso,
        descripcion: nuevaMeta.nombre_meta,
        periodo_inicio: hoy.toISOString(),
        periodo_fin: finMes.toISOString(),
        consumo_base: Number(nuevaMeta.limite_mensual),
        objetivo_ahorro_porcentaje: 10,
        activo: true
      });

      toast.success('Nueva meta de ahorro registrada.');
      await cargarTodo();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al crear meta.');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Speedometer2 className="inline mr-2 text-base" /> },
      { id: 'areas', label: 'Áreas', icon: <Building className="inline mr-2 text-base" /> },  // ← NUEVO
    { id: 'medidores', label: 'Medidores', icon: <LightningCharge className="inline mr-2 text-base" /> },
    { id: 'carga', label: 'Carga Lecturas', icon: <BoxArrowInDown className="inline mr-2 text-base" /> },
    { id: 'alertas', label: 'Alertas', icon: <ExclamationTriangle className="inline mr-2 text-base" /> },
    { id: 'metas', label: 'Metas de Ahorro', icon: <Bullseye className="inline mr-2 text-base" /> },
    { id: 'simulador', label: 'Simulador Tarifario', icon: <Calculator className="inline mr-2 text-base" /> },
    { id: 'admin', label: 'Configuración', icon: <Gear className="inline mr-2 text-base" /> }  
  ];

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center text-slate-600 font-semibold">
        Cargando datos desde el servidor…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Tree className="text-2xl text-emerald-400" />
            <h1 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              ECO-MONITOR <span className="text-white text-xs bg-slate-800 px-2 py-1 rounded">PYME v1.0</span>
            </h1>
          </div>
          <div className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <PersonCircle className="text-lg text-slate-400" />
            <span>percyrolfy (Admin)</span>
          </div>
        </header>

        <nav className="bg-slate-800 text-slate-300 px-6 py-2.5 flex space-x-2 text-sm font-medium border-b border-slate-700 overflow-x-auto">
          {menuItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="p-6 bg-slate-50">
          {activeTab === 'dashboard' && (
  <DashboardPage
    medidores={medidores}
    alertas={alertas}
    tarifas={tarifas}
    lecturas={lecturasCrudas}
    recursos={recursos}
  />
)}
          {activeTab === 'medidores' && <MedidoresPage medidores={medidores} areas={areas} onAgregarMedidor={handleAgregarMedidor} />}
          {activeTab === 'carga' && <CargaLecturasPage medidores={medidores} onGuardarLectura={handleActualizarLectura} />}
          {activeTab === 'alertas' && <AlertasPage alertas={alertas} onCambiarEstado={handleCambiarEstadoAlerta} />}
          {activeTab === 'metas' && <MetasPage metas={metas} onAgregarMeta={handleAgregarMeta} />}
          {activeTab === 'simulador' && <SimuladorPage />}
          {activeTab === 'areas' && ( <AreasPage   areas={areas} onAgregarArea={handleAgregarArea} 
          onActualizarArea={handleActualizarArea}
                onEliminarArea={handleEliminarArea}
              />
            )}
            {activeTab === 'admin' && (
                <AdminSettingsPage
                  recursos={recursos}
                  tarifas={tarifas}
                  permisos={permisos}
                  roles={roles}
                  rolPermisos={rolPermisos}
                  usuarios={usuarios}
                  umbrales={umbrales}
                  api={{
                    recursosAPI, tarifasAPI, permisosAPI, rolesAPI,
                    rolPermisosAPI, usuariosAPI, umbralesAPI
                  }}
                  onRefresh={cargarTodo}
                />
              )}
        </main>
      </div>
    </div>
  );
}