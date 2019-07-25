/**
 * Created by adib on 04/08/15.
 * Update: 2017-0821 @marco_caloch
 * By CUAED UNAM
 */


$(function () {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var eScormActividad = false; // true si se toma en cuenta como objetivo del scorm, false si no
    var intentosOM = 2; // 0 = ilimitados de la actividad
    var indiceActividad = 1; // indice incremental de acuerdo al numero de actividades dentro de un solo objeto, 1 si es unica
    var retroIndividual = true; //true : muestra la retro individual por reactivo// false no muestra nada
    var mostrarRetroFinal = true; //true : muestra la retro final // false no muestra nada
    var MAX_INTENTOS_POR_PREGUNTA = 1; //
    var MAX_PREGUNTAS = 3; // maximo de preguntas a visualizar
    var idActividad = "#opcionMultiple"; // 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var ATRIBUTO_CORRECTO = "data-correcta";
    var buenas = 0;
    var contestadas = 0;
    var totalPreguntasActividad = 0;
    var intentosRealizadosOM = 0;
    var seccionPreguntas = document.body.querySelector("#bancoPreguntas");
    var totalInicialBanco = seccionPreguntas.children.length;
    var listaInicialBanco = seccionPreguntas.children;
    var pActual = 0;
    var mezclarPreguntas = true;
    var mezclarRespuestas = true;

    if (mezclarPreguntas) {
        Array.prototype.forEach.call(listaInicialBanco, function () {//Revuelve todas las preguntas
            seccionPreguntas.appendChild(listaInicialBanco[Math.floor(Math.random() * totalInicialBanco)]);
        });
    }
    while (seccionPreguntas.children.length > MAX_PREGUNTAS) {
        seccionPreguntas.removeChild(seccionPreguntas.lastChild);
    }

    //
    var listaFinalPreguntas = seccionPreguntas.children;
    totalPreguntasActividad = listaFinalPreguntas.length;

    console.log("listaFinalPreguntas::" + totalPreguntasActividad);

    Array.prototype.forEach.call(listaFinalPreguntas, function (pregunta) {
        var contenedorOpciones = pregunta.querySelector(".opciones");
        var contenedorOpcionesHijos = contenedorOpciones.children;
        contenedorOpciones.intentos = 0;
        Array.prototype.forEach.call(contenedorOpcionesHijos, function (opcion) {
            opcion.addEventListener("click", alApretarOpcion);
            opcion.padre = contenedorOpciones;
        });
        if (mezclarRespuestas) {
            Array.prototype.forEach.call(contenedorOpcionesHijos, function (opcion, indice, opciones) {
                contenedorOpciones.appendChild(opciones[Math.floor(Math.random() * opciones.length)]);
            });
        }

    });

    //inicia actividad
    siguiente();
    ocultar_barra();
    $(idActividad + " button#btnOMReiniciar").hide();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    function alApretarOpcion(e) {
        var boton = e.currentTarget;
        desactivar(boton);
        if (boton.getAttribute(ATRIBUTO_CORRECTO) === "true") {
            boton.className += " bien";
            desactivarSet(boton.padre);
            boton.removeAttribute("disabled");
            buenas++;
            contestadas++;

            pActual++;
            mostrar_botones();
            if (retroIndividual) {
                mostrar_retro("correcta")
            }//fin if
            //revisar();
        } else {
            boton.className += " mal";
            if (++boton.padre.intentos >= MAX_INTENTOS_POR_PREGUNTA) {
                desactivarSet(boton.padre);
                //revisar();
                contestadas++;

                pActual++;
                mostrar_botones();
                if (retroIndividual) {
                    mostrar_retro("incorrecta")
                }//fin if
            }
        }//fin else
    }//

    function ocultar_elemento(elemento) {
        console.log("ocultando elementos");
        $("" + elemento).hide();
    }//fin 

    function siguiente() {
        ocultar_elemento("" + idActividad + " .retroCorrecta");
        ocultar_elemento("" + idActividad + " .retroIncorrecta");
        ocultar_elemento("" + idActividad + " .setPregunta");
        $("" + idActividad + " .setPregunta:eq(" + pActual + ")").show(); // mostramos el elemento actual a visualizar

    }//fin

    //muestra un elemento del arreglo de preguntas
    function mostrar_elemento(indice, arreglo) {
        arreglo.each(function (index) {
            //console.log("indice: "+indice + " de "+index);
            if (index == indice) { //si es el elemento deseado
                $(this).show(); //mostrar
                return true;
            }//fin if
        });
        return false;
    }//fin

    //agrega botones a la pregunta actual
    //sin parametros
    function mostrar_botones() {
        console.log("Actual:: " + pActual + " totalPreguntasActividad:" + totalPreguntasActividad);
        if (pActual >= totalPreguntasActividad) {
            mostrar_barra();
        } else {
            //console.log("mostrar boton "+pActual);
            //var setActual = $( ".setPregunta:eq("+pActual+")" );
            var setActual = listaFinalPreguntas[pActual - 1]; //obtenemos el elemento actual
            //console.log("pelemento: "+setActual);
            //setActual.innerHTML = "";
            var divBoton = document.createElement("button"); //creamos un elemento tipo boton
            divBoton.className = "btn btn-primary btnSiguiente";
            divBoton.innerHTML = "Siguiente";
            divBoton.addEventListener("click", siguiente); //agregamos un evento

            setActual.appendChild(divBoton); //agregamos el elemento con sus cacarteristicas a la pregunta   
        }//fin else


    }//fin mostrar_botones

    //oculta la barra de botones final
    function ocultar_barra() {
        $("" + idActividad + " .barraInferior").hide();

    }//fin 

    //muestra la barra de botones final
    function mostrar_barra() {
        $("" + idActividad + " .barraInferior").show();
        $(idActividad + " button#btnOMReiniciar").hide();
        $(idActividad + " button#btnOMRevisar").show();

    }//fin 

    //muestra la retroalimentacion individiual
    function mostrar_retro(mensaje) {
        var pos = pActual - 1;
        if (mensaje == "correcta") {
            $("" + idActividad + " .setPregunta:eq(" + pos + ") .retroCorrecta").show();
        } else {
            $("" + idActividad + " .setPregunta:eq(" + pos + ") .retroIncorrecta").show();
        }
    }//fin 

    function desactivar(boton) {
        boton.setAttribute("disabled", "disabled");
        boton.disabled = true;
        boton.removeEventListener("click", alApretarOpcion);
    }

    function desactivarSet(conjunto) {
        Array.prototype.forEach.call(conjunto.children, function (boton) {
            //console.log(boton);
            desactivar(boton);
            if (boton.getAttribute(ATRIBUTO_CORRECTO) === "true" && boton.className.indexOf("bien") < 0) {
                boton.className += " bienPerdida";
            }
        });
    }

    function revisar() {
        if (contestadas === MAX_PREGUNTAS) {
            // console.log("calcular");
            //retro.mostrar("Obtuviste: " + buenas + " de " + MAX_PREGUNTAS + ".");
            retroalimentar("Mensaje", "Obtuviste: " + buenas + " de " + MAX_PREGUNTAS + ".");
            console.log("Mensaje", "Obtuviste: " + buenas + " de " + MAX_PREGUNTAS + ".");
            //mostrar retroalimentacion final en texto
            if (mostrarRetroFinal) {
                retroFinalEvaluacion(buenas);
            }//

            intentosRealizadosOM++;//
            //deshabilitamos botonos si sobrepaso el limite de intentos
            if ((intentosOM > 0) && (intentosRealizadosOM >= intentosOM)) {
                $(idActividad + " button#btnOMReiniciar").hide();
                $(idActividad + " button#btnOMRevisar").hide();
            }//fin if
            else {
                $(idActividad + " button#btnOMReiniciar").show();
                $(idActividad + " button#btnOMRevisar").hide();
            }
            console.log(" intentos:" + intentosRealizadosOM + " de " + intentosOM);
            //save eScormActividad
            if (eScormActividad) {
                almacenarDatosSCORM(indiceActividad, buenas, MAX_PREGUNTAS);//
                enviarDatosSCORM();//
            }//fin eScormActividad 

        } else {//
            retroalimentar("AtenciÃ³n", "Por favor, seleccione todas sus respuestas." + contestadas + " " + MAX_PREGUNTAS);
        }//fin else


    }//fin revisar

    //acciones de boton revisar
    $("" + idActividad + " button#btnOMRevisar").button().click(function (event) {
        //console.log("Revisar");
        revisar();
    });

    //acciones de boton reiniciar
    $("" + idActividad + " button#btnOMReiniciar").button().click(function (event) {
        console.log("********************************************");
        console.log(" intentos:" + intentosRealizadosOM + " de " + intentosOM);
        if ((intentosOM > 0) && (intentosRealizadosOM <= intentosOM)) {

            $("" + idActividad + " .setPregunta .opciones .opcion").each(function (i, element) {
                $(element).attr('disabled', false);
                $(element).removeClass('bien');
                $(element).removeClass('mal');
                $(element).removeClass('bienPerdida');
            });

            $("" + idActividad + " .retroalimentacionFinal .retroRango").removeClass('verRetro').addClass('ocultarRetro');

            Array.prototype.forEach.call(listaFinalPreguntas, function (pregunta) {
                var contenedorOpciones = pregunta.querySelector(".opciones");
                var contenedorOpcionesHijos = contenedorOpciones.children;
                contenedorOpciones.intentos = 0;
                Array.prototype.forEach.call(contenedorOpcionesHijos, function (opcion) {
                    opcion.addEventListener("click", alApretarOpcion);
                    opcion.padre = contenedorOpciones;
                });
                if (mezclarRespuestas) {
                    Array.prototype.forEach.call(contenedorOpcionesHijos, function (opcion, indice, opciones) {
                        contenedorOpciones.appendChild(opciones[Math.floor(Math.random() * opciones.length)]);
                    });
                }
            });

            buenas = 0;
            contestadas = 0;
            pActual = 0;
            siguiente();//nueva pregunta
            ocultar_barra(); //barra oculta
            $("" + idActividad + " .btnSiguiente").remove();//
            $(idActividad + " button#btnOrRevisar").show();
            $(idActividad + " button#btnOrReiniciar").hide();
        }//fin if
        else {
            //retroalimentar("Alerta","Ha superado el nÃºmero de intentos permitidos."+intentosRealizadosOM+"::"+intentosOM);
            retroalimentar("AtenciÃ³n", "Has superado el nÃºmero de intentos permitidos.");
            //$("" + idActividad + " #btnOMRevisar").attr('disabled',true); //inhabilitamos boton de revisar
        }//fin else
        //
    });

    //muestra la retro final en caja dialog
    function retroFinalEvaluacion(calificacion) {
        var listaRetrosFinales = $(idActividad + " .retroalimentacionFinal .retroRango");
        console.log("----");
        listaRetrosFinales.each(function (i, element) {
            console.log(calificacion + " " + parseFloat($(element).attr("data-inicial")) + " " + parseFloat($(element).attr("data-final")));
            if (calificacion >= parseFloat($(element).attr("data-inicial")) && calificacion <= parseFloat($(element).attr("data-final"))) {
                //return i; // si coindice regresa el texto
                //$(element).removeClass('ocultarRetro').addClass('verRetro');
                $("#modalRetro").show();
                $("#modalRetro").html($(element).text());
            }//fin if  
        });

    }//fin retroFinalEvaluacion
//
});