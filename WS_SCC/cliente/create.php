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
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["id_subsede"])!=null  && !empty(trim($_POST["clt_codigo"])) && !empty(trim($_POST["clt_dni"]))
            && !empty(trim($_POST["clt_nombre"]))
            && !empty(trim($_POST["clt_cip"])) && !empty(trim($_POST["clt_email"])) && !empty(trim($_POST["clt_casilla"]))
            && !empty(trim($_POST["clt_trabajo"])) && !empty(trim($_POST["clt_cargo"])) && !empty(trim($_POST["clt_calificacion_crediticia"]))
            && !empty(trim($_POST["clt_calificacion_personal"])) && ($_POST["clt_aporte"])!=null && ($_POST["clt_estado"])!=null
            && ($_POST["clt_fecharegistro"])!=null)
        {

            $cliente->id_subsede = trim($_POST["id_subsede"]);
            $cliente->clt_codigo = trim($_POST["clt_codigo"]);
            $cliente->clt_dni = trim($_POST["clt_dni"]);
            $cliente->clt_nombre = trim($_POST["clt_nombre"]);
            $cliente->clt_foto = "FOTO_".$cliente->clt_dni;
            $cliente->clt_cip = trim($_POST["clt_cip"]);
            $cliente->clt_email = trim($_POST["clt_email"]);
            $cliente->clt_casilla = trim($_POST["clt_casilla"]);
            $cliente->clt_trabajo = trim($_POST["clt_trabajo"]);
            $cliente->clt_cargo = trim($_POST["clt_cargo"]);
            $cliente->clt_calificacion_crediticia = trim($_POST["clt_calificacion_crediticia"]);
            $cliente->clt_calificacion_personal = trim($_POST["clt_calificacion_personal"]);
            $cliente->clt_aporte = trim($_POST["clt_aporte"]);
            $cliente->clt_estado = trim($_POST["clt_estado"]);
            $cliente->clt_fecharegistro = $_POST["clt_fecharegistro"];

            if($cliente->create())
            {
                print_json("0000", "Se creó el cliente satisfactoriamente.", "");
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