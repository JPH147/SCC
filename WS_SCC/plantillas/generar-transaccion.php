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
            $archivo->cooperativa_direccion = trim($_POST["prcooperativadireccion"]);
            $archivo->cooperativa_direccion_1 = trim($_POST["prcooperativadireccion1"]);
            $archivo->cooperativa_direccion_2 = trim($_POST["prcooperativadireccion2"]);
            $archivo->cooperativa_direccion_3 = trim($_POST["prcooperativadireccion3"]);
            $archivo->cooperativa_direccion_4 = trim($_POST["prcooperativadireccion4"]);
            $archivo->cooperativa_cuenta_banco = trim($_POST["prcooperativacuentabanco"]);
            $archivo->cooperativa_cuenta_numero = trim($_POST["prcooperativacuentanumero"]);
            $archivo->presidente = trim($_POST["prpresidente"]);
            $archivo->presidente_dni = trim($_POST["prpresidentedni"]);
            $archivo->presidente_direccion = trim($_POST["prpresidentedireccion"]);
            $archivo->parametro_condicion = trim($_POST["prparametrocondicion"]);
            $archivo->parametro_domicilio_laboral = trim($_POST["prparametrodomiciliolaboral"]);
            $archivo->parametro_autorizacion_1 = trim($_POST["prparametroautorizacion1"]);
            $archivo->parametro_autorizacion_2 = trim($_POST["prparametroautorizacion2"]);

            $archivo->nombre = trim($_POST["prnombre"]);
            $archivo->cargo = trim($_POST["prcargo"]);
            $archivo->dni = trim($_POST["prdni"]);
            $archivo->cip = trim($_POST["prcip"]);
            $archivo->direccion_cliente = trim($_POST["prdireccioncliente"]);
            $archivo->direccion = trim($_POST["prdireccion"]);
            $archivo->casilla = trim($_POST["prcasilla"]);
            $archivo->fecha_anterior = trim($_POST["prfechaanterior"]);
            $archivo->fecha_letras = trim($_POST["prfechaletras"]);
            $archivo->ugel_nombre = trim($_POST["prugel"]);
            $archivo->monto_total = trim($_POST["prmontototal"]);
            $archivo->monto_total_letras = trim($_POST["prmontototalletras"]);
            $archivo->monto_cuota = trim($_POST["prmontocuota"]);
            $archivo->monto_cuota_letras = trim($_POST["prmontocuotaletras"]);
            $archivo->numero_cuotas = trim($_POST["prnumerocuotas"]);
            $archivo->numero_cuotas_letras = trim($_POST["prnumerocuotasletras"]);
            $archivo->fecha_dia = trim($_POST["prfechadia"]);
            $archivo->fecha_dia_letras = trim($_POST["prfechadialetras"]);
            $archivo->banconombre = trim($_POST["prbanconombre"]);
            $archivo->cuentanumero = trim($_POST["prcuentanumero"]);
            $archivo->monto_penalidad = trim($_POST["prmontopenalidad"]);
            $archivo->monto_penalidad_letras = trim($_POST["prmontopenalidadletras"]);
            $archivo->numero_cuotas_penalidad = trim($_POST["prnumerocuotaspenalidad"]);
            $archivo->numero_cuotas_penalidad_letras = trim($_POST["prnumerocuotaspenalidadletras"]);
            $archivo->monto_cuota_penalidad = trim($_POST["prmontocuotapenalidad"]);
            $archivo->monto_cuota_penalidad_letras = trim($_POST["prmontocuotapenalidadletras"]);
            $archivo->email = trim($_POST["premail"]);
            $archivo->whatsapp = trim($_POST["prwhatsapp"]);
            $archivo->lugar = trim($_POST["prlugar"]);
            $archivo->vendedor = trim($_POST["prvendedor"]);
            $archivo->vendedor_dni = trim($_POST["prvendedordni"]);
            $archivo->detalle = trim($_POST["prdetalle"]);
            $archivo->tipo = trim($_POST["prtipo"]);
            $archivo->productos = trim($_POST["prproductos"]);

            $archivo->nombre_aval = trim($_POST["prnombreaval"]);
            $archivo->dni_aval = trim($_POST["prdniaval"]);

            if($archivo->generar_transaccion())
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