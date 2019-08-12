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
            $presupuesto->id_presupuesto = trim($_POST["prpresupuesto"]);
            $presupuesto->id_cliente = trim($_POST["prcliente"]);
            $presupuesto->pdf_autorizacion = trim($_POST["prpdfautorizacion"]);
            $presupuesto->pdf_ddjj = trim($_POST["prpdfddjj"]);
            $presupuesto->pdf_carta = trim($_POST["prpdfcarta"]);
            $presupuesto->pdf_compromiso = trim($_POST["prpdfcompromiso"]);

            if($presupuesto->create_garante())
            {
                print_json("0000", "Se creó el garante satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el garante.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el garante.", $exception->getMessage());
    }

?>