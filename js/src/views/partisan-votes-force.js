pg = pg || {};
pg.views = pg.views || {};


pg.views.PartisanVotesForce = Backbone.View.extend({

	initialize: function () {

		this.template = _.template($('#partisan-votes-force-template').html());

	},

	getColor: function (rep) {

		return rep.get('party') == "D" ? "#00F" : "#F00";

	},

	getRadius: function (rep) {

		return Math.sqrt(rep.get('seniority') * 16);

	},

	renderViz: function () {

		var votesWithPartyByMissed = function(e) {

			// Push nodes toward their designated focus.
			var k = 1 * e.alpha;

			zoo.models.forEach(function(o, i) {

				var foc, ofoc;

				if (! o.get('x')) { o.set('x', 0) }
				if (! o.get('y')) { o.set('y', 0) }

				o.get('party') == "D" ? foc = 0 : foc = 1;
				o.get('party') == "D" ? ofoc = 1 : ofoc = 0;

					// pull down for missed votes
				o.set('y', o.get('y') + (foci[foc].y - o.get('y') + (o.get('missed_votes_pct') * 40)) * k);

					// pull toward own party
				o.set('x', o.get('x') + (foci[foc].x - o.get('x')) * k * (o.get('votes_with_party_pct') / 100));

					// pull toward other party
				o.set('x', o.get('x') + (foci[ofoc].x - o.get('x')) * k * (1 - o.get('votes_with_party_pct') / 100) * 1.8);

				o.x = o.get('x');
				o.y = o.get('y');

			});

			vis.selectAll("circle")
				.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
		};


		var forcer = votesWithPartyByMissed;

		var zoo = this.model.get('members');

		var that = this;

		var w = 1400,
			h = 4000,
			i,
			sen,
			member,
			foci = [{x: 200, y: 100}, {x: 1200, y: 100}];

		var force = d3.layout.force()
			.nodes(zoo.models)
			.links([])
			.gravity(0)
			.size([w, h]);

		force.on("tick", forcer);

		$('#vis').remove();
		$('body').append('<svg id="vis" width="1400" height="4000"></svg>');

		var vis = d3.select('#vis');
		vis.selectAll('circle')
			.data(zoo.models)
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
				that.renderRepresentative(rep);
			})
			.on('mouseout', function (d, i) {
				that.hideRepresentative();
			});
//				.exit()
//				.attr('r', 1)
//				.attr('fill', '#eee');

		force.start();

	},

	renderRepresentative: function (rep) {

		pg.delgo.trigger("representative:selected", rep);

	},

	hideRepresentative: function () {
	},

	render: function () {

		this.$el.html(this.template());

		this.renderViz();

		return this;

	}

});
