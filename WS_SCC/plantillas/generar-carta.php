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
            $archivo->nombre_archivo = trim($_POST["prnombrearchivo"]);
            $archivo->nombre_aval = trim($_POST["prnombreaval"]);
            $archivo->dni_aval = trim($_POST["prdniaval"]);
            $archivo->direccion_aval = trim($_POST["prdireccionaval"]);
            $archivo->nombre = trim($_POST["prnombre"]);
            $archivo->dni = trim($_POST["prdni"]);
            $archivo->lugar = trim($_POST["prlugar"]);
            $archivo->fecha_letras = trim($_POST["prfechaletras"]);

            if($archivo->generar_carta())
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