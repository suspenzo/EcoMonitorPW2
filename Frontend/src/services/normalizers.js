// ============ UTILIDADES ============

export const normalizarTipoRecurso = (nombreRecurso) => {
    if (!nombreRecurso) return 'ENERGIA';
    const n = nombreRecurso.toUpperCase();
    if (n.includes('AGUA')) return 'AGUA';
    return 'ENERGIA';
};

export const normalizarEstadoAlerta = (estadoBackend) => {
    switch (estadoBackend) {
        case 'NUEVA': return 'PENDIENTE';
        case 'EN ATENCION': return 'EN_REVISION';
        case 'RESUELTA': return 'RESUELTO';
        case 'DESCARTADA': return 'DESCARTADA';
        default: return 'PENDIENTE';
    }
};

export const estadoAlertaParaBackend = (estadoFrontend) => {
    switch (estadoFrontend) {
        case 'PENDIENTE': return 'NUEVA';
        case 'EN_REVISION': return 'EN ATENCION';
        case 'RESUELTO': return 'RESUELTA';
        case 'DESCARTADA': return 'DESCARTADA';
        default: return 'NUEVA';
    }
};

// ============ MEDIDOR ============

export const mapearMedidor = (medidor, recursos, areas, lecturas) => {
    const recurso = recursos.find(r => r.id_recurso === medidor.id_recurso);
    const area = areas.find(a => a.id_area === medidor.id_area);

    const lecturasMedidor = lecturas
        .filter(l => l.id_medidor === medidor.id_medidor)
        .sort((a, b) => new Date(b.fecha_lectura) - new Date(a.fecha_lectura));

    const ultimaLectura = lecturasMedidor[0];

    return {
        id_medidor: medidor.id_medidor,
        codigo: medidor.codigo,
        nombre: medidor.nombre,
        ubicacion: area?.nombre || 'Sin área',
        tipo_recurso: normalizarTipoRecurso(recurso?.nombre),
        unidad: recurso?.unidad_medida || 'kWh',
        ultima_lectura: ultimaLectura ? Number(ultimaLectura.valor_lectura) : 0,
        estado: medidor.activo ? 'ACTIVO' : 'MANTENIMIENTO',
        // Campos internos que a veces necesitamos
        id_recurso: medidor.id_recurso,
        id_area: medidor.id_area,
        activo: medidor.activo,
        fecha_instalacion: medidor.fecha_instalacion
    };
};

// ============ ALERTA ============

export const mapearAlerta = (alerta, lecturas, medidores) => {
    const lectura = lecturas.find(l => l.id_lectura === alerta.id_lectura);
    const medidor = lectura ? medidores.find(m => m.id_medidor === lectura.id_medidor) : null;

    return {
        id_alerta: alerta.id_alerta,
        fecha: alerta.fecha_generacion
            ? new Date(alerta.fecha_generacion).toISOString().replace('T', ' ').substring(0, 16)
            : '',
        tipo_anomalia: alerta.tipo,
        codigo_medidor: medidor?.codigo || `Lectura #${alerta.id_lectura}`,
        detalle: alerta.descripcion,
        nivel: alerta.nivel,
        estado: normalizarEstadoAlerta(alerta.estado),
        // Internos
        id_lectura: alerta.id_lectura,
        id_usuario: alerta.id_usuario
    };
};

// ============ META ============

export const mapearMeta = (meta, recursos, medidores) => {
    const recurso = recursos.find(r => r.id_recurso === meta.id_recurso);

    // Consumo actual = suma de últimas lecturas de todos los medidores del mismo recurso
    const consumoActual = medidores
        .filter(m => m.id_recurso === meta.id_recurso)
        .reduce((sum, m) => sum + (Number(m.ultima_lectura) || 0), 0);

    return {
        id_meta: meta.id_meta,
        nombre_meta: meta.descripcion || `Meta #${meta.id_meta}`,
        tipo_recurso: normalizarTipoRecurso(recurso?.nombre),
        unidad: recurso?.unidad_medida || 'kWh',
        limite_mensual: Number(meta.consumo_base),
        consumo_actual: Number(consumoActual.toFixed(2)),
        // Internos
        id_recurso: meta.id_recurso,
        id_area: meta.id_area,
        objetivo_ahorro_porcentaje: Number(meta.objetivo_ahorro_porcentaje),
        activo: meta.activo
    };
};

// ============ HELPERS PARA CREAR ============

// Devuelve id_recurso desde tipo_recurso ('ENERGIA'/'AGUA')
export const resolverIdRecurso = (tipoRecurso, recursos) => {
    const buscado = tipoRecurso === 'AGUA' ? 'AGUA' : 'ENERG';
    const recurso = recursos.find(r =>
        r.nombre.toUpperCase().includes(buscado)
    );
    return recurso?.id_recurso || recursos[0]?.id_recurso;
};

// Devuelve id_area por nombre, o la primera
export const resolverIdArea = (nombreArea, areas) => {
    const area = areas.find(a =>
        a.nombre.toLowerCase() === String(nombreArea).toLowerCase()
    );
    return area?.id_area || areas[0]?.id_area;
};