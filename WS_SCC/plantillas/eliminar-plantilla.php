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

        if (($_POST["prplantilla"])!=null)
        {
            $plantilla->id_plantilla=trim($_POST["prplantilla"]);
            
            if($plantilla->eliminar_plantilla())
            {
                print_json("0000", "Se eliminó la plantilla satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar la plantilla.", "");
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