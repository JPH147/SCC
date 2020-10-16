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
            $archivo->nombre = trim($_POST["prnombre"]);
            $archivo->dni = trim($_POST["prdni"]);
            $archivo->cip = trim($_POST["prcip"]);
            $archivo->codigo = trim($_POST["prcodigo"]);
            $archivo->cargo_estado = trim($_POST["prcargoestado"]);
            $archivo->direccion = trim($_POST["prdireccion"]);
            $archivo->distrito = trim($_POST["prdistrito"]);
            $archivo->provincia = trim($_POST["prprovincia"]);
            $archivo->departamento = trim($_POST["prdepartamento"]);
            $archivo->celular = trim($_POST["prcelular"]);
            $archivo->banco = trim($_POST["prbanco"]);
            $archivo->cuenta = trim($_POST["prcuentanumero"]);
            $archivo->fecha = trim($_POST["prfecha"]);
            $archivo->parametro_autorizacion_1 = trim($_POST["prparametroautorizacion1"]);
            $archivo->parametro_autorizacion_2 = trim($_POST["prparametroautorizacion2"]);

            $archivo->total_prestamo = trim($_POST["prtotalprestamo"]);
            $archivo->numero_cuotas = trim($_POST["prnumerocuotas"]);
            $archivo->cuota_mensual = trim($_POST["prcuotamensual"]);
            $archivo->fecha_afiliacion = trim($_POST["prfechaafiliacion"]);

            if($archivo->generar_tarjeta_socio())
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