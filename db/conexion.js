import pg from 'pg-promise'
const pgp = pg();

import {configDotenv} from 'dotenv';
configDotenv();

const db_user = process.env.db_user;
const db_password = process.env.db_password;
const db_ip = process.env.db_ip;
const db_database = process.env.db_database;

const cnstr = `postgresql://${db_user}:${db_password}@${db_ip}:5432/${db_database}`;

const db = pgp(cnstr);

db.connect()
.then( ()=>{
    console.log("Conexion de Base de datos exitosa");
} )
.catch((err)=>{
    console.log(`Error de conexion ${err}`)
})

export { db }