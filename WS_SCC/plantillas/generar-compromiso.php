<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../entities/plantillas.php';
    include_once '../shared/utilities.php';
    include_once '../config/database.php';
    
	$database = new Database();
	$db = $database->getConnection();
	
    try
    {
        $archivo = new Plantillas($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if ( trim($_POST["prnombrearchivo"])!=null )
        {
            $archivo->nombre_plantilla = trim($_POST["prnombreplantilla"]);
            $archivo->nombre_archivo = trim($_POST["prnombrearchivo"]);
            $archivo->cooperativa = trim($_POST["prcooperativa"]);
            $archivo->nombre = trim($_POST["prnombre"]);
            $archivo->dni = trim($_POST["prdni"]);
            $archivo->cip = trim($_POST["prcip"]);
            $archivo->fecha = trim($_POST["prfecha"]);
            $archivo->banco = trim($_POST["prbanco"]);
            $archivo->cuenta = trim($_POST["prcuenta"]);
            $archivo->contacto = trim($_POST["prcontacto"]);

            if($archivo->generar_compromiso())
            {
                print_json("0000", "Se creó el archivo satisfactoriamente.", $archivo->nombre_archivo);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el archivo.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el archivo.", $exception->getMessage());
    }

?>