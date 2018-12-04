CREATE DATABASE interoperables;
USE interoperables

CREATE TABLE usuarios(
  email     VARCHAR(25) NOT NULL PRIMARY KEY,
  pass      VARCHAR(40) NOT NULL,
  rol       TINYINT UNSIGNED NOT NULL,
  facultad  VARCHAR(15)
);


CREATE TABLE proyectos(
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombreProyecto          VARCHAR(300) NOT NULL,
  orgResponsable          VARCHAR(300) NOT NULL,
  responsables            VARCHAR(350) NOT NULL,
  ubicacionGeografica     VARCHAR(350) NOT NULL,
  beneficiariosDirectos   VARCHAR(300) NOT NULL,
  beneficiariosIndirectos VARCHAR(300) NOT NULL,
  tipoProyecto            VARCHAR(150) NOT NULL,
  areaAtencion            VARCHAR(150) NOT NULL,
  duracionProyecto        VARCHAR(30) NOT NULL,
  fechaInicio             DATE NOT NULL,
  fechaFin                DATE NOT NULL,
  objGeneral              VARCHAR(300) NOT NULL,
  objsEspecificos         VARCHAR(1000) NOT NULL,
  tipo                    TINYINT UNSIGNED NOT NULL,
  status                  TINYINT UNSIGNED NOT NULL,
  nota                    VARCHAR(300),

  PRIMARY KEY(id)
);

CREATE TABLE documentos(
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ruta                  VARCHAR(180) NOT NULL,
  nombreDoc             VARCHAR(150) NOT NULL,
  refProyecto           INT UNSIGNED NOT NULL,

  PRIMARY KEY(id),
  INDEX fk_documentos_refProyecto_idx (refProyecto DESC),
  CONSTRAINT fk_documentos_refProyecto
    FOREIGN KEY (refProyecto)
    REFERENCES proyectos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
-- mysql -u root -p < allv3.sql

-- Para acceder a la base de datos desde el cliente
-- Se crea un usuario no-root con todos los privilegios sobre
-- la database interoperables
CREATE USER 'desco'@'localhost' IDENTIFIED BY '12Desco!';
GRANT ALL PRIVILEGES  ON interoperables.* TO 'desco'@'localhost';

-- Para acceder al sistema se necesita minimo un usuario administrador
-- Modificar a gusto (email,pass,rol,nombre,apellido)
INSERT INTO usuarios VALUES('ad@gm.com',SHA('12'),1,NULL);
