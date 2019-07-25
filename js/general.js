/* Creado: 20170825 @marco_caloch
 * By CUAED UNAM
 * */
    ///////////////////////////////////////////////////////////////////////////////
    var eScorm = false; //estado; si la actividad es SCORM = true
    var totalLimite = 10; // limite de recursos en la pagina (OPCIONAL)
    var totalEvaluaciones = 1; // numero de evaluaciones (objetivos) en el scorm
    var modoEvaluacion = "REACTIVOS"; // REACTIVOS | PROMEDIO   // REACTIVOS = total de buenas del total de reactivos obtenidos;  PROMEDIO = se promedia los subtotales de cada actividad y luego el general
    var calificacionMaxima = 10; // se utiliza en el modoEvaluacion = PROMEDIO. Es el puntaje bajo el cual se promedia
    ///////////////////////////////////////////////////////////////////////////////
    var evaluacionesContestadas = 0; // numero de actividades activas -- se obtiene por funcion del num de indice del arreglo de recativos que no son 0
    var totalReactivosSCORM = []; // guarda el total de reactivos por indice de actividad
    var calificacionSCORM = []; // guarda las calificaciones por indice de actividad (total aciertos)
    var titulosRetroalimentacion = ["AtenciÃ³n","Resultado"];
// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );

    if(eScorm){
        window.addEventListener("load", function(){
            var conexion = conectividadSCORM.conectarYComenzar();
            console.log("declaracionObjetivos.js -> ", conexion);
            if(conectividadSCORM.crearObjetivos(totalEvaluaciones)){    //Aqui va el nÃºmero de actividades
                conectividadSCORM.salvar();
                console.log("objetivos creados");
            }
        });

        // AsignaciÃ³n de las las funciones a cuando se va a cerrar la pÃ¡gina. //
        window.onunload = terminarScorm;
        window.onbeforeunload = terminarScorm;

    }//fin if

    //
    iniciarEntorno(); //inicializa variables y eventos de la uapa

});



    //
    function iniciarEntorno(){
        //codigo SCORM 
        if(eScorm){
            if(conectividadSCORM !== undefined){
                if(window.document.readyState === "complete"){
                    window.addEventListener("load", function(){
                        iniciarSCORM();
                    });
                    console.log("ya habÃ­a cargado");
                } else {
                    console.log("agregÃ³ listener");
                    window.addEventListener("load", function(){
                        iniciarSCORM();
                    });
                }
            }//
            iniciarArreglo(totalReactivosSCORM);// inicamos arreglo con valores en 0
            iniciarArreglo(calificacionSCORM);// inicamos arreglo con valores en 0
        }//fin eScorm
        
    }//fin iniciarEntorno
    
    
    //funcion que inicializa los objetivos del scorm
    // sin parametros
    function iniciarSCORM(){
        //iniciamos todos los objetivos del scorm
        for(var idObj=1; idObj<= totalEvaluaciones; idObj++){
            conectividadSCORM.iniciarObjetivo(idObj);
            conectividadSCORM.salvar();
        }//fin for

        console.log("Objetivos SCORM [iniciado]");
    }//fin iniciarSCORM

    //funcion que envia los datos a guardar
    //sin aprametros
    function enviarDatosSCORM(){

        evaluacionesContestadas = numIndicesActivos(totalReactivosSCORM);//cuantas evaluaciones han sido calificadas
            console.log(calificacionSCORM);
            console.log("Total objetivos activos: " +evaluacionesContestadas);

           // console.log(objetivoInicialScorm+" buenasT:"+intContadorBuenas+ " reactivosT:"+intTotalReactivos);
            if(conectividadSCORM !== undefined){

                //salvamos los datos de todas las evaluaciones
                for(var idObj=1; idObj<= totalEvaluaciones; idObj++){
                    conectividadSCORM.calificarObjetivo(idObj, calificacionSCORM[idObj], totalReactivosSCORM[idObj], 0);
                    conectividadSCORM.finalizarObjetivo(idObj); //Mismo nÃºmero que en el paso anterior
                   
                    //console.log("DATOS ALAMCENADOS: " +intContadorBuenas+ " "+intTotalReactivos);
                }//fin for

                
                 // salvamos los datos
                conectividadSCORM.salvar(); 
                console.log("Datos objetivos Salvados");
                 // si todas las evaluaciones han sido contestadasterminar el scorm
                 // se guarda suma total de reactivos y suma total de calificacion
                if(evaluacionesContestadas >= totalEvaluaciones){
                    //conectividadSCORM.terminar();
                    if(modoEvaluacion == "REACTIVOS"){ //evaluacion por reactivos
                        
                        var intContadorBuenas = totalDatos(calificacionSCORM); // (total aciertos)
                        var intTotalReactivos = totalDatos(totalReactivosSCORM); // total reactivos
                        //
                        conectividadSCORM.calificar(intContadorBuenas, intTotalReactivos);
                    }else{
                        //evaluacion por promedio
                        //promediar datos totales del scorm (metodo desconocido)
                        //se obtienen los promedios parciales de las actividades y luego se promedian entre el total e evaluaciones
                        var calificacionfinal = calificacionFinalPromedio();
                        //
                        conectividadSCORM.calificar(calificacionfinal, calificacionMaxima);
                        console.log("Datos Calificacion Salvados "+calificacionfinal + " de "+calificacionMaxima);
                    }//fin else
                    //
                    conectividadSCORM.completar();
                    conectividadSCORM.salvar();
                    console.log("Actividad salvada");
                }//fin if
            }//fin --   conectividad 
    }//fin enviarDatosSCORM

    function terminarScorm(){
        //codigo SCORM 
        if(eScorm){
            enviarDatosSCORM();
            conectividadSCORM.terminar();
            console.log("Actividad terminada");
        }//fin if
    }

    //Devuelve la suma de los datos almacenados en el arreglo
    //arregloDatos = es el arreglo con datos
    function totalDatos(arregloDatos){
        var valor = 0;
        for(var ci = 0; ci <arregloDatos.length; ci ++){
            valor += arregloDatos[ci];
        }//fin for
        return valor;
    }//fin 

    //Inicializa los valores del arreglo en cero
    //arregloDatos = es el arreglo a llenar
    function iniciarArreglo(arregloDatos){
        for(var ci = 0; ci < totalLimite; ci++){
            arregloDatos[ci] = 0;
        }//fin for
    }//fin 

    //devuelve el promedio de calificacion de n actividades
    //sin parametros
    function calificacionFinalPromedio(){
        var final = 0;
        for(var idObj=1; idObj<= totalEvaluaciones; idObj++){
            final += ((calificacionMaxima / totalReactivosSCORM[idObj]) * calificacionSCORM[idObj]);
        }//fin for
        final = Math.round(final/totalEvaluaciones);
        return final;
    }

    //almacena en los arreglos temporales los datos de las evaluaciones antes de enviarlas a guardar
    // indice = es el numero de objetivo en el scorm
    // buenas = total de respuestas correctas
    // total = nuemro de reactivos de la actividad
    function almacenarDatosSCORM(indice, buenas, total){
        totalReactivosSCORM[indice]= total;
        calificacionSCORM[indice] = buenas;
        console.log(indice+" buenas:"+buenas+ " total:"+total);
    }//

    //Devuelve el numero de indices/Objetivos que tienen datos validos
    //arregloDatos = es el arreglo que contiene los valores
    function numIndicesActivos(arregloDatos){
        var valor = 0;
        for(var ci = 0; ci <arregloDatos.length; ci ++){
            if(arregloDatos[ci] > 0){
                valor++;
            }//fin if
        }//fin for
        return valor;
    }

    /***********************************************************************/
    // A. 
    /***********************************************************************/
    function retroalimentar(titulo, cadena){
        var clase_mensaje = "";
        var mensaje = "";
        var icono = "";
        var tituloTexto = "";
        switch(titulo){
            case "Mensaje": //clase_mensaje=" alert-info"; 
                            icono = "../img/icon-info.png";
                            clase_mensaje = "";
                            tituloTexto = titulosRetroalimentacion[1];
                            break;
            case "Alerta":  //clase_mensaje=" alert-danger"; 
                            icono = "../img/icon-attention.png"; 
                            clase_mensaje = "";
                            tituloTexto = titulosRetroalimentacion[0];
                            break;
            default: clase_mensaje=" alert-warning"; 
                     icono = "glyphicon-comment";
        }

        

        mensaje += '<div class="alert '+clase_mensaje+' text-center" role="alert">';
        mensaje += ' <img src="img/'+icono +'" width="96" /> <br /> <h2>'+ tituloTexto +' </h2> ';
        mensaje += '<br /> '+cadena+' </div>';

        $("#dialog #retroPopUpMensaje").html(mensaje);
    }//
    //
    function quitarAcentos(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
        // remove accents, swap Ã± for n, etc
        var from = "Ã Ã¡Ã¤Ã¢Ã¨Ã©Ã«ÃªÃ¬Ã­Ã¯Ã®Ã²Ã³Ã¶Ã´Ã¹ÃºÃ¼Ã»Ã±Ã§Â·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
        return str;
    }//
