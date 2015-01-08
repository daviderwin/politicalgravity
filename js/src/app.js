
(function () {

	pg.delgo = _.extend(Backbone.Events, {});

    new pg.views.Main({
        el: $('.container')
    }).render();

}());
