require('should');
var fs = require('fs');
var reap = require('../');

var html = fs.readFileSync(__dirname + '/news.html').toString();

describe('Great Reaper', function () {
	var reaper;

	beforeEach(function () {
		reaper = reap(html)
			.group('.group')
			.map({
				title: '.title',
				url: '.url'
			});
	});

	it('should crawl simple page', function (done) {
			reaper.then(function (results) {
				results.should.be.eql(
					[ { title: 'A', url: 'A-url' },
					  { title: 'B', url: 'B-url' },
					  { title: 'C', url: 'C-url' },
					  { title: 'D', url: 'D-url' },
					  { title: 'E', url: 'E-url' } ]
				);

				done();
			});
	});

	it('should limit results', function (done) {
		reaper
			.limit(2)
			.then(function (results) {
				results.should.be.eql(
					[ { title: 'A', url: 'A-url' },
					  { title: 'B', url: 'B-url' } ]
				);

				done();
			});
	});

	it('should map attributes as well', function (done) {
		reaper
			.map({
				attr: '.title@attr'
			})
			.limit(4)
			.then(function (results) {
				results.should.be.eql([ { attr: 'a' }, { attr: 'b' }, { attr: 'c' }, { attr: 'd' } ]);
				done();
			});
	});

	it('should filter results', function (done) {
		reaper
			.map({
				title: '.title',
				exclusive: '.title@exclusive'
			})
			.filter({
				exclusive: Boolean
			})
			.then(function (results) {
				results.should.be.eql([ { title: 'C', exclusive: 'true' } ]);
				done();
			});
	});
});
