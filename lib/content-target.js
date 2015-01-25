var Promise = require('bluebird');

function ContentTarget (html) {
	this.content = html;
}

ContentTarget.prototype.resolve = function resolve () {
	return Promise.resolve(this.content);
}

module.exports = ContentTarget;
