<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/x-www-form-urlencoded; charset=UTF-8");
    header("Content-Type:multipart/form-data");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/proveedor.php';
    include_once '../shared/utilities.php';
    //include_once '../file/upload.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $proveedor = new Proveedor($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if  (($_POST["prv_idtipodocumento"])!=null
            && !empty(trim($_POST["prv_documento"])) 
            && !empty(trim($_POST["prv_nombre"])) 
            && !empty(trim($_POST["prv_representante_legal"]))
            && !empty(trim($_POST["prv_observacion"]))) 
           
        {

            $proveedor->tipo_documento = trim($_POST["prv_idtipodocumento"]);
            $proveedor->prv_documento = trim($_POST["prv_documento"]);
            $proveedor->prv_nombre = trim($_POST["prv_nombre"]);
            $proveedor->prv_representante_legal = trim($_POST["prv_representante_legal"]);
            $proveedor->prv_observacion = trim($_POST["prv_observacion"]);
           
            
         

            if($proveedor->create())
            {
                print_json("0000", "Se creó el proveedor satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el proveedor.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el proveedor.", $exception->getMessage());
    }

?>