pg = pg || {};
pg.views = pg.views || {};


pg.views.Dashboard = Backbone.View.extend({

	initialize: function () {

		_.bindAll(this, 'renderRepresentativeDetails', 'clearRepresentativeDetails');

		this.template = _.template($('#dashboard-template').html());

		this.listenTo(pg.delgo, "representative:selected", this.renderRepresentativeDetails);
		this.listenTo(pg.delgo, "representative:deselect", this.clearRepresentativeDetails);

	},

	renderRepresentativeDetails: function (rep) {

		if (this.representative) {
			this.representative.close();
		}

		this.representative = new pg.views.Representative({
			model: rep
		}).render();

		this.$el.find('.rep').html(this.representative.el);

	},

	clearRepresentativeDetails: function (rep) {

		if (! this.representative) {
			return null;
		}

		this.representative.close();
		this.representative = null;

	},

	render: function () {

		this.$el.html(this.template());

		this.clearRepresentativeDetails();

		return this;

	},

	close: function () {
		this.unbind();
		this.remove();
	}

});