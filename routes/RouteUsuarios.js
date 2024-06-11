import express from 'express';
const usuario = express();
import { crearUsuario, listarUsuarios, verUsuario, login} from '../controllers/ControllerUsuarios.js';
import multer from 'multer';

//Middleware 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Metdodo para creacion de Usuarios
usuario.post('/crear', upload.single('imagen'), crearUsuario);
usuario.get('/listar', listarUsuarios);
usuario.get('/:id', verUsuario);
usuario.post('/login', login);
 
export { usuario }