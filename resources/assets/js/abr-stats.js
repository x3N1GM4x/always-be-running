//for generating statistics and Know the Meta integration

// gets the available data pack names from KtM
function getKTMDataPacks(callback) {
    $.ajax({
        url: "/api/ktmproxy/cardpoolnames",
        dataType: "json",
        async: true,
        success: function (data) {
            callback(data);
        }
    });
}

// update the popular IDs box on the homepage
//function updatePopularIds(packname) {
//    // update pack name
//    $('#hot-packname').html(packname.replace(new RegExp(' ', 'g'), '&nbsp;'));
//    // get runner
//    $.ajax({
//        url: "http://www.knowthemeta.com/JSON/Tournament/runner/" + packname,
//        dataType: "json",
//        async: true,
//        success: function (data) {
//            data.ids.sort(tournamentShorters.byAllStanding);
//            addCardStat('#hot-id-runner', data.ids[0], data.allStandingCount, data.topStandingCount);
//            // get corp
//            $.ajax({
//                url: "http://www.knowthemeta.com/JSON/Tournament/corp/" + packname,
//                dataType: "json",
//                async: true,
//                success: function (data) {
//                    data.ids.sort(tournamentShorters.byAllStanding);
//                    addCardStat('#hot-id-corp', data.ids[0], data.allStandingCount, data.topStandingCount);
//                }
//            });
//        }
//    });
//}

// for sorting tournament drilldown data from KtM
var tournamentShorters = {
    byTopStanding : function (a,b) {
        return (b.topStandingCount - a.topStandingCount);
    },
    byAllStanding : function (a,b) {
        return (b.allStandingCount - a.allStandingCount);
    },
    byAllDeck : function (a,b) {
        return (b.allDeckCount - a.allDeckCount);
    },
    byInTopDeck: function (a,b) {
        return (b.intopdecks - a.intopdecks);
    },
    byTopAllFractionStanding: function(a,b) {
        return (b.topStandingCount / b.allStandingCount - a.topStandingCount / a.allStandingCount)
    }
};

var idShorter = function (a,b) {
    if (b[0] === 'unknown') {
        return -1;
    }
    if (a[0] === 'unknown') {
        return 1;
    }
    return (b[1] - a[1]);
};

// adds card with statistics
//function addCardStat(element, card, allCount, topCount) {
//    $(element).append($('<a>', {
//        href: 'http://www.knowthemeta.com/Cards/' + card.title + '/'
//    }).append($('<img>', {
//        src: imageURL(card.title)
//    }), $('<div>', {
//        class: 'small-text',
//        text: card.title
//    })), $('<div>', {
//        class: 'small-text',
//        text: 'all: ' + percentageToString(card.allStandingCount / allCount) +
//        ' - top: ' + percentageToString(card.topStandingCount / topCount)
//    }));
//    $(element).removeClass('loader');
//}

// generates image URL for KtM
//function imageURL(title) {
//    return "http://www.knowthemeta.com/static/img/cards/netrunner-" +
//        title.toLowerCase().replace(new RegExp(" ", 'g'), "-").replace(new RegExp("[^a-z0-9.-]", 'g'), "") + ".png";
//}

// pie charts on IDs on tournament detail page
function drawEntryStats(data, side, element, playersNum, doingFaction) {
    var stat_results = [['ID', 'number of decks', 'faction']], unknown = -1;
    for (var i = 0, len = data.length; i < len; i++) {
        var found = false;
        for (var u = 1, len2 = stat_results.length; u < len2; u++) {
            if ((!doingFaction && shortenID(data[i][side+'_deck_identity_title']) === stat_results[u][0]) ||
                (doingFaction && data[i][side+'_deck_identity_faction'] === stat_results[u][0])) {
                    stat_results[u][1]++;
                    found = true;
                    break;
            }
        }
        if (!found) {
            if (!doingFaction) {
                stat_results.push([shortenID(data[i][side + '_deck_identity_title']), 1, data[i][side + '_deck_identity_faction']]);
                if (shortenID(data[i][side + '_deck_identity_title']) === 'unknown') {
                    unknown = stat_results.length - 1;
                }
            } else {
                stat_results.push([data[i][side + '_deck_identity_faction'], 1, data[i][side + '_deck_identity_faction']]);
                if (shortenID(data[i][side + '_deck_identity_title']) === 'unknown') {
                    unknown = stat_results.length - 1;
                }
            }
        }

    }

    // adding unknown IDs
    if (data.length < playersNum ) {
        if (unknown == -1) {
            stat_results.push(['unknown', playersNum - data.length, 'unknown']);
        } else {
            stat_results[unknown][1] = stat_results[unknown][1] + playersNum - data.length;
        }
    }

    stat_results.sort(idShorter);

    var slices = [];
    for (var u = 1, len2 = stat_results.length; u < len2; u++) {
        slices.push({color: factionCodeToColor(stat_results[u][2])});
    }

    var chartdata = google.visualization.arrayToDataTable(stat_results);

    var options = {
        chartArea: {left:0,top:0,width:'100%',height:'100%'},
        slices: slices
    };

    var chart = new google.visualization.PieChart(document.getElementById(element));

    chart.draw(chartdata, options);
}

