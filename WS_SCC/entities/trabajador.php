<?php 

    class Trabajador{

        private $conn;

        public $id_trabajador;
        public $documento;
        public $nombre;
        public $cargo;
        public $fecha;
        public $fecha_inicio;
        public $fecha_fin;
        public $hora_ingreso;
        public $ingreso;
        public $hora_salida;
        public $salida;
        public $foto;
        public $numero_pagina;
        public $total_pagina;

        public function __construct($db){
            $this->conn = $db;
        }

        function read(){
            $query = "CALL sp_listartrabajadores(?,?,?,?)";
            $result = $this->conn->prepare($query);

            $result->bindParam(1, $this->documento);
            $result->bindParam(2, $this->nombre);
            $result->bindParam(3, $this->numero_pagina);
            $result->bindParam(4, $this->total_pagina);
            
            $result->execute();

            $trabajadores=array();
            $trabajadores["trabajadores"]=array();

            $contador = $this->total_pagina*($this->numero_pagina-1);

            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $contador = $contador+1;
                $trabajador_item = array(
                    "numero"=>$contador,
                    "id"=>$id,
                    "documento"=>$documento,
                    "nombre"=>$nombre,
                    "cargo"=>$cargo,
                    "hora_ingreso"=>$hora_ingreso,
                    "hora_salida"=>$hora_salida,
                    "foto"=>$foto,
                );
                array_push($trabajadores["trabajadores"],$trabajador_item);
            }
            return $trabajadores;
        }

        function contar(){

            $query = "CALL sp_listartrabajadorescontar(?,?)";
    
            $result = $this->conn->prepare($query);
    
            $result->bindParam(1, $this->documento);
            $result->bindParam(2, $this->nombre);
    
            $result->execute();
    
            $row = $result->fetch(PDO::FETCH_ASSOC);
    
            $this->total_resultado=$row['total'];
    
            return $this->total_resultado;
        }

        function read_documento(){
            $query ="call sp_listartrabajadorxdocumento(?)";
            
            $result = $this->conn->prepare($query);
            
            $result->bindParam(1, $this->documento);
    
            $result->execute();
        
            $row = $result->fetch(PDO::FETCH_ASSOC);
            
            $this->id_trabajador=$row['id'];
            $this->documento=$row['documento'];
            $this->nombre=$row['nombre'];
            $this->cargo=$row['cargo'];
            $this->hora_ingreso=$row['hora_ingreso'];
            $this->hora_salida=$row['hora_salida'];
            $this->foto=$row['foto'];
        }

        function create(){
            $query = "call sp_creartrabajador(
                :prdocumento,
                :prnombre,
                :prcargo,
                :prhoraingreso,
                :prhorasalida
            )";

            $result = $this->conn->prepare($query);

            $result->bindParam(":prdocumento", $this->documento);
            $result->bindParam(":prnombre", $this->nombre);
            $result->bindParam(":prcargo", $this->cargo);
            $result->bindParam(":prhoraingreso", $this->hora_ingreso);
            $result->bindParam(":prhorasalida", $this->hora_salida);

            $this->documento=htmlspecialchars(strip_tags($this->documento));
            $this->nombre=htmlspecialchars(strip_tags($this->nombre));
            $this->cargo=htmlspecialchars(strip_tags($this->cargo));
            $this->hora_ingreso=htmlspecialchars(strip_tags($this->hora_ingreso));
            $this->hora_salida=htmlspecialchars(strip_tags($this->hora_salida));

            if($result->execute())
            {
                return true;
            }
            
            return false;
        }

        function create_tareo(){
            $query = "call sp_creartareo(
                :prtrabajador,
                :prfecha,
                :prhoraingreso,
                :pringreso,
                :prhorasalida,
                :prsalida
            )";

            $result = $this->conn->prepare($query);

            $result->bindParam(":prtrabajador", $this->id_trabajador);
            $result->bindParam(":prfecha", $this->fecha);
            $result->bindParam(":prhoraingreso", $this->hora_ingreso);
            $result->bindParam(":pringreso", $this->ingreso);
            $result->bindParam(":prhorasalida", $this->hora_salida);
            $result->bindParam(":prsalida", $this->salida);

            $this->id_trabajador=htmlspecialchars(strip_tags($this->id_trabajador));
            $this->fecha=htmlspecialchars(strip_tags($this->fecha));
            $this->hora_ingreso=htmlspecialchars(strip_tags($this->hora_ingreso));
            $this->ingreso=htmlspecialchars(strip_tags($this->ingreso));
            $this->hora_salida=htmlspecialchars(strip_tags($this->hora_salida));
            $this->salida=htmlspecialchars(strip_tags($this->salida));

            if($result->execute())
            {
                return true;
            }
            
            return false;
        }

        function read_tareo(){
            $query = "CALL sp_listartareo(?,?,?,?,?,?)";
            $result = $this->conn->prepare($query);

            $result->bindParam(1, $this->documento);
            $result->bindParam(2, $this->nombre);
            $result->bindParam(3, $this->fecha_inicio);
            $result->bindParam(4, $this->fecha_fin);
            $result->bindParam(5, $this->numero_pagina);
            $result->bindParam(6, $this->total_pagina);
            
            $result->execute();

            $tareo=array();
            $tareo["tareo"]=array();

            $contador = $this->total_pagina*($this->numero_pagina-1);

            while($row = $result->fetch(PDO::FETCH_ASSOC))
            {
                extract($row);
                $contador = $contador+1;
                $trabajador_item = array(
                    "numero"=>$contador,
                    "fecha"=>$fecha,
                    "id"=>$id,
                    "id_trabajador"=>$id_trabajador,
                    "documento"=>$documento,
                    "nombre"=>$nombre,
                    "hora_ingreso"=>$hora_ingreso,
                    "ingreso"=>$ingreso,
                    "tardanza_ingreso"=>$tardanza_ingreso,
                    "hora_salida"=>$hora_salida,
                    "salida"=>$salida,
                    "premura_salida"=>$premura_salida,
                    "horas_trabajadas"=>$horas_trabajadas,
                );
                array_push($tareo["tareo"],$trabajador_item);
            }
            return $tareo;
        }

        function contar_tareo(){

            $query = "CALL sp_listartareocontar(?,?,?,?)";
    
            $result = $this->conn->prepare($query);
    
            $result->bindParam(1, $this->documento);
            $result->bindParam(2, $this->nombre);
            $result->bindParam(3, $this->fecha_inicio);
            $result->bindParam(4, $this->fecha_fin);
    
            $result->execute();
    
            $row = $result->fetch(PDO::FETCH_ASSOC);
    
            $this->total_resultado=$row['total'];
    
            return $this->total_resultado;
        }

        function delete(){
            $query = "call sp_eliminartrabajador(
                :prtrabajador
            )";

            $result = $this->conn->prepare($query);

            $result->bindParam(":prtrabajador", $this->id_trabajador);

            $this->id_trabajador=htmlspecialchars(strip_tags($this->id_trabajador));

            if($result->execute())
            {
                return true;
            }
            
            return false;
        }

    }

?>