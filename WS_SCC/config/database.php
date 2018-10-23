<?php
class Database {

    private $server = "107.180.40.35";
    private $port = "3306";
    private $db_name = "GENUS_SCC";
    private $username = "genus_jpr";
    private $password = "genus_jpr";

    public $conn;

    public function getConnection(){

        $this->conn = null;
        $this->conn = new PDO("mysql:host=" . $this->server . ";port=" . $this->port. ";dbname=" . $this->db_name, $this->username, $this->password);
        $this->conn->exec("set names UTF8");

        return $this->conn;
    }
}

?>