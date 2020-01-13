$(document).ready(function() {

    var template_html= $("#todo-template").html();
    var template_function = Handlebars.compile(template_html);
    var url_api = "http://157.230.17.132:3013/todos/";

    stampa_todos();

    $("#new-todo-button").click(function(){
        var new_todo_text = $("#new-todo-text").val().trim();
        if(new_todo_text.length > 0){
            // resetto input
            $("#new-todo-text").val("");
            crea_todo(new_todo_text);
        } else {
            alert("Inserisci il testo del todo!")
        };
    });
    $("#todo-list").on("click", ".delete-todo", function(){
        // recupero l id dell item da cancellare
        var delete_todo_id = $(this).parent().attr("data-todo_id");
        cancella_todo(delete_todo_id);
    })
    // intercetto il click sulla matita
    $("#todo-list").on("click", ".edit-todo", function(){
        $(".todo-text").removeClass("hidden");
        $(".edit_todo_input").removeClass("active");
        $(".edit-todo").removeClass("hidden");
        $(".save-todo").removeClass("active");
        // recupero il tag li contenitore
        var todo_li = $(this).parent();
        // // recupero l id dell item da modificare
        // var edit_todo_id = todo_li.attr("data-todo_id");

        // nascondo il testo e mostro l input con il testo già valorizzato
        todo_li.find(".todo-text").addClass("hidden");
        todo_li.find(".edit-todo-input").addClass("active");
        // nascondo la matita e mostro il floppy
        todo_li.find(".edit-todo").addClass("hidden");
        todo_li.find(".save-todo").addClass("active");

    });
    // intercetto il click sul floppy
    $("#todo-list").on("click", ".save-todo", function(){
        // recupero il tag li contenitore
        var todo_li = $(this).parent();
        var edit_todo_text = todo_li.find(".edit-todo-input").val();
        // recupero l id dell item da modificare
        var edit_todo_id = todo_li.attr("data-todo_id");
        modifica_todo(edit_todo_id, edit_todo_text);

    });

    function stampa_todos(){
        // resetto la lista
        $("#todo-list").empty();

        $.ajax({
            "url": url_api,
            "method": "GET",
            "success": function(data) {
                var todos = data;
                for (var i = 0; i < todos.length; i++) {
                    var todo_corrente = todos[i];
                    var testo_todo = todo_corrente.text;
                    var id_todo = todo_corrente.id;

                    var template_data = {
                        todo_id: id_todo,
                        todo_text: testo_todo
                    };
                    var html_todo = template_function(template_data);
                    $("#todo-list").append(html_todo);
                }
            },
            "error": function() {
                alert("errore");
            }
        });
    };

    function crea_todo(testo_nuovo_todo){
        // faccio una chiamata ajax con post per salvare il nuovo // TODO:
        $.ajax({
            "url": url_api,
            "method": "POST",
            "data": {
                "text":testo_nuovo_todo
            },
            "success": function(data) {
                stampa_todos();

            },
            "error": function() {
                alert("errore");
            }
        });
    };
    function cancella_todo(todo_id){
        // chiamata ajax per cancellare
        $.ajax({
            "url": url_api + todo_id,
            "method": "DELETE",
            "success": function(data) {
                stampa_todos();

            },
            "error": function() {
                alert("errore");
            }
        });
    };
    function modifica_todo(todo_id, testo_todo){
        $.ajax({
            "url": url_api + todo_id,
            "method": "PUT",
            "data": {
                "text":testo_todo
            },
            "success": function(data) {
                stampa_todos();

            },
            "error": function() {
                alert("errore");
            }
        });
    }

});
