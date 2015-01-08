

pg = (function () {

	var campaignApiKey = '742c9f0cc515f1f1661258be8dfa71fc:12:60820948';
	var congressApiKey = '67de46ebf25b9b197ce9ce6a50dde1ce:2:60820948';


	var senateSvc = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/112/senate/members.json?api-key=" + congressApiKey;
	var houseSvc= "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/112/house/members.json?api-key=" + congressApiKey;
	var senate = {};


	var CongressModel = (function () {

		var campaignApiKey = '742c9f0cc515f1f1661258be8dfa71fc:12:60820948',
			congressApiKey = '67de46ebf25b9b197ce9ce6a50dde1ce:2:60820948',
			senateMembersSvc = _.template("http://api.nytimes.com/svc/politics/v3/us/legislative/congress/<%= congress %>/<%= zoo %>/members.json?api-key=" + congressApiKey);

		var getSenateMemberSvcUrl = function (congress, zoo) {

			return campaignApiKey({congress: congress, zoo: zoo});

		};

		var getSenateMembers = function (congress, zoo) {

			console.log(getSenateMemberSvcUrl(congress, zoo));

		};

		return {
			getSenateMembers: getSenateMembers
		};

	}());



	CongressModel.getSenateMembers(2014, 'house');



	var folks = $('#folks');

	var getData = function (path, svc, callback) {
		$.getJSON("proxy.php?url=" + svc, callback);
	};

	var getRep = function (url, callback) {
		getData(url + "?api-key=" + congressApiKey, callback);
	};

	var opt;
	for (var i = 112; i > 0; i --) {
		opt = $('<option value="' + i + '">' + i + 'th</option>');
		$('folkChooser').append(opt);
	}

	$("#zooChooser").on('change', function (e) {
		pickCongress($("#zooChooser").val(), $("#folkChooser").val());
	});

	$("#folkChooser").on('change', function (e) {
		pickCongress($("#zooChooser").val(), $("#folkChooser").val());
	});

	var pickCongress = function (zoo, congress) {
		getCongress(zoo, congress);
	};



	var getCongress = function (zoo, congress) {

		var url = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/" + congress + "/" + zoo + "/members.json?api-key=" + congressApiKey;

		getData(url, function (data) {

			var votesWithPartyByMissed = function(e) {

				// Push nodes toward their designated focus.
				var k = 0.1 * e.alpha;

				console.log(foci);

				senate.members.forEach(function(o, i) {

					var foc, ofoc;

					o.party == "D" ? foc = 0 : foc = 1;
					o.party == "D" ? ofoc = 1 : ofoc = 0;

						// pull down for missed votes
					o.y += (foci[foc].y - o.y + (o.missed_votes_pct * 40)) * k;

						// pull toward own party
					o.x += (foci[foc].x - o.x) * k * (o.votes_with_party_pct / 100);

						// pull toward other party
					o.x += (foci[ofoc].x - o.x) * k * (1 - o.votes_with_party_pct / 100) * 1.8;

				});

				vis.selectAll("circle")
					.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			};


			var forcer = votesWithPartyByMissed;

			senate = data.contents.results[0];

			var w = 1400,
				h = 4000,
				i,
				sen,
				member,
				foci = [{x: 200, y: 100}, {x: 1200, y: 100}];

			var force = d3.layout.force()
				.nodes(senate.members)
				.links([])
				.gravity(0)
				.size([w, h]);

			force.on("tick", forcer);

			$('#vis').remove();
			$('body').append('<svg id="vis" width="1400" height="4000"></svg>');

			var vis = d3.select('#vis');
			vis.selectAll('circle')
				.data(senate.members)
				.enter()
				.append('circle')
				.attr('r', function (d, i) {
					return d.seniority;
				})
				.attr('cx', function (d, i) {
					return (i % 12) * 50 + 25;
				})
				.attr('cy', function (d, i) {
					return Math.floor(i / 12) * 50 + 25;
				})
				.attr('fill', function (d, i) {
					return d.party == "D" ? "#00F" : "#F00";
				})
				.attr('stroke', 'black')
				.attr('stroke-width', 2)
				.attr('partyKey', function (d, i) {
					return d.party == "D" ? 0 : 1;
				})
				.text(function (d, i) {
					return d.last_name + ', ' + d.first_name + ' (' + d.party + ')';
				})
				.on('mouseover', function (d, i) {
					getRep(d.api_uri, function (data) {
						showRep(data);
					});
				})
				.on('mouseout', function (d, i) {
					hideRep();
				});
//				.exit()
//				.attr('r', 1)
//				.attr('fill', '#eee');

			force.start();

		});

	};

	var hideRep = function () {
		folks.empty();
	};

	var showRep = function (data) {

		if (data.contents && data.contents.results && data.contents.results[0]) {
			data = data.contents.results[0];
		} else {
			return ;
		}

		var missedVoteTotals = 0, 
			withPartyTotals = 0;
		data.career_bills_cosponsored = 0;
		data.career_bills_sponsored = 0;

		for (var i = 0; i < data.roles.length; i++) {
			if (typeof data.roles[i].bills_cosponsored != "undefined")
				data.career_bills_cosponsored += data.roles[i].bills_cosponsored * 1;
			if (typeof data.roles[i].bills_sponsored != "undefined")
				data.career_bills_sponsored += data.roles[i].bills_sponsored * 1;
			if (typeof data.roles[i].missed_votes_pct != "undefined")
				missedVoteTotals += data.roles[i].missed_votes_pct * 1;		
			if (typeof data.roles[i].votes_with_party_pct != "undefined")
				withPartyTotals += data.roles[i].votes_with_party_pct * 1;		
		};

		data.career_missed_votes_pct = Math.round(missedVoteTotals / data.roles.length * 100) / 100;
		data.career_votes_with_party_pct = Math.round(withPartyTotals / data.roles.length * 100) / 100;

		data.state = data.roles[0].state;

		console.log(data);

		var repCard = tmpl('repTemplate', data);

		folks.empty();
		folks.append(repCard);

	}

	pickCongress('senate', 112);

}());



// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();
