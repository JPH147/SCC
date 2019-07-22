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

        if ( trim($_POST["prnombre"])!=null )
        {
            $archivo->nombre_plantilla = trim($_POST["prnombreplantilla"]);
            $archivo->nombre_archivo = trim($_POST["prnombrearchivo"]);
            $archivo->nombre = trim($_POST["prnombre"]);
            $archivo->dni = trim($_POST["prdni"]);
            $archivo->cip = trim($_POST["prcip"]);
            $archivo->codigo = trim($_POST["prcodigo"]);
            $archivo->cargo_estado = trim($_POST["prcargoestado"]);
            $archivo->direccion = trim($_POST["prdireccion"]);
            $archivo->provincia = trim($_POST["prprovincia"]);
            $archivo->trabajo = trim($_POST["prtrabajo"]);
            $archivo->cuenta_numero = trim($_POST["prcuentanumero"]);
            $archivo->lugar = trim($_POST["prlugar"]);
            $archivo->celular = trim($_POST["prcelular"]);
            $archivo->monto_afiliacion = trim($_POST["prmontoafiliacion"]);

            if($archivo->generar_tarjeta())
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