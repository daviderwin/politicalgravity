pg = pg || {};
pg.views = pg.views || {};


pg.views.Force = Backbone.View.extend({

    initialize: function () {

        _.bindAll(this, 'forcer', 'setForceAlgorithm');

        this.template = _.template($('#partisan-votes-force-template').html());

        this.loadAlgorithms();

        this.listenTo(pg.delgo, "viewer:setForceAlgorithm", this.setForceAlgorithm);

    },

    loadAlgorithms: function () {

        this.algorithms = [];

        for (var i in pg.maths.force) {
            var force = pg.maths.force[i];

            this.algorithms[i] = $.proxy(force.algorithm, this);
            this.forceAlgorithm = this.algorithms[i];

        }


    },

    getColor: function (rep) {

        return rep.get('party') == "D" ? "#00F" : "#F00";

    },

    getRadius: function (rep) {

        return Math.sqrt(rep.get('seniority') * 16);

    },

    setForceAlgorithm: function(al) {

        if (this.algorithms[al]) {
            this.forceAlgorithm = this.algorithms[al];
        }

        this.layout();

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
            .on("tick", this.forcer);

        // restart force to reset alpha, which may be used for easing
        this.force.stop();
        this.force.start();

    }, 250),


    forcer: function (e) {

        var that = this;

        // cache e for use in forceAlgorithm
        this.e = e;

        this.model.get('members').models.forEach(this.forceAlgorithm);

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
