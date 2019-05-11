<?php
Class Vendedor{

    private $conn;
    private $table_name = "vendedor";

    public $idvendedor;
    public $id_sucursal;
    public $scs_nombre;
    public $vnd_dni;
    public $vnd_nombre;
    public $vnd_email;
    public $vnd_comision;
    public $vnd_estado;

    public $fecha;
    public $comision_efectiva;
    public $comision_retenida;
    public $comision_efectiva_porcentaje;
    public $comision_retenida_porcentaje;
    public $comision_efectiva_estado;
    public $comision_retenida_estado;

    public $comisiones_efectivas_estado;
    public $comisiones_retenidas_estado;
    public $fecha_inicio;
    public $fecha_fin;
    public $talonario;
    public $contrato;
    public $numero_pagina;
    public $total_pagina;

    public $venta;
    public $salida;
    public $vendedor;
    public $monto;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){

        $query = "CALL sp_listarvendedor(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->vnd_dni);
        $result->bindParam(2, $this->vnd_nombre);
        $result->bindParam(3, $this->scs_nombre);
        $result->bindParam(4, $this->numero_pagina);
        $result->bindParam(5, $this->total_pagina);

        $result->execute();
    
        $vendedor_list=array();
        $vendedor_list["vendedores"]=array();

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $vendedor_item = array (
                "id"=>$row['idvendedor'],
                "sucnombre"=>$row['scs_nombre'],
                "dni"=>$row['vnd_dni'],
                "nombre"=>$row['vnd_nombre'],
                "email"=>$row['vnd_email'],
                "comision"=>$row['vnd_comision']
            );

            array_push($vendedor_list["vendedores"],$vendedor_item);
        }
        return $vendedor_list;
    }

    function contar(){

        $query = "CALL sp_listarvendedorcontar(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->vnd_dni);
        $result->bindParam(2, $this->vnd_nombre);
        $result->bindParam(3, $this->scs_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function read_comisiones(){

        $query = "CALL sp_listarcomisiones(?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->comisiones_efectivas_estado);
        $result->bindParam(2, $this->comisiones_retenidas_estado);
        $result->bindParam(3, $this->vendedor);
        $result->bindParam(4, $this->fecha_inicio);
        $result->bindParam(5, $this->fecha_fin);
        $result->bindParam(6, $this->pecosa);
        $result->bindParam(7, $this->numero_pagina);
        $result->bindParam(8, $this->total_pagina);

        $result->execute();
        
        $vendedor_list=array();
        $vendedor_list["vendedores"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $vendedor_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "id_salida"=>$id_salida,
                "pecosa"=>$pecosa,
                "fecha_salida"=>$fecha_salida,
                "fecha_retorno"=>$fecha_retorno,
                "id_vendedor"=>$id_vendedor,
                "nombre_vendedor"=>$nombre_vendedor,
                "comision_efectiva"=>$comision_efectiva,
                "comision_retenida"=>$comision_retenida,
            );
            array_push($vendedor_list["vendedores"],$vendedor_item);
        }

        return $vendedor_list;
    }

    function read_comisiones_contar(){

        $query = "CALL sp_listarcomisionescontar(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->comisiones_efectivas_estado);
        $result->bindParam(2, $this->comisiones_retenidas_estado);
        $result->bindParam(3, $this->vendedor);
        $result->bindParam(4, $this->fecha_inicio);
        $result->bindParam(5, $this->fecha_fin);
        $result->bindParam(6, $this->pecosa);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function read_comisiones_vendedor(){

        $query = "CALL sp_listarcomisionesxvendedor(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_vendedor);
        $result->bindParam(2, $this->numero_pagina);
        $result->bindParam(3, $this->total_pagina);

        $result->execute();
        
        $vendedor_list=array();
        $vendedor_list["vendedores"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $vendedor_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "id_salida"=>$id_salida,
                "pecosa"=>$pecosa,
                "fecha_salida"=>$fecha_salida,
                "fecha_retorno"=>$fecha_retorno,
                "comision_efectiva"=>$comision_efectiva,
                "comision_retenida"=>$comision_retenida,
                "comision_efectiva_porcentaje"=>$comision_efectiva_porcentaje,
                "comision_retenida_porcentaje"=>$comision_retenida_porcentaje,
                "comision_efectiva_estado"=>$comision_efectiva_estado,
                "comision_retenida_estado"=>$comision_retenida_estado,
            );
            array_push($vendedor_list["vendedores"],$vendedor_item);
        }

        return $vendedor_list;
    }

    function read_comisiones_vendedor_contar(){

        $query = "CALL sp_listarcomisionesxvendedorcontar(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_vendedor);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function  create_comision()
    {
        $query = "CALL sp_crearvendedorcomision(
            :prsalida,
            :prvendedor,
            :prcomisionefectivaporcentaje,
            :prcomisionefectiva,
            :prcomisionretenidaporcentaje,
            :prcomisionretenida
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prsalida", $this->salida);
        $result->bindParam(":prvendedor", $this->vendedor);
        $result->bindParam(":prcomisionefectivaporcentaje", $this->comision_efectiva_porcentaje);
        $result->bindParam(":prcomisionefectiva", $this->comision_efectiva);
        $result->bindParam(":prcomisionretenidaporcentaje", $this->comision_retenida_porcentaje);
        $result->bindParam(":prcomisionretenida", $this->comision_retenida);

        $this->salida=htmlspecialchars(strip_tags($this->salida));
        $this->vendedor=htmlspecialchars(strip_tags($this->vendedor));
        $this->comision_efectiva_porcentaje=htmlspecialchars(strip_tags($this->comision_efectiva_porcentaje));
        $this->comision_efectiva=htmlspecialchars(strip_tags($this->comision_efectiva));
        $this->comision_retenida_porcentaje=htmlspecialchars(strip_tags($this->comision_retenida_porcentaje));
        $this->comision_retenida=htmlspecialchars(strip_tags($this->comision_retenida));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

}
?>