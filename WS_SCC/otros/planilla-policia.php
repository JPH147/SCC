<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <form action="https://web.policia.gob.pe/direcfin/planillavirtual/login.aspx" method="post" name="planilla">
            <?php
                header("Access-Control-Allow-Origin: *");
                header("Access-Control-Allow-Methods: GET");

                $codigo = $_GET['prcodofin'] ;
                $dni = $_GET['prdni'] ;
                $codigo_form = 'ctl00$ContentPlaceHolder1$TxtCodofin' ;
                $dni_form = 'ctl00$ContentPlaceHolder1$TxtDni' ;

                echo "<input type=hidden name=".$dni_form." value=".$dni.">" ;
                echo "<input type=hidden name=".$codigo_form." value=".$codigo.">" ;

                $viewState = "/wEPDwULLTE4MjY2NTIwOTRkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBSRjdGwwMCRDb250ZW50UGxhY2VIb2xkZXIxJENtZEFjZXB0YXKtvbEi+t6PaIR9GdtJFbp/qrG/nfKonZ50GyQNiOsp2w==" ;
                $eventValidation = "/wEdAAR/TYl0FlT3s+s0J3IFwBNbYcNlAiQTQxy8nNiEDKCFKbDQsk7kPEnOCDnVntnorHTdll5ONmnTUQcgAElqwGadKhWPU0AL+Kv/fDfboEMUYaX+c723BT660knFUE9d/54=" ;

                echo '<input type=hidden name="__VIEWSTATE" value='.$viewState.'>' ;
                echo '<input type=hidden name="__EVENTVALIDATION" value='.$eventValidation.'>' ;
            ?>
            <input type="hidden" name="__LASTFOCUS" value="" />
            <input type="hidden" name="__EVENTTARGET" value="" />
            <input type="hidden" name="__EVENTARGUMENT" value="" />
            <input type="hidden" name="__VIEWSTATEGENERATOR" value="D902F79F" />
            
            <input type="hidden" name="ctl00$ContentPlaceHolder1$CmdAceptar.x" value="57" />
            <input type="hidden" name="ctl00$ContentPlaceHolder1$CmdAceptar.y" value="16" />
            <input type="submit" value="Buscar" />
        </form>
        <script>
            window.onload = function(){
                document.forms['planilla'].submit();
            }
        </script>
    </body>
</html>
