import { db } from "../db/db";

export async function insertar(
  users_id: number,
  descripcion: string,
  nombre: string,
  defecto: boolean,
  shared: boolean,
  frequent: boolean
): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");
  const defec = defecto ? 1 : 0;
  const [result]: any = await db.query(
    "INSERT INTO routines(users_id, description, name,is_default,created_at,is_shared,is_frequent )values (?,?,?,?,?,?,?)",
    [users_id, descripcion, nombre, defec, fechaActual, shared, frequent]
  );
  return result.insertId as number;
}

export async function modificar(
  id_rutinas: number,
  descripcion: string,
  nombre: string,
  defecto: boolean,
  shared: boolean,
  frequent: boolean
): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");
  const defec = defecto ? 1 : 0;
  const [result]: any = await db.query(
    `UPDATE routines
     SET name = ?, description = ?, created_at = ? 
     WHERE id = ?`,
    [nombre, descripcion, fechaActual, id_rutinas]
  );
  console.log("result", result);
  return result.changedRows as number;
}

export async function obtenerTarea(id: number): Promise<any> {
  const [rows]: any = await db.query(
    `SELECT * FROM routines r WHERE r.id = ?`,
    [id]
  );
  return rows;
}

/**
 * Crea una nueva versión de una rutina existente.
 * Si se marca como seleccionada, desmarca la anterior.
 * @param rutinaId ID de la rutina original
 * @param seleccionada Indica si esta nueva versión debe estar seleccionada
 * @returns ID de la nueva versión insertada
 */
export async function crearNuevaVersionRutina(
  rutinaId: number,
  seleccionada: boolean = false
): Promise<number> {
  // Si esta nueva versión será seleccionada, desmarcamos la anterior
  if (seleccionada) {
    await db.query(
      `UPDATE routines_versions SET is_selected = 0 WHERE routines_id = ? AND is_selected = 1`,
      [rutinaId]
    );
  }

  // Obtener la última versión
  const [rows]: any = await db.query(
    `SELECT MAX(version_number) as ultimaVersion FROM routines_versions WHERE routines_id = ?`,
    [rutinaId]
  );
  const ultimaVersion = rows[0]?.ultimaVersion ?? 0;
  const nuevaVersion = ultimaVersion + 1;

  // Insertar la nueva versión
  const [result]: any = await db.query(
    `INSERT INTO routines_versions (routines_id, version_number, is_selected)
     VALUES (?, ?, ?)`,
    [rutinaId, nuevaVersion, seleccionada ? 1 : 0]
  );

  return result.insertId as number;
}
