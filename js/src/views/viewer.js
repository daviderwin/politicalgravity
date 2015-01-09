pg = pg || {};
pg.views = pg.views || {};


pg.views.Viewer = Backbone.View.extend({


	initialize: function () {

		_.bindAll(this, 'layout');

		this.template = _.template($('#viewer-template').html());

		$(window).on('resize', this.layout);
		//setInterval(this.layout, 100);

	},

	layout: function () {

		this.$el.find('.vis').css({
			height: this.$el.height(),
			width: this.$el.width()
		});

		this.visView.layout();

	},

	renderVisualzation: function () {

		this.visView = new pg.views.PartisanVotesForce({
		    model: this.model
		});

		this.$el.append(this.visView.el);

		this.layout();

		this.visView.render();

	},

	render: function () {

		this.$el.html(this.template(this.model.toJSON()));

		this.renderVisualzation();

		return this;

	},

	close: function () {
		this.unbind();
		this.remove();
	}

});