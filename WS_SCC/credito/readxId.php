<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    include_once '../config/database.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();
    $credito = new Creditos($db);

    try{

        $credito->id_credito = isset($_GET['prcredito']) ? trim($_GET['prcredito']) : die();

        $credito->readxId();

	    $credito_list = array(
            "id" => $credito->id_credito,
            "id_tipo" => $credito->id_tipo,
            "tipo" => $credito->tipo,
            "id_sucursal" => $credito->id_sucursal,
            "sucursal" => $credito->sucursal,
            "fecha" => $credito->fecha,
            "codigo" => $credito->codigo,
            "numero" => $credito->numero,
            "codigo_credito" => $credito->codigo_credito,
            "id_autorizador" => $credito->id_autorizador,
            "autorizador" => $credito->autorizador,
            "id_vendedor" => $credito->id_vendedor,
            "vendedor" => $credito->vendedor,
            "id_cliente" => $credito->id_cliente,
            "cliente" => $credito->cliente,
            "cliente_dni"=>$credito->cliente_dni,
            "cliente_direccion" => $credito->cliente_direccion,
            "cliente_telefono" => $credito->cliente_telefono,
            "cliente_cargo" => $credito->cliente_cargo,
            "cliente_trabajo" => $credito->cliente_trabajo,
            "id_tipo_pago" => $credito->id_tipo_pago,
            "tipo_pago" => $credito->tipo_pago,
            "fecha_pago" => $credito->fecha_pago,
            "interes_diario" => $credito->interes_diario,
            "interes" => $credito->interes,
            "capital" => $credito->capital,
            "numero_cuotas" => $credito->numero_cuotas,
            "total" => $credito->total,
            "pdf_foto" => $credito->pdf_foto,
            "pdf_dni" => $credito->pdf_dni,
            "pdf_cip" => $credito->pdf_cip,
            "pdf_planilla" => $credito->pdf_planilla,
            "pdf_voucher" => $credito->pdf_voucher,
            "pdf_recibo" => $credito->pdf_recibo,
            "pdf_casilla" => $credito->pdf_casilla,
            "pdf_transaccion" => $credito->pdf_transaccion,
            "pdf_autorizacion" => $credito->pdf_autorizacion,
            "pdf_tarjeta" => $credito->pdf_tarjeta,
            "pdf_compromiso" => $credito->pdf_compromiso,
            "pdf_letra" => $credito->pdf_letra,
            "pdf_ddjj" => $credito->pdf_ddjj,
            "pdf_otros" => $credito->pdf_otros,
            "observaciones" => $credito->observaciones,
            "id_credito_refinanciado" => $credito->id_credito_refinanciado,
            "credito_refinanciado" => $credito->credito_refinanciado,
            "monto_total" => $credito->monto_total,
            "interes_generado" => $credito->interes_generado,
            "monto_pagado" => $credito->monto_pagado,
            "total_cuotas" => $credito->total_cuotas,
            "total_pendiente" => $credito->total_pendiente,
            "total_pagadas" => $credito->total_pagadas,
            "id_estado" => $credito->id_estado,
            "estado" => $credito->estado,
            "courier" => $credito->courier,
            "garantes" => $credito->garante,
            "cronograma" => $credito->cronograma,
	    );

        if ((trim($credito->id_credito)!= ''))
        { 
            print_json("0000", 0, $credito_list);
        }
        else
        { print_json("0001", "No se encuentra el crédito registrado con el id " . $credito->id_credito , null); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>