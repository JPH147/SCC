<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/presupuesto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $presupuesto = new Presupuesto($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prpresupuesto"])!=null)
        {
            $presupuesto->presupuesto = trim($_POST["prpresupuesto"]);
            $presupuesto->monto = trim($_POST["prmonto"]);
            $presupuesto->aporte = trim($_POST["praporte"]);
            $presupuesto->fecha = trim($_POST["prfecha"]);

            if($presupuesto->create_cronograma())
            {
                print_json("0000", "Se creó el presupuesto satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el presupuesto.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el presupuesto.", $exception->getMessage());
    }

?>