<?php
    Class Cargo{

        private $conn;
        private $table_name = "cliente";

        public $id_sede;
        public $id_cargo;

        public function __construct($db){
            $this->conn = $db;
        }

         
        function read_cargo(){

            $query = "CALL sp_listarclientecargo(?)";

            $result = $this->conn->prepare($query);

            $result->bindParam(1, $this->id_sede);

            $result->execute();
        
            $cliente_list=array();
            $cliente_list["cargos"]=array();

            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $cliente_item = array (
                    "id"=>$row['id'],
                    "nombre"=>$row['nombre'],
                );

                array_push($cliente_list["cargos"],$cliente_item);
            }
            return $cliente_list; 
        }

        function read_cargo_estado(){

            $query = "CALL sp_listarclientecargoestado(?)";

            $result = $this->conn->prepare($query);

            $result->bindParam(1, $this->id_cargo);

            $result->execute();
        
            $cliente_list=array();
            $cliente_list["estados"]=array();

            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $cliente_item = array (
                    "id"=>$row['id'],
                    "nombre"=>$row['nombre'],
                );

                array_push($cliente_list["estados"],$cliente_item);
            }
            return $cliente_list; 
        }

    }
?>