// pie charts on IDs on tournament detail page
function drawResultStats(element, data, threshold) {
    var stat_results = [['ID', 'number of decks', 'faction']];
    for (var i = 0, len = data.length; i < len; i++) {
        stat_results.push([shortenID(data[i]['title']), data[i]['allStandingCount'], data[i]['faction']]);
    }

    var slices = [];
    for (var u = 1, len2 = stat_results.length; u < len2; u++) {
        slices.push({color: factionCodeToColor(stat_results[u][2])});
    }

    var chartdata = google.visualization.arrayToDataTable(stat_results);

    var options = {
        chartArea: {left:0,top:0,width:'100%',height:'100%'},
        slices: slices,
        sliceVisibilityThreshold: threshold
    };

    var chart = new google.visualization.PieChart(document.getElementById(element));

    chart.draw(chartdata, options);
}

// ID pie charts on Results page
function updateIdStats(packname) {
    // update pack name
    $('#stat-packname').html(packname.replace(new RegExp(' ', 'g'), '&nbsp;'));
    $('.stat-chart').addClass('hidden-xs-up');
    $('.stat-load').removeClass('hidden-xs-up');
    // get runner
    $.ajax({
        url: "/api/ktmproxy/cardpool/runner/" + packname,
        dataType: "json",
        async: true,
        success: function (data) {
            $('.stat-error').addClass('hidden-xs-up');
            $('.stat-chart').removeClass('hidden-xs-up');
            data.ids.sort(tournamentShorters.byAllStanding);
            runnerIDs = data.ids;
            drawResultStats('stat-chart-runner', data.ids, 0.04);
            // get corp
            $.ajax({
                url: "/api/ktmproxy/cardpool/corp/" + packname,
                dataType: "json",
                async: true,
                success: function (data) {
                    data.ids.sort(tournamentShorters.byAllStanding);
                    corpIDs = data.ids;
                    drawResultStats('stat-chart-corp', data.ids, 0.04);
                    $('.stat-chart').removeClass('hidden-xs-up');
                    $('.stat-load').addClass('hidden-xs-up');
                }
            });
        },
        // stat missing
        error: function () {
            $('.stat-error').removeClass('hidden-xs-up');
            $('.stat-load').addClass('hidden-xs-up');
        }
    });
}

// updates result page url with filters
function updateResultsURL(cardpool, type, country, format, videos, matchdata) {
    var newUrl = '/results?';
    if (cardpool.charAt(0) !== '-' ) {
        newUrl += 'cardpool=' + convertToURLString(cardpool) + '&';
    }
    if (type.charAt(0) !== '-') {
        newUrl += 'type=' + convertToURLString(type) + '&';
    }
    if (country.charAt(0) !== '-') {
        newUrl += 'country=' + convertToURLString(country) + '&';
    }
    if (format.charAt(0) !== '-') {
        newUrl += 'format=' + convertToURLString(format) + '&';
    }
    if (videos) {
        newUrl += 'videos=true&';
    }
    if (matchdata) {
        newUrl += 'matchdata=true';
    }
    window.history.pushState("Results", "Results - " + cardpool + " - " + type + " - " + country, newUrl);
}


