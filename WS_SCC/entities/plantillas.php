<?php

include_once '../vendor/phpoffice/phpword/bootstrap.php';

Class Plantillas{

    public $nombre_plantilla;

    public $nombre_archivo;
    public $nombre;
    public $cargo;
    public $cargo_estado;
    public $dni;
    public $cip;
    public $codigo;
    public $ugel_nombre;
    public $direccion;
    public $tipo_telefono;
    public $telefono;
    public $casilla;
    public $whatsapp;
    public $email;
    public $monto_asociado;
    public $es_prestamo;
    public $es_venta;
    public $monto_cuota;
    public $numero_cuotas;
    public $numero_cuotas_letras;
    public $fecha;
    public $monto_total;
    public $monto_total_letras;
    public $fecha_dia;
    public $fecha_dia_letras;
    public $banco_nombre;
    public $cuenta_numero;
    public $monto_penalidad;
    public $monto_penalidad_letras;
    public $numero_cuotas_penalidad;
    public $numero_cuotas_penalidad_letras;
    public $monto_cuota_penalidad;
    public $monto_cuota_penalidad_letras;
    public $vendedor;
    public $vendedor_dni;


    function generar_autorizacion(){

        switch ($this->tipo) {
            case 1:
                $tipo_autorizacion = "APORTE DE SOCIO (S/." . $this->monto_asociado . ")";
                break;
            case 2:
                $tipo_autorizacion = "CUOTAS DE PAGO DEL PRÉSTAMO";
                break;
            case 3:
                $tipo_autorizacion = "CUOTAS DE PAGO DEL EQUIPO CELULAR";
                break;
        }

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

        $templateProcessor->setValue('tipo_motivo', $tipo_autorizacion);
        $templateProcessor->setValue('nombre', $this->nombre);
        $templateProcessor->setValue('cargo_estado', $this->cargo_estado);
        $templateProcessor->setValue('dni', $this->dni);
        $templateProcessor->setValue('cip', $this->cip);
        $templateProcessor->setValue('codigo', $this->codigo);
        $templateProcessor->setValue('ugel_nombre', $this->ugel_nombre);
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('tipo_telefono', $this->tipo_telefono);
        $templateProcessor->setValue('telefono', $this->telefono);
        $templateProcessor->setValue('email', $this->email);
        $templateProcessor->setValue('monto_cuota', $this->monto_asociado);
        $templateProcessor->setValue('monto_cuota', $this->monto_cuota);
        $templateProcessor->setValue('numero_cuotas', $this->numero_cuotas);
        $templateProcessor->setValue('lugar', $this->lugar);
        $templateProcessor->setValue('fecha', $this->fecha_letras);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

    function generar_ddjj(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/'.$this->nombre_plantilla);

        $templateProcessor->setValue('nombre', $this->nombre);
        $templateProcessor->setValue('dni', $this->dni);
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('lugar', $this->lugar);
        $templateProcessor->setValue('fecha', $this->fecha);
        $templateProcessor->setValue('fecha_letras', $this->fecha_letras);

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

    function generar_transaccion(){

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('../plantillas/archivos/transaccion_1.docx');

        $templateProcessor->setValue('nombre', $this->nombre);
        $templateProcessor->setValue('cargo', $this->cargo);
        $templateProcessor->setValue('dni', $this->dni);
        $templateProcessor->setValue('direccion', $this->direccion);
        $templateProcessor->setValue('casilla', $this->casilla);
        $templateProcessor->setValue('fecha_letras', $this->fecha_letras);
        $templateProcessor->setValue('monto_total', $this->monto_total);
        $templateProcessor->setValue('monto_total_letras', $this->monto_total_letras);
        $templateProcessor->setValue('numero_cuotas', $this->numero_cuotas);
        $templateProcessor->setValue('numero_cuotas_letras', $this->numero_cuotas_letras);
        $templateProcessor->setValue('fecha_dia', $this->fecha_dia);
        $templateProcessor->setValue('fecha_dia_letras', $this->fecha_dia_letras);
        $templateProcessor->setValue('banco_nombre', $this->banco_nombre);
        $templateProcessor->setValue('cuenta_numero', $this->cuenta_numero);
        $templateProcessor->setValue('monto_penalidad', $this->monto_penalidad);
        $templateProcessor->setValue('monto_penalidad_letras', $this->monto_penalidad_letras);
        $templateProcessor->setValue('numero_cuotas_penalidad', $this->numero_cuotas_penalidad);
        $templateProcessor->setValue('numero_cuotas_penalidad_letras', $this->numero_cuotas_penalidad_letras);
        $templateProcessor->setValue('monto_cuota_penalidad', $this->monto_cuota_penalidad);
        $templateProcessor->setValue('monto_cuota_penalidad_letras', $this->monto_cuota_penalidad_letras);
        $templateProcessor->setValue('casilla', $this->casilla);
        $templateProcessor->setValue('email', $this->email);
        $templateProcessor->setValue('whatsapp', $this->whatsapp);
        $templateProcessor->setValue('vendedor', $this->vendedor);
        $templateProcessor->setValue('vendedor_dni', $this->vendedor_dni);

        $this->nombre_archivo = date_timestamp_get(new DateTime());

        $templateProcessor->saveAs('../uploads/autogenerados/' . $this->nombre_archivo . '.docx');

        return file_exists ( '../uploads/autogenerados/' . $this->nombre_archivo . '.docx' );
        
    }

}

?>