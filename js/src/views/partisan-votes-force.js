pg = pg || {};
pg.views = pg.views || {};


pg.views.PartisanVotesForce = Backbone.View.extend({

    initialize: function () {

        _.bindAll(this, 'votesWithPartyByMissed');

        this.template = _.template($('#partisan-votes-force-template').html());

    },

    getColor: function (rep) {

        return rep.get('party') == "D" ? "#00F" : "#F00";

    },

    getRadius: function (rep) {

        return Math.sqrt(rep.get('seniority') * 16);

    },

    layout: _.throttle(function () {

        this.width = this.$el.width();
        this.height = this.$el.height();

        this.foci = [{x: 40, y: 40}, {x: this.width - 40, y: 40}];

        this.force = d3.layout.force()
            .nodes(this.model.get('members').models)
            .links([])
            .gravity(0)
            .size([this.width, this.height])
            .on("tick", this.votesWithPartyByMissed);

        // restart force to reset alpha, which may be used for easing
        this.force.stop();
        this.force.start();

    }, 250),

    votesWithPartyByMissed: function(e) {

        console.log('force');

        // Push nodes toward their designated focus.
        var that = this,
            k = 0.5;  // linear velocity
//            k = 1 * e.alpha; // decreasing velocity (easing)
    
        this.model.get('members').models.forEach(function(o, i) {

            var foc, ofoc;

            if (! o.get('x')) { o.set('x', 0); }
            if (! o.get('y')) { o.set('y', 0); }

            o.get('party') == "D" ? foc = 0 : foc = 1;
            o.get('party') == "D" ? ofoc = 1 : ofoc = 0;

                // pull down for missed votes
            o.set('y', o.get('y') + (that.foci[foc].y - o.get('y') + (o.get('missed_votes_pct') * 40)) * k);

                // pull toward own party
            o.set('x', o.get('x') + (that.foci[foc].x - o.get('x')) * k * (o.get('votes_with_party_pct') / 100));

                // pull toward other party
            o.set('x', o.get('x') + (that.foci[ofoc].x - o.get('x')) * k * (1 - o.get('votes_with_party_pct') / 100) * 1);

            o.x = o.get('x');
            o.y = o.get('y');

        });

        this.vis.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

    },

    renderViz: function () {

        var that = this;

        this.vis.selectAll('circle')
            .data(this.model.get('members').models)
            .enter()
                .append('circle')
                .attr('r', this.getRadius)
                .attr('cx', function (d, i) {
                    return (i % 12) * 50 + 25;
                })
                .attr('cy', function (d, i) {
                    return Math.floor(i / 12) * 50 + 25;
                })
                .attr('fill', that.getColor)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('partyKey', function (d, i) {
                    return d.party == "D" ? 0 : 1;
                })
                .text(function (d, i) {
                    return d.get('last_name') + ', ' + d.get('first_name') + ' (' + d.get('party') + ')';
                })
                .on('mouseover', function (rep) {
                    that.selectRep(rep);
                })
                .on('mouseout', function (d, i) {
                    that.deselectRep();
                });
//              .exit()
//              .attr('r', 1)
//              .attr('fill', '#eee');

        this.layout();

    },

    selectRep: function (rep) {

        pg.delgo.trigger("representative:selected", rep);

    },

    deselectRep: function (rep) {

    },

    render: function () {

        this.$el.html(this.template());

        this.vis = d3.select('.vis');

        this.renderViz();

        return this;

    }

});
