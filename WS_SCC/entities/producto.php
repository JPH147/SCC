<?php
Class Producto{

    private $conn;
    private $table_name = "producto";

    public $idperfil;
    public $prf_nombre;

    public $idproducto;
    public $tprd_nombre;
    public $mrc_nombre;
    public $mdl_nombre;
    public $prd_descripcion;
    public $und_nombre;

    public $id_modelo;
    public $id_producto;

    public function __construct($db){
        $this->conn = $db;
    }

    /* Listar productos */
    function read(){

        $query = "CALL sp_listarproducto(?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->tprd_nombre);
        $result->bindParam(2, $this->mrc_nombre);
        $result->bindParam(3, $this->mdl_nombre);
        $result->bindParam(4, $this->prd_descripcion);

        $result->execute();
    
        $producto_list=array();
        $producto_list["productos"]=array();

        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $producto_item = array (
                "numero"=>$contador,
                "id"=>$idproducto,
                "tipo"=>$tprd_nombre,
                "marca"=>$mrc_nombre,
                "modelo"=>$mdl_nombre,
                "descripcion"=>$prd_descripcion,
                "unidad_medida"=>$und_nombre
            );

            array_push($producto_list["productos"],$producto_item);
        }
        return $producto_list;
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
        $this->tprd_nombre=$row['tprd_nombre'];
        $this->mrc_nombre=$row['mrc_nombre'];
        $this->mdl_nombre=$row['mdl_nombre'];
        $this->prd_descripcion=$row['prd_descripcion'];
        $this->und_nombre=$row['und_nombre'];
    }

    /* Crear producto */
    function create()
    {
        $query = "CALL sp_crearproducto(:id_modelo, :prd_descripcion)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_modelo", $this->id_modelo);
        $result->bindParam(":prd_descripcion", $this->prd_descripcion);

        $this->id_modelo=htmlspecialchars(strip_tags($this->id_modelo));
        $this->prd_descripcion=htmlspecialchars(strip_tags($this->prd_descripcion));

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

    /* Actualizar producto */
    function update()
    {
        $query = "call sp_actualizarproducto(:id_producto, :id_modelo, :descripcion)";
        $result = $this->conn->prepare($query);

        $result->bindParam(":id_producto", $this->id_producto);
        $result->bindParam(":id_modelo", $this->id_modelo);
        $result->bindParam(":descripcion", $this->prd_descripcion);

        $this->id_producto=htmlspecialchars(strip_tags($this->id_producto));
        $this->id_modelo=htmlspecialchars(strip_tags($this->id_modelo));
        $this->prd_descripcion=htmlspecialchars(strip_tags($this->prd_descripcion));

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