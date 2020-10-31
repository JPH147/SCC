<?php
Class Usuario{

    private $conn;

    public $idusuario;
    public $usr_nombre;
    public $usr_usuario;
    public $usr_clave;
    public $usr_fechacreacion;
    public $usr_ultimologueo;
    public $usr_estado;
    public $idperfil;
    public $prf_nombre;
    public $permisos;
    public $numero_pagina;
    public $total_pagina;
    public $total_resultado;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listarusuario(?,?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->usr_nombre);
        $result->bindParam(2, $this->usr_usuario);
        $result->bindParam(3, $this->prf_nombre);
        $result->bindParam(4, $this->numero_pagina);
        $result->bindParam(5, $this->total_pagina);

        $result->execute();
    
        $usuario_list=array();
        $usuario_list["usuarios"]=array();
        $contador = $this->total_pagina*($this->numero_pagina-1);

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $usuario_item = array (
                "numero"=>$contador,
                "id_usuario"=>$row['idusuario'],
                "nombre"=>$row['usr_nombre'],
                "usuario"=>$row['usr_usuario'],
                "fecha_creacion"=>$row['usr_ultimologueo'],
                "ultimo_logueo"=>$row['usr_fechacreacion'],
                "id_perfil"=>$row['id_perfil'],
                "pss"=>$row['pss'],
                "perfil"=>$row['perfil'],
            );

                array_push($usuario_list["usuarios"],$usuario_item);
        }
        return $usuario_list;
    }

    function contar(){
        $query = "CALL sp_listarusuariocontar(?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->usr_nombre);
        $result->bindParam(2, $this->usr_usuario);
        $result->bindParam(3, $this->prf_nombre);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }
    
    function create(){
        $query = "CALL sp_crearusuario (:usr_nombre,:usr_usuario,:usr_clave,:idperfil)"; 

        $result = $this->conn->prepare($query);

        $this->usr_nombre=htmlspecialchars(strip_tags($this->usr_nombre));
        $this->usr_usuario=htmlspecialchars(strip_tags($this->usr_usuario));
        $this->usr_clave=htmlspecialchars(strip_tags($this->usr_clave));
        $this->idperfil=htmlspecialchars(strip_tags($this->idperfil));

        $result->bindParam(":usr_nombre", $this->usr_nombre);
        $result->bindParam(":usr_usuario", $this->usr_usuario);
        $result->bindParam(":usr_clave", $this->usr_clave);
        $result->bindParam(":idperfil", $this->idperfil);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function readxId() {
        $query ="CALL sp_listarusuarioxId(?)";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idusuario);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->usr_nombre=$row['usr_nombre'];
        $this->usr_usuario=$row['usr_usuario'];
        $this->usr_ultimologueo=$row['usr_ultimologueo'];
        $this->usr_fechacreacion=$row['usr_fechacreacion'];
        $this->usr_estado=$row['usr_estado'];
        $this->prf_nombre= $row['perfil'];
        $this->idperfil= $row['id_perfil'];
    }
    
    function login($usr_usuario, $usr_clave){
        $usr_clave_hash= password_hash($usr_clave, PASSWORD_DEFAULT);
        $query = "CALL sp_login('$usr_usuario')";

        $result = $this->conn->prepare($query);
        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->idusuario = $row['idusuario'];
        $this->usr_nombre=$row['usr_nombre'];
        $this->usr_usuario=$row['usr_usuario'];
        $this->usr_clave=$row['usr_clave'];
        $this->idperfil=$row['idperfil'];
        $this->prf_nombre=$row['nombre'];
        $this->permisos=$row['permisos'];

        if(!(empty($this->usr_nombre)) && !(empty($this->usr_clave)) )
        {
            if(password_verify($usr_clave,$row['usr_clave'])){
                $query = "CALL sp_actualizafechalogueo($this->idusuario)";
                $result = $this->conn->prepare($query);
                $result->execute();
                return $this;
            }
            else{
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    function update(){
        $query = "CALL sp_actualizarusuario (:idusuario,:usr_nombre,:usr_usuario,:idperfil)"; 

        $result = $this->conn->prepare($query);

        $this->idusuario=htmlspecialchars(strip_tags($this->idusuario));
        $this->usr_nombre=htmlspecialchars(strip_tags($this->usr_nombre));
        $this->usr_usuario=htmlspecialchars(strip_tags($this->usr_usuario));
        $this->idperfil=htmlspecialchars(strip_tags($this->idperfil));

        $result->bindParam(":idusuario", $this->idusuario);
        $result->bindParam(":usr_nombre", $this->usr_nombre);
        $result->bindParam(":usr_usuario", $this->usr_usuario);
        $result->bindParam(":idperfil", $this->idperfil);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function update_password(){
        $query = "CALL sp_actualizarusuariopss (:idusuario,:usr_clave)"; 

        $result = $this->conn->prepare($query);

        $this->idusuario=htmlspecialchars(strip_tags($this->idusuario));
        $this->usr_clave=htmlspecialchars(strip_tags($this->usr_clave));

        $result->bindParam(":idusuario", $this->idusuario);
        $result->bindParam(":usr_clave", $this->usr_clave);

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }

    function delete(){
        $query = "call sp_eliminarusuario(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idusuario);

        if($result->execute())
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function verificar_usuario(){
        $query = "CALL sp_verificarusuario(?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->usr_usuario);
        $result->bindParam(2, $this->idusuario);
        
        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }
}
?>