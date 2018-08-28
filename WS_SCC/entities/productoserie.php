<?php
Class ProductoSerie{

    private $conn;

    public $id_producto_serie;
    public $id_producto;
    public $producto;
    public $serie;
    public $estado;
    public $color;
    public $almacenamiento;
    public $observacion;

    public function __construct($db){
        $this->conn = $db;
    }

    /* Listar productos */
    function read(){

        $query = "CALL sp_listarproductoserie(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->almacen);
        $result->bindParam(2, $this->id_producto);

        $result->execute();
        
        $producto_serie_list=array();
        $producto_serie_list["producto_series"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $producto_serie_item = array (
                "numero"=>$contador,
                "almacen"=>$almacen,
                "id_producto"=>$id_producto,
                "id_serie"=>$id_serie,
                "serie"=>$serie,
                "cantidad"=>$cantidad
            );
            array_push($producto_serie_list["producto_series"],$producto_serie_item);
        }

        return $producto_serie_list;
    }

    // function contar(){

    //     $query = "CALL sp_listarproductoseriecontar(?,?)";

    //     $result = $this->conn->prepare($query);

    //     $result->bindParam(1, $this->prproducto);
    //     $result->bindParam(2, $this->prserie);

    //     $result->execute();

    //     $row = $result->fetch(PDO::FETCH_ASSOC);

    //     $this->total_producto_serie=$row['total'];

    //     return $this->total_producto_serie;
    // }

    function readxId(){

        $query = "CALL sp_listarproductoseriexproducto(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->producto);

        $result->execute();
        
        $producto_serie_list=array();
        $producto_serie_list["producto_series"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $producto_serie_item = array (
                "numero"=>$contador,
                "producto"=>$prd_descripcion,
                "serie"=>$ps_serie
            );
            array_push($producto_serie_list["producto_series"],$producto_serie_item);
        }

        return $producto_serie_list;
    }

    function readxproducto(){

        $query ="call sp_listarproductoseriexproducto(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_producto);
        
        $result->execute();
    
        $producto_serie_list=array();
        $producto_serie_list["producto_series"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $producto_serie_item = array (
                "numero"=>$contador,
                "producto"=>$id_producto,
                "serie"=>$ps_serie
            );
            array_push($producto_serie_list["producto_series"],$producto_serie_item);
        }

        return $producto_serie_list;
    }

    /* Crear producto */
    function create(){

        $query = "call sp_crearproductoserie(
            :prproducto,
            :prserie,
            :prcolor,
            :pralmacenamiento,
            :probservacion
            )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prproducto", $this->id_producto);
        $result->bindParam(":prserie", $this->serie);
        $result->bindParam(":prcolor", $this->color);
        $result->bindParam(":pralmacenamiento", $this->almacenamiento);
        $result->bindParam(":probservacion", $this->observacion);


        $this->id_producto=htmlspecialchars(strip_tags($this->id_producto));
        $this->serie=htmlspecialchars(strip_tags($this->serie));
        $this->color=htmlspecialchars(strip_tags($this->color));
        $this->almacenamiento=htmlspecialchars(strip_tags($this->almacenamiento));
        $this->observacion=htmlspecialchars(strip_tags($this->observacion));

        if($result->execute())
        {
            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $this->id=$idproductoserie;
            }
            return true;
        }
        
        return false;
    }

    /* Actualizar producto */
    function enter(){

        $query = "call sp_actualizarproductoserieingresar(:prid)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_producto_serie);

        $this->id_producto_serie=htmlspecialchars(strip_tags($this->id_producto_serie));

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    function leave(){

        $query = "call sp_actualizarproductoseriequitar(:prid)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prid", $this->id_producto_serie);

        $this->id_producto_serie=htmlspecialchars(strip_tags($this->id_producto_serie));

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }
}
?>