<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/plantillas.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $plantilla = new Plantillas($db);

        if (($_POST["prtipoplantilla"])!=null)
        {
            $plantilla->tipo_plantilla=trim($_POST["prtipoplantilla"]);
            $plantilla->fecha=trim($_POST["fecha"]);
            $plantilla->usuario=trim($_POST["prusuario"]);
            $plantilla->comentarios=trim($_POST["prcomentarios"]);
            $plantilla->archivos=trim($_POST["prarchivos"]);
            
            if($plantilla->crear_plantilla())
            {
                print_json("0000", "Se creó la plantilla satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la plantilla.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>