// draws admin chart
function drawAdminChart(entryTypes) {
    // draw entry type chart
    var entryData = google.visualization.arrayToDataTable(entryTypes),
        entryChart = new google.visualization.PieChart(document.getElementById('chart-entry-types')),
        entryOptions = {
            width: 500,
            height: 200,
            chartArea: { top: 10, width:'100%', height:'90%' }
        };
    entryChart.draw(entryData, entryOptions);

    // draw weekly and geo charts
    $.ajax({
        url: '/api/adminstats',
        dataType: "json",
        async: true,
        success: function (data) {
            document.getElementById("stat-total-users").innerHTML = data.totalUsers;
            document.getElementById("stat-total-tournaments").innerHTML = data.totalTournaments;
            document.getElementById("stat-total-entries").innerHTML = data.totalEntries;
            var resultColumns = ['week', 'new entries', 'new tournaments', 'new users'],
                dataColumns = ['newEntriesByWeek', 'newTournamentsByWeek', 'newUsersByWeek'],
                chartData = google.visualization.arrayToDataTable(transformForAdminCharts(data, resultColumns, dataColumns)),
                geoData = google.visualization.arrayToDataTable(transformForAdminGeoCharts(data.countries)),
                options = {
                    curveType: 'function',
                    legend: { position: 'right' },
                    width: 900,
                    height: 500,
                    vAxis: { viewWindowMode:'explicit', viewWindow: {min: 0}},
                    hAxis: { title: 'weeks'}
                }, geoOptions = {
                    height: 500,
                    width: 900
                },
                weekChart = new google.visualization.LineChart(document.getElementById('chart1')),
                geoChart = new google.visualization.GeoChart(document.getElementById('chart2'));

            weekChart.draw(chartData, options);
            geoChart.draw(geoData, geoOptions);
            fillCountrySelector(data.countries);
        }
    });
}

// fills country selector options on Admin page, Stats tab
function fillCountrySelector(countries) {
    for (var i = 0; i < countries.length; i++) {
        $('#selector-country-stats').append($('<option>', {
            value: countries[i].location_country,
            text: countries[i].location_country + '(' + countries[i].total + ')'
        }));
    }
    getCountryStats();
}

// gets country statistics for Admin page, Stats tab
function getCountryStats() {
    var  selector = document.getElementById ("selector-country-stats"),
        country = selector.options[selector.selectedIndex].value;
    $.ajax({
        url: '/api/adminstats/' + country,
        dataType: "json",
        async: true,
        success: function (data) {
            var resultColumns1 = ['week', 'new', 'concluded'],
                resultColumns2 = ['week', 'imported', 'claims'],
                dataColums1 = ['newTournaments', 'concludedTournaments'],
                dataColums2 = ['importedEntries', 'claims'],
                chartData1 = google.visualization.arrayToDataTable(transformForAdminCharts(data, resultColumns1, dataColums1)),
                chartData2 = google.visualization.arrayToDataTable(transformForAdminCharts(data, resultColumns2, dataColums2)),
                options = {
                    legend: { position: 'top' },
                    width: 450,
                    height: 300,
                    chartArea: { width: 450, height: 250 },
                    vAxis: { viewWindowMode:'explicit', viewWindow: {min: 0}},
                    hAxis: { title: 'weeks'}
                },
                countryChart1 = new google.visualization.LineChart(document.getElementById ("chart3")),
                countryChart2 = new google.visualization.LineChart(document.getElementById ("chart4"));
            countryChart1.draw(chartData1, options);
            countryChart2.draw(chartData2, options);
        }
    });
}

// transforms data for drawing admin charts
function transformForAdminCharts(data, resultColumns, dataColumns) {
    var weeks = { firstweek: 999999, lastweek: 0}, result = [resultColumns];

    for (var u = 0; u < dataColumns.length; u++) {
        getStatRange(data[dataColumns[u]], weeks);
    }

    for (var i = weeks.firstweek; i <= weeks.lastweek; i++) {
        var resultrow = [formatWeekNumber(i)],
            sum = 0;

        for (var u = 0; u < dataColumns.length; u++) {
            var element = getStatData(data[dataColumns[u]], i);
            resultrow.push(element);
            sum += element;
        }

        if (sum > 0) {
            result.push(resultrow);
        }
    }
    return result;
}

