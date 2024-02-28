UPDATE `cliente`   SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;
UPDATE `preorcto`  SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;
UPDATE `preorctoi` SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;
UPDATE `reserva`   SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;
UPDATE `itens`     SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;
UPDATE `produto`   SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;
UPDATE `categ`     SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;
UPDATE `tabpre`    SET `SINCRONIZA`= 0 WHERE `SINCRONIZA` = 1;



UPDATE `cliente`   SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;
UPDATE `preorcto`  SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;
UPDATE `preorctoi` SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;
UPDATE `reserva`   SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;
UPDATE `itens`     SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;
UPDATE `produto`   SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;
UPDATE `categ`     SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;
UPDATE `tabpre`    SET `SINCRONIZA`= 1 WHERE `SINCRONIZA` = 0;



ALTER TABLE `cliente`  ADD `SINCRONIZA` int(10) UNSIGNED NOT NULL DEFAULT '0' ;
ALTER TABLE `preorcto` ADD `SINCRONIZA` int(10) UNSIGNED NOT NULL DEFAULT '0' ;
ALTER TABLE `preorctoi`ADD `SINCRONIZA` int(10) UNSIGNED NOT NULL DEFAULT '0' ;
ALTER TABLE `produto`  ADD `SINCRONIZA` int(10) UNSIGNED NOT NULL DEFAULT '0' ;
ALTER TABLE `categ`    ADD `SINCRONIZA` int(10) UNSIGNED NOT NULL DEFAULT '0' ;
ALTER TABLE `tabpre`   ADD `SINCRONIZA` int(10) UNSIGNED NOT NULL DEFAULT '0' ;



ALTER TABLE `reserva` ADD `ORCTOWEB`    tinyint(1) NOT NULL DEFAULT '0';
ALTER TABLE `reserva` ADD `SINCRONIZA`  int(10) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `reserva` ADD `STATUSPAG`   int(10) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `reserva` ADD `LINKPGTO`    varchar(250) DEFAULT '';
ALTER TABLE `reserva` ADD `IDPGTO`      int(10) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `reserva` ADD `PARCPGTO`    int(10) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `reserva` ADD `PLATAFPGTO`  varchar(30) DEFAULT '';
ALTER TABLE `reserva` ADD `STATUSPGTO`  varchar(20) DEFAULT '';
ALTER TABLE `reserva` ADD `VLBRUTPGTO`  decimal(12,2) NOT NULL DEFAULT '0.00';
ALTER TABLE `reserva` ADD `VLLIQPGTO`   decimal(12,2) NOT NULL DEFAULT '0.00';
ALTER TABLE `reserva` ADD `METODOPGTO`  varchar(20) DEFAULT '';
ALTER TABLE `reserva` ADD `NOMEPGTO`    varchar(20) DEFAULT '';
ALTER TABLE `reserva` ADD `TAXAPGTO`    decimal(5,2) NOT NULL DEFAULT '0.00';
ALTER TABLE `reserva` ADD `IDPREORCTO`  int(10) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `reserva` ADD `CSTATUSPAG`  int(10) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `reserva` ADD `CPARCPGTO`    int(10) unsigned NOT NULL DEFAULT '0';
ALTER TABLE `itens`   ADD `SINCRONIZA`    int(10) unsigned NOT NULL DEFAULT '0';


ALTER TABLE `cliente`  DROP `SINCRONIZA` ;
ALTER TABLE `preorcto` DROP `SINCRONIZA` ;
ALTER TABLE `preorctoi`DROP `SINCRONIZA` ;
ALTER TABLE `produto`  DROP `SINCRONIZA` ;
ALTER TABLE `categ`    DROP `SINCRONIZA` ;
ALTER TABLE `tabpre`   DROP `SINCRONIZA` ;
ALTER TABLE `reserva`   DROP `CPARPGTO` ;
ALTER TABLE `reserva` ADD `CPARCPGTO`    int(10) unsigned NOT NULL DEFAULT '0';


TRUNCATE TABLE `cliente`  ;
TRUNCATE TABLE `preorcto` ;
TRUNCATE TABLE `preorctoi`;
TRUNCATE TABLE `reserva`  ;
TRUNCATE TABLE `itens`    ;
TRUNCATE TABLE `produto`  ;
TRUNCATE TABLE `categ`    ;
TRUNCATE TABLE `tabpre`   ;


SELECT 
	(SELECT COUNT(*) FROM `produto`) + 
    (SELECT COUNT(*) FROM `cliente`) + 
    (SELECT COUNT(*) FROM `categ`) + 
    (SELECT COUNT(tabpre.IID) FROM tabpre INNER JOIN produto ON tabpre.IID = (SELECT MAX(tabpre.IID) FROM tabpre WHERE tabpre.PRODUTO = produto.CODIGO GROUP BY tabpre.PRODUTO)) +
    (SELECT COUNT(*) FROM `preorcto`) +
    (SELECT COUNT(*) FROM `preorctoi`)
AS total ,
	(SELECT COUNT(*) FROM `produto`  WHERE SINCRONIZA = 1) + 
	(SELECT COUNT(*) FROM `cliente`  WHERE SINCRONIZA = 1) + 
    (SELECT COUNT(tabpre.IID) FROM tabpre INNER JOIN produto ON tabpre.IID = (SELECT MAX(tabpre.IID) FROM tabpre WHERE tabpre.PRODUTO = produto.CODIGO AND tabpre.SINCRONIZA = 1 GROUP BY tabpre.PRODUTO)) + 
    (SELECT COUNT(*) FROM `categ`  WHERE SINCRONIZA = 1) +
    (SELECT COUNT(*) FROM `preorcto`  WHERE SINCRONIZA = 1) +
    (SELECT COUNT(*) FROM `preorctoi`  WHERE SINCRONIZA = 1)
AS sincronizado

	SELECT COUNT(*) FROM `produto`  WHERE SINCRONIZA = 1;
	SELECT COUNT(*) FROM `cliente`  WHERE SINCRONIZA = 1;
    SELECT COUNT(tabpre.IID) FROM tabpre INNER JOIN produto ON tabpre.IID = (SELECT MAX(tabpre.IID) FROM tabpre WHERE tabpre.PRODUTO = produto.CODIGO AND tabpre.SINCRONIZA = 1 GROUP BY tabpre.PRODUTO);
    SELECT COUNT(*) FROM `categ`  WHERE SINCRONIZA = 1;
    SELECT COUNT(*) FROM `preorcto`  WHERE SINCRONIZA = 1;
    SELECT COUNT(*) FROM `preorctoi`  WHERE SINCRONIZA = 1;


	SELECT COUNT(*) FROM `produto`  WHERE SINCRONIZA = 0;
	SELECT COUNT(*) FROM `cliente`  WHERE SINCRONIZA = 0;
    SELECT COUNT(tabpre.IID) FROM tabpre INNER JOIN produto ON tabpre.IID = (SELECT MAX(tabpre.IID) FROM tabpre WHERE tabpre.PRODUTO = produto.CODIGO AND tabpre.SINCRONIZA = 0 GROUP BY tabpre.PRODUTO);
    SELECT COUNT(*) FROM `categ`  WHERE SINCRONIZA = 0;
    SELECT COUNT(*) FROM `preorcto`  WHERE SINCRONIZA = 0;
    SELECT COUNT(*) FROM `preorctoi`  WHERE SINCRONIZA = 0;