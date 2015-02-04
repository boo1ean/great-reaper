var Promise = require('bluebird');
var request = Promise.promisify(require("request"));

function UrlTarget (url) {
	this.url = url;
}

UrlTarget.prototype.resolve = function () {
	return request(this.url).spread(function (res, body) {
		return body;
	});
};

module.exports = UrlTarget;
