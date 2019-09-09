<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/institucion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    $institucion = new Institucion($db);

    try{
        if ( ($_POST["prid"])!=null )
        {
            $institucion->id_institucion=trim($_POST["prid"]);

            if($institucion->delete())
            {
                print_json("0000", "Se eliminó la institución satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar la institución.", "");
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