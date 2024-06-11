import express from "express";
const app = express();
import { usuario } from "./routes/RouteUsuarios.js";
import { publicacion } from "./routes/RoutePublicaciones.js";
import cors from "cors";
import jwt from "jsonwebtoken";

//Configuraciones de Middleware
app.use(express.json());
app.use(cors());

const verificarToken = (req, res, next) => {
  const symbols = Object.getOwnPropertySymbols(req);
  const kHeadersSymbol = symbols.find((sym) => sym.toString() === "Symbol(kHeaders)");

  if (kHeadersSymbol) {
    const headers = req[kHeadersSymbol];
    const login = headers.authorization;
    
    if (login) {
      const auth_arr = login.split(" ");
      const token = auth_arr[1];

      try {
        const tokenDecode = jwt.verify(token, "appsecret");
        req.user = tokenDecode;
        next();
      } catch (err) {
        res.status(404).json(err.message);
      }
    } else {
          const body_bod = req.body.headers.Authorization;
          try {

            const auth_arr_bod = body_bod.split(" ");
            const token_bod =  auth_arr_bod[1];
            const tokenDecode_bod = jwt.verify(token_bod, "appsecret");
            req.user = tokenDecode_bod;
            next();
          } catch (err) {
            res.status(404).json(err.message);
            return res.status(403).json({ mensaje: "Se requiere un token, para acceder al metodo" });
          }
    }
  }
};

app.use("/api/nuevo", usuario, cors());
app.use("/api/login",  cors(), usuario);
app.use("/api/usuario",  verificarToken, cors(), usuario);
app.use("/api/publicacion", verificarToken, cors(), publicacion);

const port = 3000;
app.listen(port, () => {
  console.log(`Escuchando en el puero ${port}`);
});
