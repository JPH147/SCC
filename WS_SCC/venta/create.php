<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/venta.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $venta = new Venta($db);
        $data = json_decode(file_get_contents('php://input'), true);

        
        if (!empty(trim($_POST["pvnt_serie"]))
         && !empty(trim($_POST["pvnt_numerodocumento"]))
         && ($_POST["pid_cliente"])!=null && ($_POST["pvnt_fecha"])!=null
         && ($_POST["pid_vendedor"])!=null && ($_POST["pvnt_fecha_inicio"])!=null
         && ($_POST["pvnt_inicial"])!=null && ($_POST["pvnt_numero_cuota"])!=null
         && ($_POST["pvnt_cuotas"])!=null && ($_POST["pid_tipopago"])!=null
         && ($_POST["pvnt_total"])!=null && ($_POST["pvnt_tipoventa"])!=null
         && !empty(trim($_POST["pvnt_observaciones"]))
         && ($_POST["pid_tipoventa_referencia"])!=null)
        {
            $venta->id_talonario = trim($_POST["pid_talonario"]);
            $venta->id_cliente = $_POST["pid_cliente"];
            $venta->vnt_fecha = $_POST["pvnt_fecha"];
            $venta->id_vendedor = $_POST["pid_vendedor"];
            $venta->vnt_contrato_pdf = "-";
            $venta->vnt_dni_pdf = "-";
            $venta->vnt_cip_pdf = "-";
            $venta->vnt_planilla_pdf = "-";
            $venta->vnt_letra_pdf = "-";
            $venta->vnt_voucher_pdf = "-";
            $venta->vnt_autorizacion_pdf = "-";
            $venta->vnt_fecha_inicio = $_POST["pvnt_fecha_inicio"];
            $venta->vnt_inicial = $_POST["pvnt_inicial"];
            $venta->vnt_numero_couta = $_POST["pvnt_numero_cuota"];
            $venta->vnt_cuotas = $_POST["pvnt_cuotas"];
            $venta->id_tipopago = $_POST["pid_tipopago"];
            $venta->vnt_total = $_POST["pvnt_total"];
            $venta->vnt_tipoventa = $_POST["pvnt_tipoventa"];
            $ventas->vnt_observaciones = trim($_POST["pvnt_observaciones"]);
            $venta->vnt_estado = 1;

            //print_r($venta);

            if($venta->create())
            {
                print_json("0000", "Se creó la venta satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la venta.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la venta.", $exception->getMessage());
    }

?>