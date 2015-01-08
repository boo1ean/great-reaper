var ContentTarget = require('./content-target');
var UrlTarget = require('./url-target');
var _ = require('./utils');
var Promise = require('bluebird');
var cheerio = require('cheerio');

function Reaper () {
	this._targets = [];
	this._group = null;
	this._map = null;
}

Reaper.prototype.pushTarget = function pushTarget (target) {
	var target = Reaper.buildTarget(target);
	this._targets.push(target);
	return this;
};

Reaper.prototype.group = function group (group) {
	this._group = group;
	return this;
};

Reaper.prototype.map = function map (map) {
	if (!_.isObject(map)) {
		throw new Error('Map should be an object of "alias -> selector" pairs');
	}

	this._map = map;
	return this;
};

Reaper.prototype.assertOptions = function assertOptions () {
	if (!this._group || !_.isString(this._group)) {
		throw new Error('Group is missing (expect css selector)');
	}

	if (!this._map || !_.isObject(this._map)) {
		throw new Error('Data map is missing (expect object of "alias -> selector" pairs)');
	}
};

Reaper.prototype.then = function then (cb) {
	var self = this;

	this.assertOptions();

	return new Promise(function (resolve, reject) {
		return Promise.all(mapTargets())
			.then(finilizeProcessing)
			.catch(reject);

		function mapTargets () {
			return self._targets.map(function (target) {
				return target.resolve().then(processContent);
			});

			function processContent (content) {
				var $ = cheerio.load(content);
				var items = $(self._group);

				return items.get().map(mapItem);

				function mapItem (item) {
					return _.mapValues(_.clone(self._map), function (selector) {
						return $(item).find(selector).text();
					});
				};
			}
		}

		function finilizeProcessing (results) {
			if (results.length === 1) {
				results = results[0];
			}

			resolve(Promise.method(cb)(results));
		}
	});
}

Reaper.buildTarget = function buildTarget (target) {
	switch (true) {
		case _.isUrl(target):
			return new UrlTarget(target);

		case _.isString(target):
			return new ContentTarget(target);

		default: throw new Error('Invalid reaper target should be url or html string');
	}
};

module.exports = Reaper;
