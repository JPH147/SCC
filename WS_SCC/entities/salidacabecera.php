<?php



Class SalidaCabecera{

    private $conn;
    private $detalle;

    public $id_salida;
    public $pecosa;
    public $id_sucursal;
    public $sucursal;

    public $destino;
    public $id_tipo_movilidad;
    public $estado;

    public $numero_pagina;
    public $total_pagina;
    public $orden;

    public $fecha;
    public $guia;
    public $tipo_movilidad;
    public $observacion;

    public $cabecera;
    public $vehiculo;
    public $chofer_dni;
    public $chofer_nombre;
    public $serie;
    public $precio;
    public $cantidad;
    public $vendedor;
    public $comisiones;

    public $fecha_inicio;
    public $fecha_fin;

    public function __construct($db){
        $this->conn = $db;
        include_once 'salidadetalle.php';
        $this->detalle = new SalidaDetalle($db);
    }


    function read(){

        $query = "CALL sp_listarsalidacabecera(?,?,?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->pecosa);
        $result->bindParam(2, $this->id_sucursal);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->destino);
        $result->bindParam(6, $this->serie);
        $result->bindParam(7, $this->vendedor);
        $result->bindParam(8, $this->estado);
        $result->bindParam(9, $this->numero_pagina);
        $result->bindParam(10, $this->total_pagina);
        $result->bindParam(11, $this->orden);

        $result->execute();
        
        $SCabecera_list=array();
        $SCabecera_list["salidas"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            // $SGasto=$this->detalle->read_gasto($id);
            // $SMovilidad=$this->detalle->read_movilidad($id);
            // $SVendedor=$this->detalle->read_vendedor($id);
            // $SProducto=$this->detalle->read_producto($id);
            $salida_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "pecosa"=>$pecosa,                
                "sucursal"=>$sucursal,
                "fecha"=>$fecha,
                "destino"=>$destino,
                "vehiculo_placa"=>$vehiculo_placa,
                "chofer_dni"=>$chofer_dni,
                "chofer_nombre"=>$chofer_nombre,
                "estado"=>$estado
            );
            array_push($SCabecera_list["salidas"],$salida_item);
        }

        return $SCabecera_list;
    }

    function contar(){

        $query = "CALL sp_listarsalidacabeceracontar(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->pecosa);
        $result->bindParam(2, $this->id_sucursal);
        $result->bindParam(3, $this->fecha_inicio);
        $result->bindParam(4, $this->fecha_fin);
        $result->bindParam(5, $this->destino);
        $result->bindParam(6, $this->estado);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function create(){

        $query = "call sp_crearsalidavendedor(
            :prcodigo,
            :prsucursal,
            :prfecha,
            :prdestino,
            :prguia,
            :prvehiculo,
            :prchoferdni,
            :prchofernombre,
            :probservacion
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcodigo", $this->pecosa);
        $result->bindParam(":prsucursal", $this->id_sucursal);
        $result->bindParam(":prfecha", $this->fecha);
        $result->bindParam(":prdestino", $this->destino);
        $result->bindParam(":prguia", $this->guia);
        $result->bindParam(":probservacion", $this->observacion);
        $result->bindParam(":prvehiculo", $this->vehiculo);
        $result->bindParam(":prchoferdni", $this->chofer_dni);
        $result->bindParam(":prchofernombre", $this->chofer_nombre);

        $this->pecosa=htmlspecialchars(strip_tags($this->pecosa));
        $this->id_sucursal=htmlspecialchars(strip_tags($this->id_sucursal));
        $this->fecha=htmlspecialchars(strip_tags($this->fecha));
        $this->destino=htmlspecialchars(strip_tags($this->destino));
        $this->vehiculo=htmlspecialchars(strip_tags($this->vehiculo));
        $this->chofer_dni=htmlspecialchars(strip_tags($this->chofer_dni));
        $this->chofer_nombre=htmlspecialchars(strip_tags($this->chofer_nombre));

        if(!empty($this->guia)){
           $this->guia=htmlspecialchars(strip_tags($this->guia)); 
        };

        if(!empty($this->observacion)){
           $this->observacion=htmlspecialchars(strip_tags($this->observacion)); 
        };

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id=$prid;
            }
            return true;
        }
        
        return false;
    }

    function create_producto(){

        $query = "call sp_crearsalidavendedorproducto(
            :pridcabecera,
            :prserie,
            :prprecio,
            :prcantidad
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pridcabecera", $this->cabecera);
        $result->bindParam(":prserie", $this->serie);
        $result->bindParam(":prprecio", $this->precio);
        $result->bindParam(":prcantidad", $this->cantidad);

        $this->cabecera=htmlspecialchars(strip_tags($this->cabecera));
        $this->serie=htmlspecialchars(strip_tags($this->serie));
        $this->precio=htmlspecialchars(strip_tags($this->precio));
        $this->cantidad=htmlspecialchars(strip_tags($this->cantidad));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function create_vendedor(){

        $query = "call sp_crearsalidavendedorvendedor(
            :pridcabecera,
            :prvendedor,
            :prcomision
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pridcabecera", $this->cabecera);
        $result->bindParam(":prvendedor", $this->vendedor);
        $result->bindParam(":prcomision", $this->comision);

        $this->cabecera=htmlspecialchars(strip_tags($this->cabecera));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->comision=htmlspecialchars(strip_tags($this->comision));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

}
?>