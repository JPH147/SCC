<hmtl>
    <head>
        <script>
            function ocultarMostrar(form){
                var display =document.getElementById(form).style.display;
                if(display==''){
                    document.getElementById(form).style.display='none';
                }else{
                    document.getElementById(form).style.display='';
                }
            }
        </script>
    </head>
    <body>
        <h1>WS_SCC</h1>
        <h2>Usuario</h2>
        <h2><a href ="../WS_SCC/usuario/read.php">Listar Usuario</a></h2>
        <h2><a href ="#" onclick="javascript:ocultarMostrar('crearUsuario')">Crear Usuario</a></h2>
        <form action= "../WS_SCC/usuario/create.php" id="crearUsuario" style="display:none" method="post">
            <table border = "1">
                <tr>
                    <td>Nombre de Usuario:</td>
                    <td><input type="text" name="usr_nombre"/></td>
                </tr>
                <tr>
                    <td>Usuario:</td>
                    <td><input type="text" name="usr_usuario"/></td>
                </tr>
                <tr>
                    <td>Clave de Usuario:</td>
                    <td><input type="text" name="usr_clave"/></td>
                </tr>
                <tr>
                    <td>Fecha de Creación de Usuario:</td>
                    <td><input type="date" name="usr_fechacreacion" /></td>
                </tr>
                <tr>
                    <td>Fecha de Ultimo Logueo:</td>
                    <td><input type="date" name="usr_ultimologueo"/></td>
                </tr>
                <tr>
                    <td>Estado de Usuario:</td>
                    <td><input type="number" name="usr_estado"/></td>
                </tr>
                <tr>
                    <td>Pefil:</td>
                    <td><input type="number" name="idperfil"/></td>
                </tr>
            </table>
        <input type="submit" value="Crear Usuario">
        </form> 
        <h2><a href ="#" onclick="javascript:ocultarMostrar('ListarUsuarioxId')">Listar Usuario Por ID</a></h2>
        <form action= "../WS_SCC/usuario/readxId.php" id="ListarUsuarioxId" style="display:none" method="get">
            <table border = "1">
                <tr>
                    <td>Id de Usuario:</td>
                    <td><input type="number" name="idusuario"/></td>
                </tr>
            </table>
        <input type="submit" value="Buscar Usuario">
        </form>

        <h2><a href ="#" onclick="javascript:ocultarMostrar('Login')">Login</a></h2>
        <form action= "../WS_SCC/usuario/login.php" id="Login" style="display:none" method="post">
            <table border = "1">
                <tr>
                    <td>Usuario:</td>
                    <td><input type="text" name="usr_usuario"/></td>
                </tr>
                <tr>
                    <td>Clave:</td>
                    <td><input type="text" name="usr_clave"/></td>
                </tr>
            </table>
        <input type="submit" value="Login">
        </form>


        <h2>Perfil</h2>
        <h2><a href ="../WS_SCC/perfil/read.php">Listar Pefiles</a></h2>
        <h2><a href ="#" onclick="javascript:ocultarMostrar('crearPerfil')">Crear Perfil</a></h2>
        <form action= "../WS_SCC/perfil/create.php" id="crearPerfil" style="display:none" method="post">
            <table border = "1">
                <tr>
                    <td>Nombre de Perfil:</td>
                    <td><input type="text" name="prf_nombre"/></td>
                </tr>
            </table>
        <input type="submit" value="Crear Perfil">
        </form> 

    </body>
</html>