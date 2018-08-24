<?php
Class Producto{

    private $conn;
    private $table_name = "producto";

    public $idproducto;
    public $tprd_nombre;
    public $mrc_nombre;
    public $mdl_nombre;
    public $prd_descripcion;
    public $und_nombre;
    public $prd_precio;

    public $id_producto;
    public $id;

    public $id_tipo_producto;
    public $id_marca;
    public $id_modelo;
    public $numero_pagina;
    public $total_pagina;
    public $total_resultado;
    public $orden;

    public $foto;
    public $precio_minimo;
    public $precio_maximo;
    public $estado;

    public function __construct($db){
        $this->conn = $db;
    }

    /* Listar productos */
    function read(){

        $query = "CALL sp_listarproducto(?,?,?,?,?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tprd_nombre);
        $result->bindParam(2, $this->mrc_nombre);
        $result->bindParam(3, $this->mdl_nombre);
        $result->bindParam(4, $this->prd_descripcion);
        $result->bindParam(5, $this->precio_minimo);
        $result->bindParam(6, $this->precio_maximo);
        $result->bindParam(7, $this->numero_pagina);
        $result->bindParam(8, $this->total_pagina);
        $result->bindParam(9, $this->orden);
        $result->bindParam(10, $this->estado);

        $result->execute();
        
        $producto_list=array();
        $producto_list["productos"]=array();

        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
		{
			extract($row);
            $contador=$contador+1;
            $producto_item = array (
                "numero"=>$contador,
                "id"=>$id,
                "tipo"=>$tipo,
                "marca"=>$marca,
                "modelo"=>$modelo,
                "descripcion"=>$descripcion,
                "unidad_medida"=>$unidad_medida,
                "precio"=>$precio,
                "estado"=>$estado
            );
            array_push($producto_list["productos"],$producto_item);
        }

        return $producto_list;
    }

    function contar(){

        $query = "CALL sp_listarproductocontar(?,?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tprd_nombre);
        $result->bindParam(2, $this->mrc_nombre);
        $result->bindParam(3, $this->mdl_nombre);
        $result->bindParam(4, $this->prd_descripcion);
        $result->bindParam(5, $this->precio_minimo);
        $result->bindParam(6, $this->precio_maximo);
        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    /* Seleccionar producto */
    function readxId()
    {
        $query ="call sp_listarproductoxId(?)";
        
        $result = $this->conn->prepare($query);
        
        $result->bindParam(1, $this->id_producto);
        
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->idproducto=$row['idproducto'];
        $this->id_tipo_producto=$row['id_tipo_producto'];
        $this->id_marca=$row['id_marca'];
        $this->id_modelo=$row['id_modelo'];
        $this->prd_descripcion=$row['prd_descripcion'];
        $this->und_nombre=$row['und_nombre'];
        $this->prd_precio=$row['prd_precio'];
    }

    /* Crear producto */
    function create()
    {
        $query = "CALL sp_crearproducto(:id_modelo, :prd_descripcion, :prd_precio)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_modelo", $this->id_modelo);
        $result->bindParam(":prd_descripcion", $this->prd_descripcion);
        $result->bindParam(":prd_precio", $this->prd_precio);

        $this->id_modelo=htmlspecialchars(strip_tags($this->id_modelo));
        $this->prd_descripcion=htmlspecialchars(strip_tags($this->prd_descripcion));
        $this->prd_precio=htmlspecialchars(strip_tags($this->prd_precio));

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    /* Eliminar producto */
    function delete()
    {
        $query = "call sp_eliminarproducto(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idproducto);

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    /* Activar producto */
    function activar()
    {
        $query = "call sp_activarproducto(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idproducto);

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    /* Actualizar producto */
    function update()
    {
        $query = "call sp_actualizarproducto(:id_producto, :id_modelo, :descripcion, :prd_precio)";
        $result = $this->conn->prepare($query);

        $result->bindParam(":id_producto", $this->id_producto);
        $result->bindParam(":id_modelo", $this->id_modelo);
        $result->bindParam(":descripcion", $this->prd_descripcion);
        $result->bindParam(":prd_precio", $this->prd_precio);

        $this->id_producto=htmlspecialchars(strip_tags($this->id_producto));
        $this->id_modelo=htmlspecialchars(strip_tags($this->id_modelo));
        $this->prd_descripcion=htmlspecialchars(strip_tags($this->prd_descripcion));
        $this->prd_precio=htmlspecialchars(strip_tags($this->prd_precio));

        if($result->execute())
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    function updatefoto()
    {
        $query= "CALL sp_actualizarproductofoto(:id, :nombre)";

        $result = $this->conn->prepare($query);

        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->foto=htmlspecialchars(strip_tags($this->foto));

        $result->bindParam(":id", $this->id);
        $result->bindParam(":nombre", $this->foto);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

}
?>