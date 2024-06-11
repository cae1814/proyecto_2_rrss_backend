import express from 'express';
const publicacion = express();
import { crear, listar, like, comentar, listarcomentarios } from '../controllers/ControllerPublicaciones.js';
import multer from 'multer'; 

//Middleware 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

//Metdodo para creacion de publicacions
publicacion.get('/:id_usuario', listar);
publicacion.get('/comentarios/:id_publicacion', listarcomentarios);
publicacion.post('/crear', upload.single('imagen'), crear);
publicacion.post('/like/:id_publicacion', like);
publicacion.post('/comentar/:id_publicacion', comentar);

export { publicacion } 