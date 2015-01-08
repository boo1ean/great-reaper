var _ = require('lodash');

var transforms = {
	trim: trim,
	prefix: prefix,
	postfix: postfix,
	lowercase: lowercase,
	int: parseInt,
	float: parseFloat
};

// Transforms

function trim (val) {
	return val.trim();
}

function prefix (prefix, val) {
	return prefix + val;
}

function postfix (postfix, val) {
	return val + postfix;
}

function lowercase (val) {
	return val.toLowerCase();
}

function createTransformChain () {
	var chain = [];

	function executeChain (val) {
		for (var i in chain) {
			val = chain[i](val);
		}

		return val;
	}

	for (var transformName in transforms) {
		executeChain[transformName] = (function (transformName) {
			return function createTransform () {
				var transform = bindTransformArgs(arguments, transforms[transformName]);
				chain.push(transform);
				return executeChain;
			}
		})(transformName)
	}

	function bindTransformArgs (args, transform) {
		switch (args.length) {
			case 1:
				transform = transform.bind(null, args[0]);
			break;

			case 2:
				transform = transform.bind(null, args[0], args[1]);
			break;
		}

		return transform;
	}

	return executeChain;
}

module.exports = createTransformChain;
