document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // we will not be doing anything!!
}

$(document).on("pageshow", function () {
    $.mobile.loading("hide");
    $("body").removeClass('ui-disabled');
    // Adicionado ante delay
	FastClick.attach(document.body);
	//
	if ($("#contactsList").length == 1) {
        $("body").addClass('ui-disabled').css("background", "#000");
        $.mobile.loading("show");
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        var filter = ["displayName", "phoneNumbers"];
        navigator.contacts.find(filter, onSuccess, onError, options);
    } else if ($("#addContact").length == 1) {
        bindAddContactEvents();
    }
});

function onSuccess(contacts) {
    var html = "";
    for (var i = 0; i < contacts.length; i++) {
        if ($.trim(contacts[i].displayName).length != 0 || $.trim(contacts[i].nickName).length != 0) {
            html += '<li>';
            html += '<h2>' + contacts[i].displayName ? contacts[i].displayName : contacts[i].nickName + '</h2>';
            if (contacts[i].phoneNumbers) {
                html += '<ul class="innerlsv" data-role="listview" data-inset="true">';
                html += '<li><h3>Numeros</h3></li>';
                for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
                    html += "<li>Tipo: " + contacts[i].phoneNumbers[j].type + "<br/>" +
                        "Numero: " + contacts[i].phoneNumbers[j].value + "<br/>" +
                        "Favorito: " + contacts[i].phoneNumbers[j].pref + "</li>";
                }
                html += "</ul>";
            }
            html += '</li>';
        }
    }
    if (contacts.length === 0) {
        html = '<li data-role="collapsible" data-iconpos="right" data-shadow="false" data-corners="false">';
        html += '<h2>Nenhum Contatos</h2>';
        html += '<label>Nenhum contato listado</label>';
        html += '</li>';
    }
    $("#contactsList").html(html);
    $("#contactsList").listview().listview('refresh');
    $(".innerlsv").listview().listview('refresh');
    $.mobile.loading("hide");
    $("body").removeClass('ui-disabled');
}

function onError(contactError) {
    alert('Oops Algo deu errado!');
    $.mobile.loading("hide");
    $("body").removeClass('ui-disabled');
}

function bindAddContactEvents() {
    $("#addContact").on("click", function () {
        var name = $.trim($("#name").val()),
            number = $.trim($("#number").val());

        if (name.length == 0) {
            alert("Por favor entre com um Nome valido");
            return false;
        }

        if (number.length == 0) {
            alert("Por favor entre com um Numero valido");
            return false;
        }

        var contact = navigator.contacts.create();
        contact.displayName = name;
        contact.nickname = name;

        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', number, true);
        contact.phoneNumbers = phoneNumbers;

        contact.save(createSuccess, createError);
    });
}

function createSuccess() {
    alert("Contato adicionado com sucesso");
    resetPage();
}

function createError() {
    alert("Oops Algo deu errado! Por favor tente mais tarde.");
}

function resetPage() {
    $("#name").val("");
    $("#number").val("");
}