pg = pg || {};
pg.maths = pg.maths || {};

pg.maths.force = {

    votesWithPartyByMissed: {
        id: "votesWithPartyByMissed",
        name: "Loyalty and Attendance",
        label: "Plots members with their percentage votes with party on x, and missed votes percentage on y",
        algorithm: function(o, i) {

            var foc, ofoc,
                k = 0.5;  // linear velocity
            //  k = 1 * this.e.alpha; // decreasing velocity (easing);

            if (! o.get('x')) { o.set('x', 0); }
            if (! o.get('y')) { o.set('y', 0); }

            o.get('party') == "D" ? foc = 0 : foc = 1;
            o.get('party') == "D" ? ofoc = 1 : ofoc = 0;

                // pull down for missed votes
            o.set('y', o.get('y') + (this.foci[foc].y - o.get('y') + (o.get('missed_votes_pct') * 40)) * k);


            if (o.get('votes_with_party_pct') > 0.01) {
                    // pull toward own party
                o.set('x', o.get('x') + (this.foci[foc].x - o.get('x')) * k * (o.get('votes_with_party_pct') / 100));

                    // pull toward other party
                o.set('x', o.get('x') + (this.foci[ofoc].x - o.get('x')) * k * (1 - o.get('votes_with_party_pct') / 100) * 1);
            } else {
                o.set('x', o.get('x') + (this.foci[foc].x - o.get('x')) * k);
            }

            o.x = o.get('x');
            o.y = o.get('y');

        },
        links: function () {
            return [];
        }
    },

    idealPoint: {
        id:"idealPoint",
        name: "Ideal Point",
        label: "Plots members with their percentage votes with party on x, and missed votes percentage on y",
        algorithm: function(o, i) {

            var foc, ofoc,
                k = 0.5;  // linear velocity
            //  k = 1 * this.e.alpha; // decreasing velocity (easing);

            if (! o.get('x')) { o.set('x', 0); }
            if (! o.get('y')) { o.set('y', 0); }

            var goalX = this.width / 2 * o.get('ideal_point') + this.width / 2;

            o.set('x', (o.get('x') - this.width / 2 * o.get('ideal_point') + this.width / 2 ) * k);


            o.x = o.get('x');
            o.y = o.get('y');
        },
        links: function () {
            return [];
        }
    },

    accurateRepresentation: {
        id: "accurateRepresentation",
        name: "Accurate",
        lable: "What really happens",
        algorithm: function (o, i) {
            return;
        },
        links: function () {
            return [];
        }
    }

};
