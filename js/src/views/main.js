pg = pg || {};
pg.views = pg.views || {};


pg.views.Main = Backbone.View.extend({

    initialize: function () {

        _.bindAll(this, 'renderVis');

        this.template = _.template($('#main-template').html());

        this.congressModel = new pg.models.Congress().load(113, 'house');
        this.congressModel.on('sync', this.renderVis);

    },

    renderVis: function () {

        if (this.visView) {
            this.visView.close();
        }

        this.visView = new pg.views.PartisanVotesForce({
            model: this.congressModel
        }).render();

        this.$el.append(this.visView.el);

    },

    renderDashboard: function () {

        this.dashboardView = new pg.views.Dashboard().render();
        this.$el.append(this.dashboardView.el);

    },

    render: function () {

        this.$el.html(this.template());

        this.renderDashboard();

        return this;

    },

    close: function () {
        this.unbind();
        this.remove();
    }

});