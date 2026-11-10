export const initDatabase = ` 
  CREATE TABLE IF NOT EXISTS modelos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    version INTEGER NOT NULL,
    modelo TEXT NOT NULL,
    marca TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS catalogo_infracciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    necesita_retencion BOOLEAN NOT NULL,
    monto INTEGER NOT NULL,
    gravedad TEXT NOT NULL,
    cod_articulo TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS propietarios (
    id TEXT PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    cedula INTEGER NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    telefono TEXT NOT NULL,
    tipo TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS vehiculos (
    id TEXT PRIMARY KEY,
    placa TEXT UNIQUE NOT NULL,
    serial_motor TEXT NOT NULL,
    vin_serial TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL,
    estado_registro TEXT NOT NULL,
    fecha_registro TEXT NOT NULL,
    modelo_id INTEGER NOT NULL,
    FOREIGN KEY(modelo_id) REFERENCES modelos(id)
  );

  CREATE TABLE IF NOT EXISTS historial_propiedad (
    id TEXT PRIMARY KEY,
    nro_documento_titulo TEXT UNIQUE NOT NULL,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT,
    propietario_id TEXT NOT NULL,
    vehiculo_id TEXT NOT NULL,
    FOREIGN KEY (propietario_id) REFERENCES propietarios(id),
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
  );

  CREATE TABLE IF NOT EXISTS multas (
    id TEXT PRIMARY KEY,
    monto INTEGER NOT NULL,
    lugar_infraccion TEXT NOT NULL,
    fecha_hora TEXT NOT NULL,
    fecha_pago TEXT,
    n_boleta TEXT UNIQUE NOT NULL,
    vehiculo_id TEXT NOT NULL,
    infractor_id TEXT NOT NULL,
    infraccion_id INTEGER NOT NULL,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
    FOREIGN KEY (infractor_id) REFERENCES propietarios(id),
    FOREIGN KEY (infraccion_id) REFERENCES catalogo_infracciones(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_historial_active
    ON historial_propiedad(vehiculo_id)
    WHERE fecha_fin IS NULL;

  CREATE INDEX IF NOT EXISTS idx_multas_vehiculo
    ON multas(vehiculo_id);

  CREATE INDEX IF NOT EXISTS idx_multas_infractor
    ON multas(infractor_id);

  CREATE INDEX IF NOT EXISTS idx_historial_vehiculo
    ON historial_propiedad(vehiculo_id);
`
export const insertStatements = {
  propietarios: `
    INSERT INTO propietarios 
      (id, 
      nombre_completo, 
      cedula, 
      direccion, 
      correo, 
      telefono, 
      tipo) VALUES (?, ?, ?, ?, ?, ?, ?);`,
  vehiculos: `
    INSERT INTO vehiculos 
      (id,
      placa,
      serial_motor,
      vin_serial,
      color,
      estado_registro,
      fecha_registro,
      modelo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
  modelos: `
      INSERT INTO modelos (
        tipo,
        version,
        modelo,
        marca) VALUES (?, ?, ?, ?);`,
  multas: `
      INSERT INTO multas (
        id,
        monto,
        lugar_infraccion,
        fecha_hora,
        fecha_pago,
        n_boleta,
        vehiculo_id,
        infractor_id,
        infraccion_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
  catalogo_infracciones: `
      INSERT INTO catalogo_infracciones (    
        necesita_retencion,
        monto,
        gravedad,
        cod_articulo
      ) VALUES (?, ?, ?, ?);`,
  historial_propiedad: `
      INSERT INTO historial_propiedad (    
        id,
        nro_documento_titulo,
        fecha_inicio,
        fecha_fin,
        propietario_id,
        vehiculo_id) VALUES (?, ?, ?, ?, ?, ?);`,
}

export type TableName = keyof typeof insertStatements
