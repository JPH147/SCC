<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../entities/plantillas.php';
    include_once '../shared/utilities.php';

    try
    {
        $archivo = new Plantillas();
        $data = json_decode(file_get_contents('php://input'), true);

        if ( trim($_POST["prnombre"])!=null )
        {
            $archivo->nombre_plantilla = trim($_POST["prnombreplantilla"]);
            $archivo->nombre_archivo = trim($_POST["prnombrearchivo"]);
            $archivo->tipo = trim($_POST["prtipo"]);
            $archivo->nombre = trim($_POST["prnombre"]);
            $archivo->cargo_estado = trim($_POST["prcargoestado"]);
            $archivo->dni = trim($_POST["prdni"]);
            $archivo->cip = trim($_POST["prcip"]);
            $archivo->codigo = trim($_POST["prcodigo"]);
            $archivo->direccion = trim($_POST["prdireccion"]);
            $archivo->tipo_telefono = trim($_POST["prtipotelefono"]);
            $archivo->telefono = trim($_POST["prtelefono"]);
            $archivo->email = trim($_POST["premail"]);
            $archivo->ugel_nombre = trim($_POST["prugel"]);
            $archivo->monto_asociado = trim($_POST["prmontoasociado"]);
            $archivo->monto_cuota = trim($_POST["prmontocuota"]);
            $archivo->numero_cuotas = trim($_POST["prnumerocuotas"]);
            $archivo->lugar = trim($_POST["prlugar"]);
            $archivo->fecha_letras = trim($_POST["prfechaletras"]);

            if($archivo->generar_autorizacion())
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
        print_json("9999", "Ocurrió un error al eliminar el archivo.", $exception->getMessage());
    }

?>