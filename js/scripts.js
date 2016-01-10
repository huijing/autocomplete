var shows;
var showTitles = [];

function load_lookup () {
    $.ajax({
        url: 'https://api.viki.io/v4/search.json?c=b&per_page=5&with_people=true&with_paywall=1&app=100266a&t=1440586215',
    })
    .done(function(data) {
        shows = data;
        for (var i = 0; i < shows.length; i++) {
            showTitles.push(shows[i].tt);
        }
        console.log(showTitles);
        init_lookup();
    })
    .fail(function() {
        console.log("Data not loaded");
    });
}

function init_lookup () {
    var search_field = $('#searchField');
    var filtered_shows = [];
    var cache = {};
    var createList = false;


    search_field.on({
        keyup: function () {
            var search_val = $(this).val(); 
            var form = $('form');
            var results;

            if (search_val in cache) {
                results = cache[search_val];
            } else {
                results = $.grep(showTitles, function(item) {
                    return item.search(RegExp(search_val, "i")) != -1;
                });
            }

            if (createList === false) {
                var list = $("<ul>", {
                    id: 'resultsList',
                    class: 'results-list'
                });
                form.after(list);
                createList = true;
                $('#resultsList').on("click", "li", function(){
                    search_field.val($(this).text());
                    $('#resultsList').empty();
                });
            } else {
                $("#resultsList").empty();
            }

            for(var term in results){
                $("#resultsList").append("<li>" + results[term] + "</li>");
            }

            if (search_val.length === 0) {
                $("#resultsList").empty();
            }
        },
    });
}

load_lookup();
