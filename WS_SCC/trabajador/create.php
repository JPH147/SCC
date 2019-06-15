<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/trabajador.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $trabajador = new Trabajador($db);

        if (($_POST["prnombre"])!=null)
        {
            $trabajador->documento = trim($_POST["prdocumento"]);
            $trabajador->nombre = trim($_POST["prnombre"]);
            $trabajador->cargo = trim($_POST["prcargo"]);
            $trabajador->hora_ingreso = $_POST["prhoraingreso"];
            $trabajador->hora_salida = $_POST["prhorasalida"];

            if($trabajador->create())
            {
                print_json("0000", "Se creó el trabajador satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el trabajador.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el trabajador.", $exception->getMessage());
    }

?>