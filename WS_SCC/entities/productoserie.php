<?php
Class ProductoSerie{

    private $conn;

    public $id;
    public $id_producto_serie;
    public $id_producto;
    public $producto;
    public $sucursal;
    public $almacen;
    public $id_serie;
    public $serie;
    public $estado;
    public $color;
    public $almacenamiento;
    public $proveedor;
    public $observacion;
    public $numero_pagina;
    public $total_pagina;
    public $precio_compra;

    public function __construct($db){
        $this->conn = $db;
    }

    /* Listar productos */
    function read(){

        $query = "CALL sp_listarproductoserie(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->almacen);
        $result->bindParam(2, $this->id_producto);
        $result->bindParam(3, $this->numero_pagina);
        $result->bindParam(4, $this->total_pagina);

        $result->execute();
        
        $producto_serie_list=array();
        $producto_serie_list["producto_series"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $producto_serie_item = array (
                "numero"=>$contador,
                "id_serie"=>$id_serie,
                "serie"=>$serie,
                "color"=>$color,
                "almacenamiento"=>$almacenamiento,
                "proveedor"=>$proveedor,
                "precio"=>$precio,
            );
            array_push($producto_serie_list["producto_series"],$producto_serie_item);
        }

        return $producto_serie_list;
    }

    function contar(){

        $query = "CALL sp_listarproductoseriecontar(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->almacen);
        $result->bindParam(2, $this->id_producto);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_producto_serie=$row['total'];

        return $this->total_producto_serie;
    }

    function read_sucursal(){

        $query = "CALL sp_listarproductoseriexsucursal(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->sucursal);
        $result->bindParam(2, $this->id_producto);
        $result->bindParam(3, $this->numero_pagina);
        $result->bindParam(4, $this->total_pagina);

        $result->execute();
        
        $producto_serie_list=array();
        $producto_serie_list["producto_series"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $producto_serie_item = array (
                "numero"=>$contador,
                "id_serie"=>$id_serie,
                "serie"=>$serie,
                "color"=>$color,
                "almacenamiento"=>$almacenamiento,
                "precio"=>$precio,
                "id_almacen"=>$id_almacen,
                "nombre_almacen"=>$nombre_almacen,
            );
            array_push($producto_serie_list["producto_series"],$producto_serie_item);
        }

        return $producto_serie_list;
    }

    function contar_sucursal(){

        $query = "CALL sp_listarproductoseriecontarxsucursal(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->sucursal);
        $result->bindParam(2, $this->id_producto);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_producto_serie=$row['total'];

        return $this->total_producto_serie;
    }

    function readxId(){
        $query ="call sp_listarproductoseriexId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->id_producto_serie=$row['id'];
        $this->id_producto=$row['id_producto'];
        $this->producto=$row['producto'];
        $this->serie=$row['serie'];
        $this->color=$row['color'];
        $this->almacenamiento=$row['almacenamiento'];
        $this->precio_compra=$row['precio'];
    }

    /* Crear producto */
    function create(){

        $query = "call sp_crearproductoserie(
            :prproducto,
            :prserie,
            :prcolor,
            :pralmacenamiento,
            :prprecio
            )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prproducto", $this->id_producto);
        $result->bindParam(":prserie", $this->serie);
        $result->bindParam(":prcolor", $this->color);
        $result->bindParam(":pralmacenamiento", $this->almacenamiento);
        $result->bindParam(":prprecio", $this->precio_compra);

        $this->id_producto=htmlspecialchars(strip_tags($this->id_producto));
        $this->serie=htmlspecialchars(strip_tags($this->serie));
        $this->color=htmlspecialchars(strip_tags($this->color));
        $this->almacenamiento=htmlspecialchars(strip_tags($this->almacenamiento));
        $this->precio_compra=htmlspecialchars(strip_tags($this->precio_compra));

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

    function update(){
        
      $query = "call sp_actualizarproductoserie(:prid, :prproducto, :prserie, :prcolor, :pralmacenamiento, :prprecio)";
      $result = $this->conn->prepare($query);

      $result->bindParam(":prid", $this->id_producto_serie);
      $result->bindParam(":prproducto", $this->id_producto);
      $result->bindParam(":prserie", $this->serie);
      $result->bindParam(":prcolor", $this->color);
      $result->bindParam(":pralmacenamiento", $this->almacenamiento);
      $result->bindParam(":prprecio", $this->precio_compra);

      $this->id_producto_serie=htmlspecialchars(strip_tags($this->id_producto_serie));
      $this->id_producto=htmlspecialchars(strip_tags($this->id_producto));
      $this->serie=htmlspecialchars(strip_tags($this->serie));
      $this->color=htmlspecialchars(strip_tags($this->color));
      $this->almacenamiento=htmlspecialchars(strip_tags($this->almacenamiento));
      $this->precio_compra=htmlspecialchars(strip_tags($this->precio_compra));

      if($result->execute()){
        return true;
      }
      else{
        return false;
      }

    }

    /* Actualizar producto */
    // function enter(){

    //     $query = "call sp_actualizarproductoserieingresar(:prid)";

    //     $result = $this->conn->prepare($query);

    //     $result->bindParam(":prid", $this->id_producto_serie);

    //     $this->id_producto_serie=htmlspecialchars(strip_tags($this->id_producto_serie));

    //     if($result->execute())
    //         {
    //             return true;
    //         }
    //         else
    //         {
    //             return false;
    //         }
    // }

    // function leave(){

    //     $query = "call sp_actualizarproductoseriequitar(:prid)";

    //     $result = $this->conn->prepare($query);

    //     $result->bindParam(":prid", $this->id_producto_serie);

    //     $this->id_producto_serie=htmlspecialchars(strip_tags($this->id_producto_serie));

    //     if($result->execute())
    //         {
    //             return true;
    //         }
    //         else
    //         {
    //             return false;
    //         }
    // }

    function validar(){
        $query = "CALL sp_validarproductoserie(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->serie);
        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }
    
}
?>