<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/x-www-form-urlencoded; charset=UTF-8");
    header("Content-Type:multipart/form-data");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';
    //include_once '../file/upload.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $cliente = new Cliente($db);

        if ( !empty(trim($_POST["clt_dni"])))
        {
            $cliente->id_sub_sede = trim($_POST["prsubsede"]);
            $cliente->id_cargo = trim($_POST["prcargo"]);
            $cliente->id_cargo_estado = trim($_POST["prcargoestado"]);
            $cliente->clt_codigo = trim($_POST["clt_codigo"]);
            $cliente->clt_dni = trim($_POST["clt_dni"]);
            $cliente->clt_nombre = trim($_POST["clt_nombre"]);
            $cliente->clt_foto = "Unknown.png";
            $cliente->clt_cip = !empty($_POST['clt_cip']) ? trim($_POST['clt_cip']) : "0" ;
            $cliente->clt_email = trim($_POST["clt_email"]);
            $cliente->clt_casilla = trim($_POST["clt_casilla"]);
            $cliente->id_distrito = trim($_POST["prdistrito"]);
            $cliente->clt_trabajo = trim($_POST["clt_trabajo"]);
            $cliente->capacidad_pago = trim($_POST["prapacidadpago"]);
            $cliente->clt_maximo_descuento = trim($_POST["prmaximodescuento"]);
            $cliente->clt_calificacion_personal = trim($_POST["clt_calificacion_personal"]);
            $cliente->clt_aporte = trim($_POST["clt_aporte"]);
            $cliente->clt_fecharegistro = trim($_POST["clt_fecharegistro"]);
            $cliente->clt_estado = trim($_POST["prestado"]);

            if($cliente->create())
            {
                print_json("0000", "Se creó el cliente satisfactoriamente.", $cliente->id);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el cliente.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al crear el cliente.", $exception->getMessage());
    }

?>