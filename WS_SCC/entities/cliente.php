<?php
Class Cliente{

    private $conn;
    private $table_name = "cliente";

    public $idcliente;
    public $inst_nombre;
    public $clt_codigo;
    public $clt_dni;
    public $clt_nombre;
    public $clt_apellido;
    public $clt_foto;
    public $clt_cip;
    public $clt_email;
    public $clt_casilla;
    public $clt_trabajo;
    public $clt_cargo;
    public $clt_calificacion_crediticia;
    public $clt_calificacion_personal;
    public $clt_aporte;
    public $clt_estado;
    public $clt_fecharegistro;

    public $clt_aporteinicio;
    public $clt_aportefin;


    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "CALL sp_listarcliente (?,?,?,?)";

        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->inst_nombre);
        $result->bindParam(2, $this->clt_dni);
        $result->bindParam(3, $this->clt_nombre);
        $result->bindParam(4, $this->clt_apellido);

        $result->execute();
    
        $cliente_list=array();
        $cliente_list["clientes"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $cliente_item = array (
                "numero"=>$contador,
                "idcliente"=>$row['idcliente'],
                "inst_nombre"=>$row['inst_nombre'],
                "clt_codigo"=>$row['clt_codigo'],
                "clt_dni"=>$row['clt_dni'],
                "clt_nombre"=>$row['clt_nombre'],
                "clt_apellido"=>$row['clt_apellido'],
                "clt_cip"=>$row['clt_cip'],
                "clt_email"=>$row['clt_email'],
                "clt_casilla"=>$row['clt_casilla'],
                "clt_trabajo"=>$row['clt_trabajo'],
                "clt_cargo"=>$row['clt_cargo'],
                "clt_calificacion_crediticia"=>$row['clt_calificacion_crediticia'],
                "clt_calificacion_personal"=>$row['clt_calificacion_personal'],
                "clt_aporte"=>$row['clt_aporte'],
                "clt_fecharegistro"=>$row['clt_fecharegistro']
            );

                array_push($cliente_list["clientes"],$cliente_item);
        }
        return $cliente_list;
    }
    
    function create()
    {
        $query = "CALL sp_crearcliente (:id_institucion,:clt_codigo,:clt_dni,:clt_nombre,:clt_apellido,:clt_foto,:clt_cip,:clt_email,:clt_casilla,:clt_trabajo,:clt_cargo,:clt_calificacion_crediticia,:clt_calificacion_personal,:clt_aporte,:clt_estado,:clt_fecharegistro)"; 

        $result = $this->conn->prepare($query);

        $this->id_institucion=htmlspecialchars(strip_tags($this->id_institucion));
        $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
        $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
        $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
        $this->clt_apellido=htmlspecialchars(strip_tags($this->clt_apellido));
        $this->clt_foto=htmlspecialchars(strip_tags($this->clt_foto));
        $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
        $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
        $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));
        $this->clt_trabajo=htmlspecialchars(strip_tags($this->clt_trabajo));        
        $this->clt_cargo=htmlspecialchars(strip_tags($this->clt_cargo));
        $this->clt_calificacion_crediticia=htmlspecialchars(strip_tags($this->clt_calificacion_crediticia));
        $this->clt_calificacion_personal=htmlspecialchars(strip_tags($this->clt_calificacion_personal));        
        $this->clt_aporte=htmlspecialchars(strip_tags($this->clt_aporte));
        $this->clt_estado=htmlspecialchars(strip_tags($this->clt_estado));
        $this->clt_fecharegistro=htmlspecialchars(strip_tags($this->clt_fecharegistro));

        $result->bindParam(":id_institucion", $this->id_institucion);
        $result->bindParam(":clt_codigo", $this->clt_codigo);
        $result->bindParam(":clt_dni", $this->clt_dni);
        $result->bindParam(":clt_nombre", $this->clt_nombre);
        $result->bindParam(":clt_apellido", $this->clt_apellido);
        $result->bindParam(":clt_foto", $this->clt_foto);
        $result->bindParam(":clt_cip", $this->clt_cip);
        $result->bindParam(":clt_email", $this->clt_email);
        $result->bindParam(":clt_casilla", $this->clt_casilla);
        $result->bindParam(":clt_trabajo", $this->clt_trabajo);
        $result->bindParam(":clt_cargo", $this->clt_cargo);
        $result->bindParam(":clt_calificacion_crediticia", $this->clt_calificacion_crediticia);
        $result->bindParam(":clt_calificacion_personal", $this->clt_calificacion_personal);
        $result->bindParam(":clt_aporte", $this->clt_aporte);
        $result->bindParam(":clt_estado", $this->clt_estado);
        $result->bindParam(":clt_fecharegistro", $this->clt_fecharegistro);
        

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function readxId()
    {
        $query ="CALL sp_listarclientexId (?)";
        $result = $this->conn->prepare($query);
        $result->bindParam(1, $this->idcliente);
        $result->execute();
    
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        $this->usr_nombre=$row['usr_nombre'];
        $this->usr_usuario=$row['usr_usuario'];
        $this->usr_ultimologueo=$row['usr_ultimologueo'];
        $this->usr_fechacreacion=$row['usr_fechacreacion'];
        $this->usr_estado=$row['usr_estado'];
        $this->prf_nombre= $row['prf_nombre'];
    }

    function update()
    {
        $query = "CALL sp_actualizarcliente (:idcliente,:id_institucion,:clt_codigo,:clt_dni,:clt_nombre,:clt_apellido,:clt_foto,:clt_cip,:clt_email,:clt_casilla,:clt_trabajo,:clt_cargo,:clt_calificacion_crediticia,:clt_calificacion_personal,:clt_aporte,:clt_fecharegistro)"; 

        $result = $this->conn->prepare($query);

        $this->idcliente=htmlspecialchars(strip_tags($this->idcliente));
        $this->id_institucion=htmlspecialchars(strip_tags($this->id_institucion));
        $this->clt_codigo=htmlspecialchars(strip_tags($this->clt_codigo));
        $this->clt_dni=htmlspecialchars(strip_tags($this->clt_dni));
        $this->clt_nombre=htmlspecialchars(strip_tags($this->clt_nombre));
        $this->clt_apellido=htmlspecialchars(strip_tags($this->clt_apellido));
        $this->clt_foto=htmlspecialchars(strip_tags($this->clt_foto));
        $this->clt_cip=htmlspecialchars(strip_tags($this->clt_cip));
        $this->clt_email=htmlspecialchars(strip_tags($this->clt_email));
        $this->clt_casilla=htmlspecialchars(strip_tags($this->clt_casilla));
        $this->clt_trabajo=htmlspecialchars(strip_tags($this->clt_trabajo));        
        $this->clt_cargo=htmlspecialchars(strip_tags($this->clt_cargo));
        $this->clt_calificacion_crediticia=htmlspecialchars(strip_tags($this->clt_calificacion_crediticia));
        $this->clt_calificacion_personal=htmlspecialchars(strip_tags($this->clt_calificacion_personal));        
        $this->clt_aporte=htmlspecialchars(strip_tags($this->clt_aporte));
        $this->clt_estado=htmlspecialchars(strip_tags($this->clt_fecharegistro));

        $result->bindParam(":idcliente", $this->idcliente);
        $result->bindParam(":id_institucion", $this->id_institucion);
        $result->bindParam(":clt_codigo", $this->clt_codigo);
        $result->bindParam(":clt_dni", $this->clt_dni);
        $result->bindParam(":clt_nombre", $this->clt_nombre);
        $result->bindParam(":clt_apellido", $this->clt_apellido);
        $result->bindParam(":clt_foto", $this->clt_foto);
        $result->bindParam(":clt_cip", $this->clt_cip);
        $result->bindParam(":clt_email", $this->clt_email);
        $result->bindParam(":clt_casilla", $this->clt_casilla);
        $result->bindParam(":clt_trabajo", $this->clt_trabajo);
        $result->bindParam(":clt_cargo", $this->clt_cargo);
        $result->bindParam(":clt_calificacion_crediticia", $this->clt_calificacion_crediticia);
        $result->bindParam(":clt_calificacion_personal", $this->clt_calificacion_personal);
        $result->bindParam(":clt_aporte", $this->clt_aporte);
        $result->bindParam(":clt_fecharegistro", $this->clt_fecharegistro);
        

        if($result->execute())
        {
            return true;
        }
        
        return false;
    }
    function delete()
    {
        $query = "call sp_eliminarcliente(?)";
        $result = $this->conn->prepare($query);

        $result->bindParam(1, $this->idcliente);

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