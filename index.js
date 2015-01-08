var Reaper = require('./lib/reaper');

function reap (target) {
	return new Reaper().pushTarget(target);
};

module.exports = reap;
