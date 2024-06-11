import { db } from "../db/conexion.js";

const crear = async (req, res) => {
    console.log("Publicando...");
    const user = req.user;
    const id_usuario = user.id;
    const comentario = req.body.comentario;
    
    try {
        const { buffer, originalname, mimetype } = req.file;

        const sql = `INSERT INTO rs_publicaciones (id_usuario, comentario, foto, nombre_foto, mime_type)
                    VALUES ($1, $2, $3, $4, $5) RETURNING id`;

        const result = await db.query(sql, [id_usuario, comentario, buffer, originalname, mimetype]);

        // Contador de publicaciones //
        let sql_upd = `UPDATE rs_usuarios SET publicaciones = publicaciones + 1 WHERE id = $1`;
        let resp_upd = await db.query(sql_upd, [id_usuario]);

        res.json({response_code: "0", mensaje:"Success", obj_data: result});
    }catch (error){
        res.json({response_code: "1", mensaje: error.error, obj_data: error});
        console.log(error);
    }
};

const like = async (req, res) => { 
    const { id_publicacion } = req.params;   
    console.log("Like("+id_publicacion+")"); 
     
    const user = req.user;
    const id_usuario = user.id;
    
    let sql = `UPDATE rs_publicaciones SET megusta = megusta + 1 WHERE id = $1 RETURNING *`;
    const result = await db.query(sql, id_publicacion); 

    let sql2 = `UPDATE rs_usuarios SET megusta = megusta + 1 WHERE id = (SELECT id_usuario FROM rs_publicaciones WHERE id = $1)`;
    await db.query(sql2, id_publicacion);

    let sql3 = `INSERT INTO rs_megusta (id_usuario, id_publicacion) VALUES ($1, $2)`;
    const params = [id_usuario, id_publicacion];
    await db.query(sql3, params);

    res.json({message:"Success", obj_data: result});
};

const listar = async (req, res) => {
    console.log('listar');

    const user = req.user;
    const id_usuario_req = user.id;
    const {id_usuario} = req.params;
    let user_id;

    if (id_usuario == -1){
        user_id = "a.id_usuario = "+id_usuario_req;
    }else if (id_usuario == -2){
        user_id = "a.id_usuario > "+id_usuario;
    } else {
        user_id = "a.id_usuario = "+id_usuario;
    }

    const sql = "SELECT a.id id_publicacion, b.id, b.nombre_completo, a.comentario, a.nombre_foto, encode(a.foto, 'base64') foto, a.mime_type, \n"
                     +" CASE WHEN a.estado = 1 THEN 'Activo' ELSE 'Inactivo' END estado, a.megusta megusta, a.comentarios, TO_CHAR(fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') fecha_creacion \n"
                +" FROM rs_publicaciones a, rs_usuarios b \n"
                +" WHERE a.id_usuario = b.id AND "+user_id+" ORDER BY 1 DESC";

    const result = await db.query(sql, user_id);

    if (result.length === 0){
        res.json( {message :"No hay publicaciones"} );
        return ;
    }

    res.json(result);
};

const comentar = async (req, res) => {
    console.log("Comentando...");
    const user = req.user;

    const id_usuario = user.id;
    const {comentario} = req.body;
    const { id_publicacion } = req.params;

    const sql = `INSERT INTO rs_comentarios (id_usuario, id_publicacion, comentario)
                VALUES ($1, $2, $3) RETURNING id`;

    const result = await db.query(sql, [id_usuario, id_publicacion, comentario]);

    // Contador de publicaciones //
    let sql2 = `UPDATE rs_usuarios SET comentarios = comentarios + 1 WHERE id = (SELECT id_usuario FROM rs_publicaciones WHERE id = $1)`;
    let resp = await db.query(sql2, id_publicacion);

    sql2 = `UPDATE rs_publicaciones SET comentarios = comentarios + 1 WHERE id = $1`;
    resp = await db.query(sql2, id_publicacion);

    res.json({mensaje:"Success", obj_data: result});
};

const listarcomentarios = async (req, res) => { 
    const {id_publicacion} = req.params;
    console.log(`listarcomentarios(${id_publicacion})`);

    const sql = `SELECT a.id id, b.id id_usuario, a.id_publicacion, a.comentario, TO_CHAR(a.fecha, 'DD/MM/YYYY HH24:MI:SS') fecha_creacion, b.nombre_completo
                   FROM rs_comentarios a, rs_usuarios b
                  WHERE a.id_usuario = b.id
                    AND a.id_publicacion = $1
                  ORDER BY 1 DESC`;

    const result = await db.query(sql, id_publicacion);

    if (result.length === 0){
        res.status(200).json( {message :"No hay comentarios"} );
        return ;
    }

    res.json(result);
};

export {
    crear,
    listar,
    like,
    comentar,
    listarcomentarios
}

