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

    public $comisiones_efectivas_estado;
    public $comisiones_retenidas_estado;
    public $vendedor;
    public $fecha_inicio;
    public $fecha_fin;
    public $talonario;
    public $contrato;
    public $numero_pagina;
    public $total_pagina;


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

        $query = "CALL sp_listarcomisiones(?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->comisiones_efectivas_estado);
        $result->bindParam(2, $this->comisiones_retenidas_estado);
        $result->bindParam(3, $this->vendedor);
        $result->bindParam(4, $this->fecha_inicio);
        $result->bindParam(5, $this->fecha_fin);
        $result->bindParam(6, $this->talonario);
        $result->bindParam(7, $this->contrato);
        $result->bindParam(8, $this->numero_pagina);
        $result->bindParam(9, $this->total_pagina);

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
                "id_venta"=>$id_venta,
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

        $query = "CALL sp_listarcomisionescontar(?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->comisiones_efectivas_estado);
        $result->bindParam(2, $this->comisiones_retenidas_estado);
        $result->bindParam(3, $this->vendedor);
        $result->bindParam(4, $this->fecha_inicio);
        $result->bindParam(5, $this->fecha_fin);
        $result->bindParam(6, $this->talonario);
        $result->bindParam(7, $this->contrato);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

}
?>