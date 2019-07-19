
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// A $( document ).ready() block.
$(document).ready(function () {
    $(".js-hidden").addClass("d-none");
    $(".feedback-toggler").click(function () {
    $id = $(this).attr("id");
    $idClass = "#sec-" + $id;
    if ($($idClass).hasClass('d-none')) {
        $($idClass).removeClass("d-none");
        $($idClass).addClass("d-inline");
    } else {
        $($idClass).removeClass("d-inline");
        $($idClass).addClass("d-none");
    }
});


})