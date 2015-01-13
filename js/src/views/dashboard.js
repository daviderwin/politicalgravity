pg = pg || {};
pg.views = pg.views || {};

pg.views.Dashboard = Backbone.View.extend({

    initialize: function () {

        _.bindAll(this, 'onClickAlgorithm', 'renderRepresentativeDetails', 'clearRepresentativeDetails');

        this.template = _.template($('#dashboard-template').html());
        this.algorithmTemplate = _.template($('#algorithm-template').html());

        this.listenTo(pg.delgo, "representative:selected", this.renderRepresentativeDetails);
        this.listenTo(pg.delgo, "representative:deselect", this.clearRepresentativeDetails);

    },

    events: {
        "click .algorithm": "onClickAlgorithm"
    },

    onClickAlgorithm: function (e) {

        var el = e.currentTarget;
        this.setAlgorithm(el);

    },

    setAlgorithm: function(selectedEl) {

        this.$('.algorithm').removeClass('selected');
        $(selectedEl).addClass('selected');

        pg.delgo.trigger("viewer:setForceAlgorithm", $(selectedEl).data('algorithm'));

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

    renderAlgorithms: function () {

        var $algorithmsEl = this.$('.algorithms');

        $algorithmsEl.empty();

        for (var i in pg.maths.force) {
            var force = pg.maths.force[i];

            $algorithmEl = $(this.algorithmTemplate(force));
            $.data($algorithmEl, 'algorithm', i);
            $algorithmsEl.append($algorithmEl);

            if (! this.$('.algorithms .selected').length) {
                this.setAlgorithm($algorithmEl);
            }

        }

    },

    render: function () {

        this.$el.html(this.template());

        this.clearRepresentativeDetails();

        this.renderAlgorithms();

        return this;

    },

    close: function () {
        this.unbind();
        this.remove();
    }

});