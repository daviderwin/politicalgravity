pg = pg || {};
pg.views = pg.views || {};


pg.views.Representative = Backbone.View.extend({

	initialize: function () {

		this.template = _.template($('#representative-template').html());

	},

	render: function () {

		this.$el.html(this.template(this.model.toJSON()));
		return this;

	},

	close: function () {
		this.unbind();
		this.remove();
	}

});