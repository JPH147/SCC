<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/producto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $producto = new Producto($db);

        $producto->tprd_nombre = !empty($_GET['prtipo']) ? $_GET['prtipo'] : null;
        $producto->mrc_nombre = !empty($_GET['prmarca']) ? $_GET['prmarca'] : null;
        $producto->mdl_nombre = !empty($_GET['prmodelo']) ? $_GET['prmodelo'] : null;
        $producto->prd_descripcion = !empty($_GET['prdescripcion']) ? $_GET['prdescripcion'] : null;
        $producto->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : null;
        $producto->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : null;

        $producto_list = $producto->read();
        $producto_contar = $producto->contar();

        if (count(array_filter($producto_list))>0)
        { 
            /*************************************************************/

            function cmd($a, $b){
            $columna =!empty($_GET['columna']) ? $_GET['columna'] -1: null;
            $tipo=!empty($_GET['tipo']) ? $_GET['tipo'] : null;
            $producto_vector= array("numero","id","tipo","marca","modelo","descripcion","unidad_medida","precio");

                if(gettype($a[$producto_vector[$columna]])=="string"){
                    return $tipo*(strcmp($a[$producto_vector[$columna]], $b[$producto_vector[$columna]]));                    
                }else{
                    return $tipo*(intval($a[$producto_vector[$columna]] - intval($b[$producto_vector[$columna]])));                     
                }
            }

            usort($producto_list["productos"], "cmd");
            /*************************************************************/

            print_json("0000", $producto_contar, $producto_list);
        }
        else
        { print_json("0001", 0, $producto_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>