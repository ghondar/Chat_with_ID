jQuery(function($){
	window.io = io.connect();
var $messageForm = $("#sendMessage");
    var $message = $("#message");
    var $chat = $("#chat");

    $messageForm.submit(function(e){
        e.preventDefault();
        if($message.val()!=='') io.emit("sendMessage",$message.val());
        $message.val('');
    });

    io.on('newMessage', function(data){
        $chat.append(' - '+data.msg+"<br/>");
    });
});
$(document).ready(function()
{
    manageSessions.unset("login");
});
function animateScroll()
{
    var container = $('#cajita');
    container.animate({"scrollTop": $('#cajita')[0].scrollHeight}, "slow");
}
$(function()
{
    animateScroll();
    showModal("Formulario de inicio de sesión",renderForm());
    $("#username").focus();
    $("#containerSendMessages, #containerSendMessages input").on("focus click", function(e)
    {
        e.preventDefault();

        if(!manageSessions.get("login"))
        {
            showModal("Formulario de inicio de sesión",renderForm(), false);
        }

    });
    $("#loginBtn").submit(function(e)
    {
        e.preventDefault();
        if($(".username").val().length < 2)
        {
            $(".errorMsg").hide();
            $(".username").after("<div class='col-md-12 alert alert-danger errorMsg'>Debes introducir un nombre para acceder al chat.</div>").focus();
            return;
        }
        manageSessions.set("login", $(".username").val());
        io.emit("loginUser", manageSessions.get("login"));
        $("#formModal").modal("hide");
        animateScroll();
        $("#containerSendMessages").focus();
    });
    io.on("userInUse", function()
    {
        $("#formModal").modal("show");
        manageSessions.unset("login");
        $(".errorMsg").hide();
        $(".username").after("<div class='col-md-12 alert alert-danger errorMsg'>El usuario que intenta escoge está en uso.</div>").focus();
        return;
    });
    io.on("refreshChat", function(data)
    {	
        if(data.informacion == "conectado")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-info'>" + data.mensaje + "</p>");
        }
        else if(data.informacion == "desconectado")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-danger'>" + data.mensaje + "</p>");
        }
        else if(data.informacion == "msg")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-warning'>" + data.mensaje + "</p>");
        }
        else if(data.informacion == "yo")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-success'>" + data.mensaje + "</p>");
        }
        animateScroll();
    });
    io.on("updateSidebarUsers", function(usersOnline)
    {
        $("#chatUsers").html("");
        if(!isEmptyObject(usersOnline))
        {
            $.each(usersOnline, function(key, val)
            {
                $("#chatUsers").append("<p class='col-md-12 alert-info'>" + key + "</p>");
            })
        }
    });
    io.on("newUser", function (data){
    	$("#chatUsers").html("");
    	debugger;
    	if(!isEmptyObject(data))
        {            
            $("#chatUsers").append("<p class='col-md-12 alert-info'>" + data.usuario + "</p>");
            
        }
    });
    $('#sendMsg').submit(function(e)
    {
        e.preventDefault();
        var message = $(".message").val();
        if(message.length > 2)
        {
            io.emit("addNewMessage", message);
            $(".message").val("");
        }
        else
        {
            showModal("Error formulario","<p class='alert alert-danger'>El mensaje debe ser de al menos dos carácteres.</p>", "true");
        }
        animateScroll();
    });

});
function showModal(title,message,showClose)
{
    console.log(showClose);
    $("h2.title-modal").text(title).css({"text-align":"center"});
    $("p.formModal").html(message);
    if(showClose == "true")
    {
        $(".modal-footer").html('<a data-dismiss="modal" aria-hidden="true" class="btn btn-danger">Cerrar</a>');
        $("#formModal").modal({show:true});
    }
    else
    {
        $("#formModal").modal({show:true, backdrop: 'static', keyboard: true });
    }
}
function renderForm()
{
    var html = "";
    html += '<form id="loginBtn">';
    html += '<div class="form-group" id="formLogin">';
    html += '<input type="text" id="username" class="form-control username" placeholder="Introduce un nombre de usuario">';
    html += '</div>';
    html += '<button type="submit" class="btn btn-primary btn-large">Entrar</button>';
    html += '</form>';

    return html;
}
var manageSessions = {
    get: function(key) {
        return sessionStorage.getItem(key);
    },
    set: function(key, val) {
        return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
        return sessionStorage.removeItem(key);
    }
};
function isEmptyObject(obj)
{
    var name;
    for(name in obj)
    {
        return false;
    }
    return true;
}