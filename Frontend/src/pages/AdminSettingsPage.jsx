import React, { useState } from 'react';
import {
  Gear, Folder, CashStack, Tag, ShieldLock, Link45deg, PeopleFill, Sliders,
  PlusLg, PencilSquare, Trash, XLg, CheckCircleFill, XCircleFill, GeoAlt
} from 'react-bootstrap-icons';

/* ============================================================
   COMPONENTES GENÉRICOS
============================================================ */
const Modal = ({ titulo, icono, onCerrar, children }) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
        <h3 className="font-bold flex items-center gap-2">{icono} {titulo}</h3>
        <button onClick={onCerrar} className="text-slate-400 hover:text-white cursor-pointer"><XLg /></button>
      </div>
      <div className="overflow-y-auto">{children}</div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{label}</label>}
    <input {...props}
      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{label}</label>}
    <textarea rows="2" {...props}
      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    {label && <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{label}</label>}
    <select {...props}
      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500">
      {children}
    </select>
  </div>
);

const CheckActivo = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <input id="activo" type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 accent-emerald-600 cursor-pointer" />
    <label htmlFor="activo" className="text-sm text-slate-700 cursor-pointer">Activo</label>
  </div>
);

const FormActions = ({ onCancelar, textoGuardar = 'Guardar' }) => (
  <div className="pt-3 flex justify-end space-x-2">
    <button type="button" onClick={onCancelar}
      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">
      Cancelar
    </button>
    <button type="submit"
      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow cursor-pointer">
      {textoGuardar}
    </button>
  </div>
);

const Badge = ({ activo }) => activo ? (
  <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
    <CheckCircleFill className="text-emerald-600" /> Activo
  </span>
) : (
  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
    <XCircleFill className="text-slate-500" /> Inactivo
  </span>
);

