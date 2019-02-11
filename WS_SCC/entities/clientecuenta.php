<?php
Class ClienteCuenta{

    private $conn;
    private $table_name = "cliente_cuenta";

    public $idcliente_direccion;
    public $id_cliente;
    public $id_cuenta;
    public $clt_nombre;
    public $banco;
    public $cuenta;
    public $cci;
    public $prpagina;
    public $prtotalpagina;

    public function __construct($db){
        $this->conn = $db;
    }

    function create()
    {
        $query = "CALL sp_crearclientecuenta(
            :prcliente,
            :prbanco,
            :prcuenta,
            :prcci
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":prcliente", $this->id_cliente);
        $result->bindParam(":prbanco", $this->banco);
        $result->bindParam(":prcuenta", $this->cuenta);
        $result->bindParam(":prcci", $this->cci);

        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->banco=htmlspecialchars(strip_tags($this->banco));
        $this->cuenta=htmlspecialchars(strip_tags($this->cuenta));
        $this->cci=htmlspecialchars(strip_tags($this->cci));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function delete(){
      $query = "CALL sp_eliminarclientecuenta(:id_cuenta)";

      $result = $this->conn->prepare($query);

      $result->bindParam(":id_cuenta", $this->id_cuenta);

      $this->id_cuenta=htmlspecialchars(strip_tags($this->id_cuenta));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function read()
    {
        $query = "CALL sp_listarclientecuenta(:id_cliente, :pagina, :total_pagina)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_cliente", $this->id_cliente);
        $result->bindParam(":pagina", $this->prpagina);
        $result->bindParam(":total_pagina", $this->prtotalpagina);

        $result->execute();
        $cuentas_list=array();
        $cuentas_list["cuentas"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cuentas_item = array (
                "numero"=>$contador,
                "id"=>$row['id'],
                "id_cliente"=>$row['id_cliente'],
                "id_banco"=>$row['id_banco'],
                "nombre_banco"=>$row['nombre_banco'],
                "cuenta_numero"=>$row['cuenta_numero'],
                "cuenta_cci"=>bcmul($row["cuenta_cci"],"1")
            );

            array_push($cuentas_list["cuentas"],$cuentas_item);
        }
        return $cuentas_list;
    }

    function contar(){

        $query = "CALL sp_listarclientecuentacontar(?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->id_cliente);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

}
?>
