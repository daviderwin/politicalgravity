(function () {

    window.pg = window.pg || {};
    window.pg.models = window.pg.models || {};

    window.pg.models.Member = Backbone.Model.extend({


        initialize: function () {
        
        },



        parse: function (data) {

        }

        /*
            showRep: function (data) {

        if (data.contents && data.contents.results && data.contents.results[0]) {
            data = data.contents.results[0];
        } else {
            return ;
        }

        var missedVoteTotals = 0, 
            withPartyTotals = 0;
        data.career_bills_cosponsored = 0;
        data.career_bills_sponsored = 0;

        for (var i = 0; i < data.roles.length; i++) {
            if (typeof data.roles[i].bills_cosponsored != "undefined")
                data.career_bills_cosponsored += data.roles[i].bills_cosponsored * 1;
            if (typeof data.roles[i].bills_sponsored != "undefined")
                data.career_bills_sponsored += data.roles[i].bills_sponsored * 1;
            if (typeof data.roles[i].missed_votes_pct != "undefined")
                missedVoteTotals += data.roles[i].missed_votes_pct * 1;     
            if (typeof data.roles[i].votes_with_party_pct != "undefined")
                withPartyTotals += data.roles[i].votes_with_party_pct * 1;      
        };

        data.career_missed_votes_pct = Math.round(missedVoteTotals / data.roles.length * 100) / 100;
        data.career_votes_with_party_pct = Math.round(withPartyTotals / data.roles.length * 100) / 100;

        data.state = data.roles[0].state;

        console.log(data);

        var repCard = tmpl('repTemplate', data);

        folks.empty();
        folks.append(repCard);

    },
*/

    });

    window.pg.collections = window.pg.collections || {};

    window.pg.collections.Members = Backbone.Collection.extend({
        model: pg.models.Member
    });


})();
