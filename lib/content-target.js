var Promise = require('bluebird');

function ContentTarget (html) {
	this.content = html;
}

ContentTarget.prototype.resolve = function resolve () {
	return Promise.resolve(html);
}

module.exports = ContentTarget;
