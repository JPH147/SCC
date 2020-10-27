<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: GET");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include_once '../config/database.php';
	include_once '../entities/venta.php';
	include_once '../shared/utilities.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	$venta = new Venta($db);

	try{
	    $venta->id_venta = isset($_GET['prid']) ? trim($_GET['prid']) : die();
	    
	    $venta->readxId_salida();

	    $venta_list = array(
				"id"=>$venta->id,
				"tipo_venta"=>$venta->tipo_venta,
				"fecha"=>$venta->fecha,
				"id_salida"=>$venta->id_salida,
				"pecosa"=>$venta->pecosa,
				"id_talonario"=>$venta->id_talonario,
				"contrato"=>$venta->contrato,
				"id_cliente"=>$venta->id_cliente,
				"cliente_dni"=>$venta->cliente_dni,
				"cliente_nombre"=>$venta->cliente_nombre,
				"cliente_trabajo"=>$venta->cliente_trabajo,
				"cliente_cargo_nombre"=>$venta->cliente_cargo_nombre,
				"cliente_direccion_nombre"=>$venta->cliente_direccion_nombre,
				"cliente_telefono_numero"=>$venta->cliente_telefono_numero,
				"idtipopago"=>$venta->idtipopago,
				"tipo_pago"=>$venta->tipo_pago,
				"monto_inicial"=>$venta->monto_inicial,
				"numero_cuotas"=>$venta->numero_cuotas,
				"monto_total"=>$venta->monto_total,
				"fecha_inicio_pago"=>$venta->fecha_inicio_pago,
				"foto"=>$venta->foto,
				"contrato_pdf"=>$venta->contrato_pdf,
				"dni_pdf"=>$venta->dni_pdf,
				"cip_pdf"=>$venta->cip_pdf,
				"planilla_pdf"=>$venta->planilla_pdf,
				"letra_pdf"=>$venta->letra_pdf,
				"voucher_pdf"=>$venta->voucher_pdf,
				"autorizacion_pdf"=>$venta->autorizacion_pdf,
				"oficio_pdf"=>$venta->oficio_pdf,
				"otros_pdf"=>$venta->otros_pdf,
				"observacion"=>$venta->observacion,
				"lugar_venta"=>$venta->lugar_venta,
				"estado"=>$venta->estado,
				"id_venta_canje"=>$venta->id_venta_canje,
				"canje_talonario_serie"=>$venta->canje_talonario_serie,
				"canje_talonario_contrato"=>$venta->canje_talonario_contrato,
				"anulacion_observacion"=>$venta->anulacion_observacion,
				"anulacion_monto"=>$venta->anulacion_monto,
				"monto_total"=>$venta->monto_total,
				"interes_generado"=>$venta->interes_generado,
				"monto_pagado"=>$venta->monto_pagado,
				"monto_pendiente"=>$venta->monto_pendiente,
				"monto_pendiente_hasta_hoy"=>$venta->monto_pendiente_hasta_hoy,
				"total_cuotas"=>$venta->total_cuotas,
				"total_pendiente"=>$venta->total_pendiente,
				"total_pagadas"=>$venta->total_pagadas,
				"observacion"=>$venta->observacion,
				"cumple_penalidad"=>$venta->cumple_penalidad,
				"cuotas_penalidad" => $venta->cuotas_penalidad ,
				"cuotas_interes" => $venta->cuotas_interes ,
				"monto_limite_penalidad" => $venta->monto_limite_penalidad ,
				"monto_penalidad" => $venta->monto_penalidad ,
				"adicional_penalidad" => $venta->adicional_penalidad ,
				"estado_penalidad" => $venta->estado_penalidad ,
				"estado_interes" => $venta->estado_interes ,
				"pagado_interes" => $venta->pagado_interes ,
				"id_liquidacion" => $venta->id_liquidacion ,
				"pagado" => $venta->pagado ,
				"courier"=>$venta->courier,
				"productos"=>$venta->productos,
				"garantes"=>$venta->garantes,
	    );

	    if(trim($venta->id)!= ''){
	        print_json("0000", "OK", $venta_list);
	    }
	    else{
	        print_json("0001", "No se encuentra la venta registrada con el id " . $venta->id_venta , null);

	    }

	}
	catch(Exception $exception){
	    print_json("9999", "Ocurrió un error.", $exception->getMessage());
	}
?>