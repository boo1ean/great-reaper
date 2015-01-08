var ContentTarget = require('./content-target');
var UrlTarget = require('./url-target');
var Mapping = require('./mapping');
var _ = require('./utils');
var Promise = require('bluebird');
var cheerio = require('cheerio');

function Reaper () {
	this._targets = [];
	this._transforms = [];
	this._group = null;
	this._map = null;
	this._limit = -1;
}

Reaper.prototype.pushTarget = function pushTarget (target) {
	var target = buildTarget(target);
	this._targets.push(target);
	return this;
};

function buildTarget (target) {
	switch (true) {
		case _.isUrl(target):
			return new UrlTarget(target);

		case _.isString(target):
			return new ContentTarget(target);

		default: throw new Error('Invalid reaper target should be url or html string');
	}
}

Reaper.prototype.group = function group (group) {
	this._group = group;
	return this;
};

Reaper.prototype.map = function map (map) {
	if (!_.isObject(map)) {
		throw new Error('Map should be an object of "alias -> selector" pairs');
	}

	this._map = buildMappings(map);
	return this;
};

function buildMappings (map) {
	return _.mapValues(map, function (selector) {
		return new Mapping(selector);
	});
}

Reaper.prototype.transform = function transform (options) {
	var transform = buildTransform(options);
	this._transforms.push(transform);
	return this;
};

function buildTransform (transform) {
	switch (true) {
		case _.isFunction(transform):
			return transform;

		case _.isObject(transform):
			return buildObjectTransform(transform);

		default: throw new Error('Transform should be rules object or function');
	}
}

function buildObjectTransform (rules) {
	return function transformObject (item) {
		return _.mapValues(item, function (value, key) {
			if (rules[key]) {
				return rules[key](value);
			}

			return value;
		});
	}
}

Reaper.prototype.limit = function limit (limit) {
	this._limit = limit;
	return this;
};

Reaper.prototype.then = function then (cb) {
	var self = this;

	this._assertOptions();

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
					return _.mapValues(_.clone(self._map), function (mapping) {
						return mapping.resolve($(item));
					});
				};
			}
		}

		function finilizeProcessing (results) {
			limit();
			transform();
			normalize();

			resolve(Promise.method(cb)(results));

			function limit () {
				if (self._limit !== -1) {
					results = results.map(function limitCollection (collection) {
						return collection.slice(0, self._limit);
					});
				}
			}

			function transform () {
				if (self._transforms.length > 0) {
					self._transforms.forEach(function (transformItem) {
						results = results.map(function (collection) {
							return collection.map(transformItem);
						});
					});
				}
			}

			function normalize () {
				if (results.length === 1) {
					results = results[0];
				}
			}
		}
	});
}

Reaper.prototype._assertOptions = function assertOptions () {
	if (!this._group || !_.isString(this._group)) {
		throw new Error('Group is missing (expect css selector)');
	}

	if (!this._map || !_.isObject(this._map)) {
		throw new Error('Data map is missing (expect object of "alias -> selector" pairs)');
	}

	if (_.isNaN(this._limit)) {
		throw new Error('Limit should be number');
	}
};

module.exports = Reaper;
