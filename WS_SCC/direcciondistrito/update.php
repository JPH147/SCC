<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/direccionprovincia.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $provincia = new provincia($db);
        $data = json_decode(file_get_contents('php://input'),true);

        if(($_POST["prid"])!=null)
        {
            $provincia->id_provincia = $_POST["prid"];
            $provincia->id_departamento = trim($_POST["prdepartamento"]);
            $provincia->dpt_nombre = trim($_POST["prnombre"]);


            if($provincia->update())
            {
                    print_json("0000", "Se actualizó la provincia satisfactoriamente.", "");
            }
            else
            {
                    print_json("9999", "Ocurrió un error al actualizar la provincia.", "");
            }
        }
        else
        {
                print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la provincia.", $exception->getMessage());
    }

?>