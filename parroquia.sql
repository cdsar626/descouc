USE interoperables;

CREATE TABLE estados(
  id           INT UNSIGNED NOT NULL,
  nombre       VARCHAR(300) NOT NULL,
  
  PRIMARY KEY(id)
  
);

CREATE TABLE municipios(
  id           INT UNSIGNED NOT NULL,
  estado       INT UNSIGNED NOT NULL,
  nombre       VARCHAR(300) NOT NULL,
  
  PRIMARY KEY(id),
  INDEX fk_municipios_estado_idx (estado DESC),
    CONSTRAINT fk_municipios_estado
    FOREIGN KEY (estado)
    REFERENCES estados (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
  
  
);

CREATE TABLE parroquias(
  id           INT UNSIGNED NOT NULL,
  municipio    INT UNSIGNED NOT NULL,
  nombre       VARCHAR(300) NOT NULL,
  
  PRIMARY KEY(id),
  INDEX fk_parroquias_municipio_idx (municipio DESC),
    CONSTRAINT fk_parroquias_municipio
    FOREIGN KEY (municipio)
    REFERENCES municipios (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

INSERT INTO estados (id, nombre) VALUES  
(0, "Cojedes"), 
(1, "Carabobo"), 
(2, "Aragua");

INSERT INTO municipios (id, estado, nombre) VALUES 
(0, 0, "Anzoategui"),
(1, 0, "Pao de San Juan Bautista"),
(2, 0, "Tinaquillo"),
(3, 0, "Girardot"),
(4, 0, "Lima Blanco"),
(5, 0, "Ricaurte"),
(6, 0, "Rómulo Gallegos"),
(7, 0, "Ezequiel Zamora"),
(8, 0, "Tinaco"),
(9, 1, "Bejuma"),
(10, 1, "Carlos Arvelo"),
(11, 1, "Diego Ibarra"),
(12, 1, "Guacara"),
(13, 1, "Juan José Mora"),
(14, 1, "Libertador"),
(15, 1, "Los Guayos"),
(16, 1, "Miranda"),
(17, 1, "Montalbán"),
(18, 1, "Naguanagua"),
(19, 1, "Puerto Cabello"),
(20, 1, "San Diego"),
(21, 1, "San Joaquín"),
(22, 1, "Valencia"),
(23, 2, "Bolívar"),
(24, 2, "Camatagua"),
(25, 2, "Francisco Linares Alcántara"),
(26, 2, "Girardot"),
(27, 2, "José Ángel Lamas"),
(28, 2, "José Félix Ribas"),
(29, 2, "José Rafael Revenga"),
(30, 2, "Libertador"),
(31, 2, "Mario Briceño Iragorry"),
(32, 2, "Ocumare de la Costa de Oro"),
(33, 2, "San Casimiro"),
(34, 2, "San Sebastián"),
(35, 2, "Santiago Mariño"),
(36, 2, "Santos Michelena"),
(37, 2, "Sucre"),
(38, 2, "Tovar"),
(39, 2, "Urdaneta"),
(40, 2, "Zamora");


INSERT INTO parroquias (id, municipio, nombre) VALUES
(0, 0, "Cojedes"),
(1, 0, "Juan de Mata Suárez"),
(2, 1, "El Pao"),
(3, 2, "Tinaquillo"),
(4, 3, "El Baúl"),
(5, 3, "Sucre"),
(6, 4, "La Aguadita"),
(7, 4, "Macapo"),
(8, 5, "El Amparo"),
(9, 5, "Libertad de Cojedes"),
(10, 6, "Rómulo Gallegos"),
(11, 7, "San Carlos de Austria"),
(12, 7, "Juan Ángel Bravo"),
(13, 7, "Manuel Manrique"),
(14, 8, "General en Jefe José Laurencio Silva"),
(15, 9, "Bejuma"),
(16, 9, "Canoabo"),
(17, 9, "Simón Bolívar"),
(18, 10, "Güigüe"),
(19, 10, "Belén"),
(20, 10, "Tacarigua"),
(21, 11, "Mariara"),
(22, 11, "Aguas Calientes"),
(23, 12, "Ciudad Alianza"),
(24, 12, "Guacara"),
(25, 12, "Yagua"),
(26, 13, "Morón"),
(27, 13, "Urama"),
(28, 14, "Tocuyito"),
(29, 14, "Independencia"),
(30, 15, "Los Guayos Valencia"),
(31, 16, "Miranda"),
(32, 17, "Montalbán"),
(33, 18, "Urbanización Naguanagua"),
(34, 19, "Bartolomé Salóm"),
(35, 19, "Democracia"),
(36, 19, "Fraternidad"),
(37, 19, "Goaigoaza"),
(38, 19, "Juan José Flores"),
(39, 19, "Unión"),
(40, 19, "Borburata"),
(41, 19, "Patanemo"),
(42, 20, "San Diego"),
(43, 21, "San Joaquín"),
(44, 22, "Candelaria"),
(45, 22, "Catedral"),
(46, 22, "El Socorro"),
(47, 22, "Miguel Peña"),
(48, 22, "Rafael Urdaneta"),
(49, 22, "San Blas"),
(50, 22, "San José"),
(51, 22, "Santa Rosa"),
(52, 22, "No Urbana Negro Primero"),
(53, 23, "Bolívar"),
(54, 24, "Camatagua"),
(55, 24, "Carmen de Cura"),
(56, 25, "Rita"),
(57, 25, "Francisco de Miranda"),
(58, 25, "Moseñor Feliciano González"),
(59, 26, "Pedro José Ovalles"),
(60, 26, "Joaquín Crespo"),
(61, 26, "José Casanova Godoy"),
(62, 26, "Madre María de San José"),
(63, 26, "Andrés Eloy Blanco"),
(64, 26, "Los Tacarigua"),
(65, 26, "Las Delicias"),
(66, 26, "Choroní"),
(67, 27, "Santa Cruz"),
(68, 28, "Félix Ribas"),
(69, 28, "Nieves Ríos"),
(70, 28, "Guacamayas"),
(71, 28, "Zárate"),
(72, 28, "Zuata"),
(73, 29, "José Rafael Revenga"),
(74, 30, "Palo Negro"),
(75, 30, "San Martín de Porres"),
(76, 31, "El Limón"),
(77, 31, "Caña de Azúcar"),
(78, 32, "Ocumare de la Costa"),
(79, 33, "San Casimiro"),
(80, 33, "Güiripa"),
(81, 33, "Ollas de Caramacate"),
(82, 33, "Valle Morín"),
(83, 34, "San Sebastían"),
(84, 35, "Turmero"),
(85, 35, "Arevalo Aponte"),
(86, 35, "Chuao"),
(87, 35, "Chuao"),
(88, 35, "Pacheco Miranda"),
(89, 36, "Santos Michelena"),
(90, 36, "Tiara"),
(91, 37, "Cagua"),
(92, 37, "Bella Vista"),
(93, 38, "Tovar"),
(94, 39, "Urdaneta"),
(95, 39, "Las Peñitas"),
(96, 39, "San Francisco de Cara"),
(97, 39, "Taguay"),
(98, 40, "Villa de Cura"),
(99, 40, "Magdaleno"),
(100, 40, "San Francisco de Asís"),
(101, 40, "Valles de Tucutunemo"),
(102, 40, "Augusto Mijares");
