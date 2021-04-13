<?php
class Database {

    // private $server = "92.249.44.25";
    // private $port = "3306";
    // private $db_name = "u437250555_alvis";
    // private $username = "u437250555_alvis";
    // private $password = "47498650";

    private $server = "107.180.40.35";
    private $port = "3306";
    private $db_name = "GENUS_SCC";
    private $username = "genus_jph";
    private $password = "JP2953116*";

    // private $server = "localhost";
    // private $port = "3306";
    // private $db_name = "genus_scc";
    // private $username = "jeanpierre";
    // private $password = "JP2953116*";

    public $conn;

    public function getConnection(){

        $this->conn = null;
        $this->conn = new PDO("mysql:host=" . $this->server . ";port=" . $this->port. ";dbname=" . $this->db_name, $this->username, $this->password);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->conn->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
        // $this->conn->setAttribute(PDOStatement::fetchAll());
        $this->conn->exec("set names UTF8");
        set_time_limit(0);
        return $this->conn;
    }
}

?>