const Tabla = ({ columnas, filas, keyField = 'id', render, onEditar, onEliminar }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
          <tr>
            {columnas.map(c => <th key={c} className="px-4 py-3">{c}</th>)}
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filas.length > 0 ? filas.map((f) => (
            <tr key={f[keyField]} className="hover:bg-slate-50/80">
              {render(f)}
              <td className="px-4 py-3 text-right whitespace-nowrap">
                {onEditar && (
                  <button onClick={() => onEditar(f)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer" title="Editar">
                    <PencilSquare />
                  </button>
                )}
                <button onClick={() => onEliminar(f)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer" title="Eliminar">
                  <Trash />
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={columnas.length + 1} className="px-4 py-8 text-center text-slate-400">Sin registros</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const TabHeader = ({ titulo, descripcion, onNuevo, textoBoton }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <div>
      <h3 className="text-lg font-bold text-slate-900">{titulo}</h3>
      <p className="text-sm text-slate-500">{descripcion}</p>
    </div>
    <button onClick={onNuevo}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow transition flex items-center gap-2 cursor-pointer">
      <PlusLg /> {textoBoton}
    </button>
  </div>
);

/* ============================================================
   TAB: RECURSOS
============================================================ */
function RecursosTab({ recursos, api, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(null);
  const [form, setForm] = useState({ nombre: '', unidad_medida: '', descripcion: '', activo: true });

  const abrirNuevo = () => { setEdicion(null); setForm({ nombre: '', unidad_medida: '', descripcion: '', activo: true }); setModal(true); };
  const abrirEditar = (r) => { setEdicion(r); setForm({ nombre: r.nombre, unidad_medida: r.unidad_medida, descripcion: r.descripcion, activo: r.activo }); setModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edicion) await api.update(edicion.id_recurso, form);
      else await api.create(form);
      setModal(false); onRefresh();
    } catch (err) { alert(err.response?.data?.mensaje || 'Error al guardar'); }
  };

  const eliminar = async (r) => {
    if (!window.confirm(`¿Eliminar "${r.nombre}"?`)) return;
    try { await api.delete(r.id_recurso); onRefresh(); }
    catch { alert('No se puede eliminar: tiene tarifas, medidores o metas asociadas.'); }
  };

  return (
    <div className="space-y-4">
      <TabHeader titulo="Recursos" descripcion="Tipos de recurso medido (Energía, Agua, etc.)."
        onNuevo={abrirNuevo} textoBoton="Nuevo Recurso" />
      <Tabla
        columnas={['ID', 'Nombre', 'Unidad', 'Descripción', 'Estado']}
        filas={recursos} keyField="id_recurso"
        onEditar={abrirEditar} onEliminar={eliminar}
        render={(r) => (<>
          <td className="px-4 py-3 font-mono text-slate-500">#{r.id_recurso}</td>
          <td className="px-4 py-3 font-bold text-slate-800">{r.nombre}</td>
          <td className="px-4 py-3 font-mono">{r.unidad_medida}</td>
          <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">{r.descripcion}</td>
          <td className="px-4 py-3"><Badge activo={r.activo} /></td>
        </>)}
      />
      {modal && (
        <Modal titulo={edicion ? 'Editar Recurso' : 'Nuevo Recurso'} icono={<Folder className="text-emerald-400" />} onCerrar={() => setModal(false)}>
          <form onSubmit={submit} className="p-5 space-y-3">
            <Input label="Nombre" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Unidad de medida" required placeholder="kWh, m³, L..." value={form.unidad_medida} onChange={e => setForm({ ...form, unidad_medida: e.target.value })} />
            <Textarea label="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            <CheckActivo value={form.activo} onChange={(v) => setForm({ ...form, activo: v })} />
            <FormActions onCancelar={() => setModal(false)} textoGuardar={edicion ? 'Guardar cambios' : 'Crear recurso'} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   TAB: TARIFAS
============================================================ */
function TarifasTab({ tarifas, recursos, api, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(null);
  const [form, setForm] = useState({ id_recurso: '', precio_unitario: '', cargo_fijo: '', fecha_inicio: '', fecha_fin: '', activo: true });

  const abrirNuevo = () => {
    setEdicion(null);
    setForm({ id_recurso: recursos[0]?.id_recurso || '', precio_unitario: '', cargo_fijo: '', fecha_inicio: '', fecha_fin: '', activo: true });
    setModal(true);
  };
  const abrirEditar = (t) => {
    setEdicion(t);
    setForm({
      id_recurso: t.id_recurso, precio_unitario: t.precio_unitario, cargo_fijo: t.cargo_fijo,
      fecha_inicio: t.fecha_inicio?.slice(0, 10) || '', fecha_fin: t.fecha_fin?.slice(0, 10) || '', activo: t.activo
    });
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      id_recurso: Number(form.id_recurso),
      precio_unitario: Number(form.precio_unitario),
      cargo_fijo: Number(form.cargo_fijo)
    };
    try {
      if (edicion) await api.update(edicion.id_tarifa, payload);
      else await api.create(payload);
      setModal(false); onRefresh();
    } catch (err) { alert(err.response?.data?.mensaje || 'Error al guardar'); }
  };

  const eliminar = async (t) => {
    if (!window.confirm('¿Eliminar esta tarifa?')) return;
    try { await api.delete(t.id_tarifa); onRefresh(); } catch { alert('Error al eliminar'); }
  };

  const nombreRecurso = (id) => recursos.find(r => r.id_recurso === id)?.nombre || `#${id}`;

  return (
    <div className="space-y-4">
      <TabHeader titulo="Tarifas" descripcion="Precios por unidad y cargos fijos."
        onNuevo={abrirNuevo} textoBoton="Nueva Tarifa" />
      <Tabla
        columnas={['ID', 'Recurso', 'Precio Unit.', 'Cargo Fijo', 'Inicio', 'Fin', 'Estado']}
        filas={tarifas} keyField="id_tarifa"
        onEditar={abrirEditar} onEliminar={eliminar}
        render={(t) => (<>
          <td className="px-4 py-3 font-mono text-slate-500">#{t.id_tarifa}</td>
          <td className="px-4 py-3 font-bold text-slate-800">{nombreRecurso(t.id_recurso)}</td>
          <td className="px-4 py-3">Bs. {Number(t.precio_unitario).toFixed(2)}</td>
          <td className="px-4 py-3">Bs. {Number(t.cargo_fijo).toFixed(2)}</td>
          <td className="px-4 py-3 text-xs">{t.fecha_inicio?.slice(0, 10)}</td>
          <td className="px-4 py-3 text-xs">{t.fecha_fin?.slice(0, 10)}</td>
          <td className="px-4 py-3"><Badge activo={t.activo} /></td>
        </>)}
      />
      {modal && (
        <Modal titulo={edicion ? 'Editar Tarifa' : 'Nueva Tarifa'} icono={<CashStack className="text-emerald-400" />} onCerrar={() => setModal(false)}>
          <form onSubmit={submit} className="p-5 space-y-3">
            <Select label="Recurso" required value={form.id_recurso} onChange={e => setForm({ ...form, id_recurso: e.target.value })}>
              {recursos.map(r => <option key={r.id_recurso} value={r.id_recurso}>{r.nombre} ({r.unidad_medida})</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Precio Unit." type="number" step="0.01" required value={form.precio_unitario} onChange={e => setForm({ ...form, precio_unitario: e.target.value })} />
              <Input label="Cargo Fijo" type="number" step="0.01" required value={form.cargo_fijo} onChange={e => setForm({ ...form, cargo_fijo: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Fecha inicio" type="date" required value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} />
              <Input label="Fecha fin" type="date" required value={form.fecha_fin} onChange={e => setForm({ ...form, fecha_fin: e.target.value })} />
            </div>
            <CheckActivo value={form.activo} onChange={(v) => setForm({ ...form, activo: v })} />
            <FormActions onCancelar={() => setModal(false)} textoGuardar={edicion ? 'Guardar cambios' : 'Crear tarifa'} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   TAB: PERMISOS
============================================================ */
function PermisosTab({ permisos, api, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });

  const abrirNuevo = () => { setEdicion(null); setForm({ nombre: '', descripcion: '' }); setModal(true); };
  const abrirEditar = (p) => { setEdicion(p); setForm({ nombre: p.nombre, descripcion: p.descripcion || '' }); setModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edicion) await api.update(edicion.id_permiso, form);
      else await api.create(form);
      setModal(false); onRefresh();
    } catch (err) { alert(err.response?.data?.mensaje || 'Error al guardar'); }
  };

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar el permiso "${p.nombre}"?`)) return;
    try { await api.delete(p.id_permiso); onRefresh(); }
    catch { alert('No se puede eliminar: está asignado a uno o varios roles.'); }
  };

  return (
    <div className="space-y-4">
      <TabHeader titulo="Permisos" descripcion="Acciones permitidas por el sistema."
        onNuevo={abrirNuevo} textoBoton="Nuevo Permiso" />
      <Tabla
        columnas={['ID', 'Nombre', 'Descripción']}
        filas={permisos} keyField="id_permiso"
        onEditar={abrirEditar} onEliminar={eliminar}
        render={(p) => (<>
          <td className="px-4 py-3 font-mono text-slate-500">#{p.id_permiso}</td>
          <td className="px-4 py-3 font-bold text-slate-800">{p.nombre}</td>
          <td className="px-4 py-3 text-xs text-slate-600">{p.descripcion || '—'}</td>
        </>)}
      />
      {modal && (
        <Modal titulo={edicion ? 'Editar Permiso' : 'Nuevo Permiso'} icono={<Tag className="text-emerald-400" />} onCerrar={() => setModal(false)}>
          <form onSubmit={submit} className="p-5 space-y-3">
            <Input label="Nombre" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <Textarea label="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            <FormActions onCancelar={() => setModal(false)} textoGuardar={edicion ? 'Guardar cambios' : 'Crear permiso'} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   TAB: ROLES
============================================================ */
function RolesTab({ roles, api, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', activo: true });

  const abrirNuevo = () => { setEdicion(null); setForm({ nombre: '', descripcion: '', activo: true }); setModal(true); };
  const abrirEditar = (r) => { setEdicion(r); setForm({ nombre: r.nombre, descripcion: r.descripcion || '', activo: r.activo }); setModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edicion) await api.update(edicion.id_rol, form);
      else await api.create(form);
      setModal(false); onRefresh();
    } catch (err) { alert(err.response?.data?.mensaje || 'Error al guardar'); }
  };

  const eliminar = async (r) => {
    if (!window.confirm(`¿Eliminar el rol "${r.nombre}"?`)) return;
    try { await api.delete(r.id_rol); onRefresh(); }
    catch { alert('No se puede eliminar: hay usuarios o permisos asociados.'); }
  };

  return (
    <div className="space-y-4">
      <TabHeader titulo="Roles" descripcion="Grupos de permisos asignables a usuarios."
        onNuevo={abrirNuevo} textoBoton="Nuevo Rol" />
      <Tabla
        columnas={['ID', 'Nombre', 'Descripción', 'Estado']}
        filas={roles} keyField="id_rol"
        onEditar={abrirEditar} onEliminar={eliminar}
        render={(r) => (<>
          <td className="px-4 py-3 font-mono text-slate-500">#{r.id_rol}</td>
          <td className="px-4 py-3 font-bold text-slate-800">{r.nombre}</td>
          <td className="px-4 py-3 text-xs text-slate-600">{r.descripcion || '—'}</td>
          <td className="px-4 py-3"><Badge activo={r.activo} /></td>
        </>)}
      />
      {modal && (
        <Modal titulo={edicion ? 'Editar Rol' : 'Nuevo Rol'} icono={<ShieldLock className="text-emerald-400" />} onCerrar={() => setModal(false)}>
          <form onSubmit={submit} className="p-5 space-y-3">
            <Input label="Nombre" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <Textarea label="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            <CheckActivo value={form.activo} onChange={(v) => setForm({ ...form, activo: v })} />
            <FormActions onCancelar={() => setModal(false)} textoGuardar={edicion ? 'Guardar cambios' : 'Crear rol'} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   TAB: ROL ↔ PERMISO
============================================================ */
function RolPermisoTab({ rolPermisos, roles, permisos, api, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id_rol: '', id_permiso: '' });

  const abrirNuevo = () => {
    setForm({ id_rol: roles[0]?.id_rol || '', id_permiso: permisos[0]?.id_permiso || '' });
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.create({ id_rol: Number(form.id_rol), id_permiso: Number(form.id_permiso) });
      setModal(false); onRefresh();
    } catch (err) { alert(err.response?.data?.mensaje || 'Error al asignar'); }
  };

  const eliminar = async (rp) => {
    if (!window.confirm('¿Quitar este permiso del rol?')) return;
    try { await api.delete(rp.id_rol, rp.id_permiso); onRefresh(); }
    catch { alert('Error al eliminar'); }
  };

  const nombreRol = (id) => roles.find(r => r.id_rol === id)?.nombre || `#${id}`;
  const nombrePermiso = (id) => permisos.find(p => p.id_permiso === id)?.nombre || `#${id}`;

  return (
    <div className="space-y-4">
      <TabHeader titulo="Asignación Rol ↔ Permiso" descripcion="Vincula permisos a roles."
        onNuevo={abrirNuevo} textoBoton="Asignar Permiso" />
      {roles.length === 0 || permisos.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl">
          Necesitas al menos 1 rol y 1 permiso creados para poder asignar.
        </div>
      ) : (
        <Tabla
          columnas={['Rol', 'Permiso']}
          filas={rolPermisos} keyField="id_rol_key"
          onEliminar={eliminar}
          render={(rp) => (<>
            <td className="px-4 py-3 font-bold text-slate-800">{nombreRol(rp.id_rol)}</td>
            <td className="px-4 py-3 text-slate-700">{nombrePermiso(rp.id_permiso)}</td>
          </>)}
        />
      )}
      {modal && (
        <Modal titulo="Asignar Permiso a Rol" icono={<Link45deg className="text-emerald-400" />} onCerrar={() => setModal(false)}>
          <form onSubmit={submit} className="p-5 space-y-3">
            <Select label="Rol" required value={form.id_rol} onChange={e => setForm({ ...form, id_rol: e.target.value })}>
              {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>)}
            </Select>
            <Select label="Permiso" required value={form.id_permiso} onChange={e => setForm({ ...form, id_permiso: e.target.value })}>
              {permisos.map(p => <option key={p.id_permiso} value={p.id_permiso}>{p.nombre}</option>)}
            </Select>
            <FormActions onCancelar={() => setModal(false)} textoGuardar="Asignar" />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   TAB: USUARIOS
============================================================ */
function UsuariosTab({ usuarios, roles, api, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(null);
 const emptyForm = { 
  id_rol: '', nombre: '', apellido: '', usuario: '', correo: '', 
  password: '',        // ← antes: password_hash
  activo: true 
};
const [form, setForm] = useState(emptyForm);

  const abrirNuevo = () => { setEdicion(null); setForm({ ...emptyForm, id_rol: roles[0]?.id_rol || '' }); setModal(true); };
  const abrirEditar = (u) => {
    setEdicion(u);
    setForm({
      id_rol: u.id_rol, nombre: u.nombre, apellido: u.apellido || '', usuario: u.usuario,
      correo: u.correo, password: '', activo: u.activo
    });
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, id_rol: Number(form.id_rol) };
    // Si editamos y no cambian la contraseña, no la enviamos
    if (edicion && !payload.password) delete payload.password;

    try {
      if (edicion) await api.update(edicion.id_usuario, payload);
      else await api.create(payload);
      setModal(false); onRefresh();
    } catch (err) { alert(err.response?.data?.mensaje || 'Error al guardar. Verifica que usuario y correo no estén repetidos.'); }
  };

  const eliminar = async (u) => {
    if (!window.confirm(`¿Eliminar al usuario "${u.usuario}"?`)) return;
    try { await api.delete(u.id_usuario); onRefresh(); }
    catch { alert('No se puede eliminar: tiene lecturas o alertas asociadas.'); }
  };

  const nombreRol = (id) => roles.find(r => r.id_rol === id)?.nombre || `#${id}`;

  return (
    <div className="space-y-4">
      <TabHeader titulo="Usuarios" descripcion="Cuentas con acceso al sistema."
        onNuevo={abrirNuevo} textoBoton="Nuevo Usuario" />
      <Tabla
        columnas={['ID', 'Nombre', 'Usuario', 'Correo', 'Rol', 'Estado']}
        filas={usuarios} keyField="id_usuario"
        onEditar={abrirEditar} onEliminar={eliminar}
        render={(u) => (<>
          <td className="px-4 py-3 font-mono text-slate-500">#{u.id_usuario}</td>
          <td className="px-4 py-3 font-bold text-slate-800">{u.nombre} {u.apellido}</td>
          <td className="px-4 py-3 font-mono text-xs">{u.usuario}</td>
          <td className="px-4 py-3 text-xs">{u.correo}</td>
          <td className="px-4 py-3 text-xs font-semibold text-emerald-700">{nombreRol(u.id_rol)}</td>
          <td className="px-4 py-3"><Badge activo={u.activo} /></td>
        </>)}
      />
      {modal && (
        <Modal titulo={edicion ? 'Editar Usuario' : 'Nuevo Usuario'} icono={<PeopleFill className="text-emerald-400" />} onCerrar={() => setModal(false)}>
          <form onSubmit={submit} className="p-5 space-y-3">
            <Select label="Rol" required value={form.id_rol} onChange={e => setForm({ ...form, id_rol: e.target.value })}>
              {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input label="Apellido" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
            </div>
            <Input label="Usuario" required value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} />
            <Input label="Correo" type="email" required value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />
            <Input
              label={edicion ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              type="password" required={!edicion}
              value={form.password}
              onChange={e => setForm({ ...form, password_hash: e.target.value })}
            />
            <CheckActivo value={form.activo} onChange={e => setForm({ ...form, password: e.target.value })} />
            <FormActions onCancelar={() => setModal(false)} textoGuardar={edicion ? 'Guardar cambios' : 'Crear usuario'} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   TAB: UMBRALES
============================================================ */
function UmbralesTab({ umbrales, api, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(null);
  const [form, setForm] = useState({ tipo_periodo: 'DIARIO', limite_consumo: '', activo: true });

  const abrirNuevo = () => { setEdicion(null); setForm({ tipo_periodo: 'DIARIO', limite_consumo: '', activo: true }); setModal(true); };
  const abrirEditar = (u) => { setEdicion(u); setForm({ tipo_periodo: u.tipo_periodo, limite_consumo: u.limite_consumo, activo: u.activo }); setModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, limite_consumo: Number(form.limite_consumo) };
    try {
      if (edicion) await api.update(edicion.id_umbral, payload);
      else await api.create(payload);
      setModal(false); onRefresh();
    } catch (err) { alert(err.response?.data?.mensaje || 'Error al guardar. ¿Ya creaste el modelo Umbral en el backend?'); }
  };

  const eliminar = async (u) => {
    if (!window.confirm('¿Eliminar este umbral?')) return;
    try { await api.delete(u.id_umbral); onRefresh(); }
    catch { alert('No se puede eliminar: hay medidores asociados.'); }
  };

  return (
    <div className="space-y-4">
      <TabHeader titulo="Umbrales de Consumo" descripcion="Límites que disparan alertas automáticas."
        onNuevo={abrirNuevo} textoBoton="Nuevo Umbral" />
      <Tabla
        columnas={['ID', 'Tipo Periodo', 'Límite', 'Creado', 'Estado']}
        filas={umbrales} keyField="id_umbral"
        onEditar={abrirEditar} onEliminar={eliminar}
        render={(u) => (<>
          <td className="px-4 py-3 font-mono text-slate-500">#{u.id_umbral}</td>
          <td className="px-4 py-3 font-bold text-slate-800">{u.tipo_periodo}</td>
          <td className="px-4 py-3">{u.limite_consumo}</td>
          <td className="px-4 py-3 text-xs">{u.fecha_creacion?.slice(0, 10)}</td>
          <td className="px-4 py-3"><Badge activo={u.activo} /></td>
        </>)}
      />
      {modal && (
        <Modal titulo={edicion ? 'Editar Umbral' : 'Nuevo Umbral'} icono={<Sliders className="text-emerald-400" />} onCerrar={() => setModal(false)}>
          <form onSubmit={submit} className="p-5 space-y-3">
            <Select label="Tipo de periodo" required value={form.tipo_periodo} onChange={e => setForm({ ...form, tipo_periodo: e.target.value })}>
              <option value="DIARIO">DIARIO</option>
              <option value="SEMANAL">SEMANAL</option>
              <option value="MENSUAL">MENSUAL</option>
            </Select>
            <Input label="Límite de consumo" type="number" step="0.01" required value={form.limite_consumo} onChange={e => setForm({ ...form, limite_consumo: e.target.value })} />
            <CheckActivo value={form.activo} onChange={(v) => setForm({ ...form, activo: v })} />
            <FormActions onCancelar={() => setModal(false)} textoGuardar={edicion ? 'Guardar cambios' : 'Crear umbral'} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   PÁGINA PRINCIPAL
============================================================ */
export default function AdminSettingsPage({
  recursos = [], tarifas = [], permisos = [], roles = [], rolPermisos = [],
  usuarios = [], umbrales = [],
  api, onRefresh
}) {
  const [activeTab, setActiveTab] = useState('recursos');

  const tabs = [
    { id: 'recursos', label: 'Recursos', icon: <Folder className="mr-1" /> },
    { id: 'tarifas', label: 'Tarifas', icon: <CashStack className="mr-1" /> },
    { id: 'permisos', label: 'Permisos', icon: <Tag className="mr-1" /> },
    { id: 'roles', label: 'Roles', icon: <ShieldLock className="mr-1" /> },
    { id: 'rolpermiso', label: 'Rol ↔ Permiso', icon: <Link45deg className="mr-1" /> },
    { id: 'usuarios', label: 'Usuarios', icon: <PeopleFill className="mr-1" /> },
    { id: 'umbrales', label: 'Umbrales', icon: <Sliders className="mr-1" /> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Gear className="text-emerald-600" /> Configuración del Sistema
        </h2>
        <p className="text-sm text-slate-500">Administra todos los catálogos y entidades base de Eco-Monitor.</p>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-slate-800 rounded-xl p-1.5 flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center transition cursor-pointer ${
              activeTab === t.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div>
        {activeTab === 'recursos' && <RecursosTab recursos={recursos} api={api.recursosAPI} onRefresh={onRefresh} />}
        {activeTab === 'tarifas' && <TarifasTab tarifas={tarifas} recursos={recursos} api={api.tarifasAPI} onRefresh={onRefresh} />}
        {activeTab === 'permisos' && <PermisosTab permisos={permisos} api={api.permisosAPI} onRefresh={onRefresh} />}
        {activeTab === 'roles' && <RolesTab roles={roles} api={api.rolesAPI} onRefresh={onRefresh} />}
        {activeTab === 'rolpermiso' && <RolPermisoTab rolPermisos={rolPermisos} roles={roles} permisos={permisos} api={api.rolPermisosAPI} onRefresh={onRefresh} />}
        {activeTab === 'usuarios' && <UsuariosTab usuarios={usuarios} roles={roles} api={api.usuariosAPI} onRefresh={onRefresh} />}
        {activeTab === 'umbrales' && <UmbralesTab umbrales={umbrales} api={api.umbralesAPI} onRefresh={onRefresh} />}
      </div>
    </div>
  );
}