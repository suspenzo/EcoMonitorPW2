import React, { useState } from 'react';
import { 
  PencilSquare, 
  FileEarmarkArrowUp, 
  Floppy2, 
  CloudUpload, 
  CheckCircleFill,
  ExclamationTriangleFill
} from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';

export default function CargaLecturasPage({ medidores = [], onGuardarLectura }) {
  const [medidorId, setMedidorId] = useState(medidores[0]?.id_medidor || '');
  const [valor, setValor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorArchivo, setErrorArchivo] = useState('');
  const [archivoCargado, setArchivoCargado] = useState(null);

  // Guardar lectura individual
  const handleSubmitManual = (e) => {
    e.preventDefault();
    if (!valor) return;

    onGuardarLectura(medidorId, valor);
    
    const medidorSel = medidores.find((m) => m.id_medidor === Number(medidorId));
    setMensaje(`Lectura de ${valor} ${medidorSel?.unidad || ''} guardada exitosamente para ${medidorSel?.codigo}.`);
    setValor('');

    setTimeout(() => setMensaje(''), 4000);
  };

  // Manejar selección de archivo Excel/CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoCargado(file);
      setErrorArchivo('');
    }
  };

  // Procesar archivo Excel
  const handleProcesarArchivo = () => {
    if (!archivoCargado) {
      setErrorArchivo('Por favor selecciona un archivo .xlsx o .csv primero.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

        let registrosProcesados = 0;

        rows.forEach((row) => {
          // Busca columnas como 'id_medidor' / 'codigo' y 'lectura' / 'valor'
          const id = row.id_medidor || row.id;
          const lecturaVal = row.lectura || row.valor || row.ultima_lectura;

          if (id && lecturaVal !== undefined) {
            onGuardarLectura(id, lecturaVal);
            registrosProcesados++;
          }
        });

        if (registrosProcesados > 0) {
          setMensaje(`Se procesaron y actualizaron ${registrosProcesados} lecturas desde el archivo.`);
          setArchivoCargado(null);
          setErrorArchivo('');
        } else {
          setErrorArchivo('No se encontraron columnas válidas ("id_medidor" y "lectura") en el archivo.');
        }
      } catch (err) {
        setErrorArchivo('Error al leer el archivo. Asegúrate de que sea un Excel válido.');
      }
    };

    reader.readAsArrayBuffer(archivoCargado);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Formulario Manual */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <PencilSquare className="text-emerald-600" /> Captura Manual de Lectura
        </h3>

        {mensaje && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
            <CheckCircleFill className="text-emerald-600 text-base" /> {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmitManual} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Seleccionar Medidor</label>
            <select
              value={medidorId}
              onChange={(e) => setMedidorId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 font-medium"
            >
              {medidores.map((m) => (
                <option key={m.id_medidor} value={m.id_medidor}>
                  {m.codigo} — {m.ubicacion} ({m.tipo_recurso})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Valor de Nueva Lectura
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ej. 1450.50"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Floppy2 /> Registrar Lectura
          </button>
        </form>
      </div>

      {/* Carga Masiva */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileEarmarkArrowUp className="text-emerald-600" /> Carga Masiva (Excel / CSV)
          </h3>

          {errorArchivo && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2">
              <ExclamationTriangleFill className="text-rose-500 text-base" /> {errorArchivo}
            </div>
          )}

          <label className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 text-center my-4 hover:border-emerald-500 transition flex flex-col items-center cursor-pointer block">
            <CloudUpload className="text-4xl text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              {archivoCargado ? archivoCargado.name : 'Haz clic para seleccionar o arrastra tu archivo Excel'}
            </p>
            <span className="text-xs text-slate-400 mt-1">Soporta formatos .xlsx y .csv</span>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        </div>

        <button 
          onClick={handleProcesarArchivo}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer"
        >
          ⚡ Procesar Archivo
        </button>
      </div>

    </div>
  );
}