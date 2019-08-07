<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/courier.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $courier = new Courier($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prnombre"])!=null)
        {

            $courier->nombre=trim($_POST["prnombre"]);
            $courier->url=trim($_POST["prurl"]);

            if($courier->create())
            {
                print_json("0000", "Se creó el courier satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el courier.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el courier.", $exception->getMessage());
    }

?>