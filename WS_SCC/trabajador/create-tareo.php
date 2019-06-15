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

        if (($_POST["prtrabajador"])!=null)
        {
            $trabajador->id_trabajador = trim($_POST["prtrabajador"]);
            $trabajador->fecha = trim($_POST["prfecha"]);
            $trabajador->hora_ingreso = trim($_POST["prhoraingreso"]);
            $trabajador->ingreso = trim($_POST["pringreso"]);
            $trabajador->hora_salida = $_POST["prhorasalida"];
            $trabajador->salida = $_POST["prsalida"];

            if($trabajador->create_tareo())
            {
                print_json("0000", "Se creó el tareo satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el tareo.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el tareo.", $exception->getMessage());
    }

?>