function transformForAdminGeoCharts(data) {
    var result = [['country', 'tournaments']];
    for (var i= 0, len = data.length; i < len; i++) {
        result.push([data[i].location_country, parseInt(data[i].total)]);
    }
    return result;
}

// formats week numbers
function formatWeekNumber(week) {
    return "'" + week.toString().substr(2,2) + " #" + week.toString().substr(4,2);
}

// calculates first and last week for admin stats
function getStatRange(data, result) {
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].week > result.lastweek) {
            result.lastweek = data[i].week;
        }
        if (data[i].week < result.firstweek) {
            result.firstweek = data[i].week;
        }
    }
}
// returns admin stat data for desired week
function getStatData(data, week) {
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].week == week) {
            return parseInt(data[i].total);
        }
    }
    return 0;
}

// update filter settings for the Results page, to be concluded tournaments included
function filterResults() {
    resultsDataFiltered = resultsDataAll.slice();
    toBeConcludedFiltered = toBeConcludedAll.slice();

    var type = document.getElementById('tournament_type_id').value,
        cardpool = document.getElementById('cardpool').value,
        country = document.getElementById('location_country').value,
        format = document.getElementById('format').value,
        videos = document.getElementById('videos').checked,
        matchdata = document.getElementById('matchdata').checked;

    // type filtering
    if (type != '---') {
        filterTournamentData(resultsDataFiltered, 'type', type, '');
        filterTournamentData(toBeConcludedFiltered, 'type', type, '');
        $('#filter-type').addClass('active-filter');
    } else {
        $('#filter-type').removeClass('active-filter');
    }
    // country filtering
    if (country !== '---') {
        filterTournamentData(resultsDataFiltered, 'location_country', country);
        filterTournamentData(toBeConcludedFiltered, 'location_country', country);
        $('#filter-country').addClass('active-filter');
    } else {
        $('#filter-country').removeClass('active-filter');
    }
    // cardpool filtering
    if (cardpool != '---') {
        filterTournamentData(resultsDataFiltered, 'cardpool', cardpool);
        filterTournamentData(toBeConcludedFiltered, 'cardpool', cardpool);
        $('#filter-cardpool').addClass('active-filter');
    } else {
        $('#filter-cardpool').removeClass('active-filter');
    }
    // format filtering
    if (format != '---') {
        filterTournamentData(resultsDataFiltered, 'format', format);
        filterTournamentData(toBeConcludedFiltered, 'format', format);
        $('#filter-format').addClass('active-filter');
    } else {
        $('#filter-format').removeClass('active-filter');
    }
    // filter for videos
    if (videos) {
        filterTournamentData(resultsDataFiltered, 'videos', true);
        $('#filter-video').addClass('active-filter');
    } else {
        $('#filter-video').removeClass('active-filter');
    }
    // filter for match data
    if (matchdata) {
        filterTournamentData(resultsDataFiltered, 'matchdata', true);
        $('#filter-matchdata').addClass('active-filter');
    } else {
        $('#filter-matchdata').removeClass('active-filter');
    }
    // user's default country
    if (country === defaultCountry) {
        $('#label-default-country').removeClass('hidden-xs-up');
    } else {
        $('#label-default-country').addClass('hidden-xs-up');
    }

    $('#results').find('tbody').empty();

    updateTournamentTable('#results', ['title', 'date', 'location', 'cardpool', 'winner', 'players', 'claims'],
        'no tournaments to show', '', resultsDataFiltered);
    if ($('#to-be-concluded').length > 0) {
        $('#to-be-concluded').find('tbody').empty();
        updateTournamentTable('#to-be-concluded', ['title', 'date', 'location', 'cardpool', 'conclusion', 'players'],
            'no tournaments waiting for conclusion', '', toBeConcludedFiltered);
    }
    updateResultsURL(cardpool, type, country, format, videos, matchdata);

    // switch ID statistics
    if (currentPack !== cardpool) {
        currentPack = cardpool;
        // no filter is statistics for latest pack
        if (cardpool === '---') {
            cardpool = packlist[0];
        }
        // TODO: check if cardpool is in packlist
        updateIdStats(cardpool);
    }
}