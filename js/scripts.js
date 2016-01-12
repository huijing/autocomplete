var shows;
var showTitles = [];

function load_lookup (callback) {
    showTitles = [];

    $.ajax({
        url: 'https://api.viki.io/v4/search.json?c=b&per_page=5&with_people=true&with_paywall=1&app=100266a&t=1440586215',
    })
    .done(function(data) {
        shows = data;
        for (var i = 0; i < shows.length; i++) {
            showTitles.push(shows[i].tt);
        }

        // test if complete is a function
        // if (typeof(complete) === function) {
        // }


    })
    .complete(function () {
        callback.complete()    
    })
    .fail(function() {
        console.log("Data not loaded");
    });
}

function init_lookup () {
    var search_field = $('#searchField');
    var filtered_shows = [];
    var createList = false;
   

    search_field.on({
        keyup: function () {
            var search_val = $(this).val(); 
            var form = $('form');
            var results;
            var resultsList = $('#resultsList');
            resultsList.html('');

            // load my lookup via ajax
            load_lookup({

                complete: function() {
                    var results = showTitles.filter(function(item) {
                        if (item.indexOf(search_val) != -1) {
                            return true;
                        }
                        return item.search(RegExp(search_val, "i")) != -1;
                    });

                    if (createList === false) {
                        resultsList = $("<ul>", {
                            id: 'resultsList',
                            class: 'results-list'
                        });
                        form.after(resultsList);
                        createList = true;
                        resultsList.on("click", "li", function(){
                            search_field.val($(this).text());
                        });
                    }

                    for(var term in results){
                        resultsList.append("<li>" + results[term] + "</li>");
                    }

                    if (search_val.length === 0) {
                        resultsList.html('');
                    }
                }
            });
        },
    });
}

init_lookup();
