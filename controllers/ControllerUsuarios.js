import { db } from "../db/conexion.js";
import jwt from 'jsonwebtoken';
import {configDotenv} from 'dotenv';
configDotenv();

const crearUsuario = async (req, res) => {
    console.log("Creando...");
    
    try {
        
        const { nombre_usuario, nombre_completo, correo, contrasena } = req.body;
        const { buffer, originalname, mimetype } = req.file;

        const sql = `INSERT INTO rs_usuarios (nombre_usuario, nombre_completo, correo, contrasena, foto, nombre_foto, mime_type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * `;
        
        const result = await db.query(sql, [nombre_usuario, nombre_completo, correo, contrasena, buffer, originalname, mimetype]);
        res.status(200).json({ responde_code: 0, mensaje: "Usuario Creado", obj_creado: result });
    } catch (err) {
        res.status(200).json({ responde_code: -1, mensaje: `Error al ejecutar el SQL`, err: err.message })
    }
}

const listarUsuarios = async (req, res) => {
    console.log("ListarUsuarios");
    try {
        
        var sql = "SELECT id, nombre_usuario, nombre_completo, correo, encode(foto, 'base64') foto, CASE WHEN estado = 1 THEN 'Activo' ELSE 'Inactivo' END estado, publicaciones, megusta, TO_CHAR(fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') fecha_creacion, comentarios FROM rs_usuarios WHERE estado = 1 ORDER BY id DESC ";
        const result = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ mensaje: `Error de Compilacion`, err: err.message })
    }
}

const verUsuario = async (req, res) => {

    try {
        
        const {id} = req.params;
        var sql = "SELECT id, nombre_usuario, nombre_completo, correo, encode(foto, 'base64'), CASE WHEN estado = 1 THEN 'Activo' ELSE 'Inactivo' END estado, publicaciones, megusta, TO_CHAR(fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') fecha_creacion FROM rs_usuarios WHERE id = $1 ORDER BY id ASC ";
        const result = await db.query(sql, id);
        res.status(200).json({result});
    } catch (err) {
        res.status(500).json({ mensaje: `Error de Compilacion`, err: err.message })
    }
}

const login = async (req, res) => {
    console.log("Login");
    const app_token_vigency = process.env.app_token_vigency;

    try {
        const { nombre_usuario, contrasena } = req.body;
        const sql = `SELECT id, nombre_usuario, nombre_completo, correo, encode(foto, 'base64') foto, CASE WHEN estado = 1 THEN 'Activo' ELSE 'Inactivo' END estado,
                            publicaciones, megusta, TO_CHAR(fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') fecha_creacion
                       FROM rs_usuarios
                      WHERE nombre_usuario  = $1
                        AND contrasena      = $2
                        AND estado 	        = 1
                      ORDER BY id ASC `;

        const result = await db.query(sql, [nombre_usuario, contrasena]);

        if (result.length === 0) {
            res.status(200).json({ response_code: -1, mensaje: "Credenciales Invalidas" });
        } else {
            const payload = result[0]; 
            const token = jwt.sign ( payload, 'appsecret', { expiresIn: app_token_vigency*60*60}  );
            res.status(200).json({response_code: 0,  user_id: result, mensaje: "Autenticaion Exitosa", info_user: token })
        }
    } catch (err) {
        res.status(200).json({ response_code: -2, mensaje: "Error de Autenticacion", err: err.message })
    }
}

export {
    crearUsuario, 
    listarUsuarios,
    verUsuario,
    login
}

//status
//status exitoso: 200 - 204
//status erroneo : 500
//status sin datos: 400, 404 // prohibido