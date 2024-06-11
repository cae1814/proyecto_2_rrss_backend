-- Active: 1698945600332@@127.0.0.1@5432@rrss
create table rs_usuarios (
	id          		SERIAL PRIMARY KEY,
    nombre_usuario      VARCHAR(60) UNIQUE,
    nombre_completo     VARCHAR(70),
    correo              VARCHAR(100),
    contrasena          VARCHAR(20),
    estado              INT DEFAULT 1,
	publicaciones		INT	DEFAULT 0,
	megusta				INT	DEFAULT 0,
    comentarios		    INT	DEFAULT 0,
    nombre_foto         VARCHAR(9000),
	foto                BYTEA,
    mime_type           VARCHAR(9000),
    fecha_creacion      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rs_publicaciones (
    id              SERIAL PRIMARY key,
    id_usuario		INT,
	comentario      VARCHAR(9000),
    nombre_foto     VARCHAR(200),
	foto            BYTEA,
    mime_type       VARCHAR(500),
    estado          INT DEFAULT 1,
    megusta         INT DEFAULT 0,
    comentarios     INT DEFAULT 0,
	fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_usuario) REFERENCES rs_usuarios(id)
);

CREATE TABLE rs_megusta (
    id              SERIAL PRIMARY key,
    id_usuario      INT,
    id_publicacion  INT,
	fecha			TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    
INSERT INTO rs_usuarios (nombre_usuario, nombre_completo, correo, contrasena) VALUES ('cae1814', 'Cristian A. Espinoza', 'cae1814@hotmail.com', 'Hon.2020');

CREATE TABLE rs_comentarios (
    id              SERIAL PRIMARY KEY,
    id_usuario      INT,
    id_publicacion  INT,
	comentario		VARCHAR(9000),
	fecha			TIMESTAMP DEFAULT CURRENT_TIMESTAMP);