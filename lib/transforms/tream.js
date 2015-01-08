function createTransform () {
	return function tream (string) {
		return string.trim();
	}
}

module.exports = createTransform;
