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

        this.visView = new pg.views.Viewer({
            model: this.congressModel,
            el: this.$('.viewer')
        }).render();

        this.renderDashboard();

    },

    renderDashboard: function () {

        this.dashboardView = new pg.views.Dashboard().render();
        this.$el.append(this.dashboardView.el);

    },

    render: function () {

        this.$el.html(this.template());

        return this;

    },

    close: function () {
        this.unbind();
        this.remove();
    }

});