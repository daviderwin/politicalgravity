(function () {

    window.pg = window.pg || {};
    window.pg.models = window.pg.models || {};

    window.pg.models.Congress = Backbone.Model.extend({


        initialize: function () {

            this.senateMembersSvc = _.template("http://api.nytimes.com/svc/politics/v3/us/legislative/congress/<%= congress %>/<%= zoo %>/members.json?api-key=" + pg.config.congressApiKey);
            this.senateMembersSvc = _.template("data/us/legislative/congress/<%= congress %>/<%= zoo %>/members.json");

        },

        load: function (congress, zoo) {
            this.set('congress', congress);
            this.set('zoo', zoo);

            this.fetch();

            return this;
        },

        url: function () {
            return this.senateMembersSvc({congress: this.get('congress'), zoo: this.get('zoo')});
        },

        parse: function (data) {

            var results = data.results[0];

            this.set('members', new pg.collections.Members(results.members));

        }

    });


})();
