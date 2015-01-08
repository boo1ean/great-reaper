var Reaper = require('./lib/reaper');

function reap (target) {
	return new Reaper().pushTarget(target);
};

reap.t = require('./lib/transforms');

module.exports = reap;
