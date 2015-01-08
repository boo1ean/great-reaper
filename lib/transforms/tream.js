function createTreamer () {
	return function tream (string) {
		return string.trim();
	}
}

module.exports = createTreamer;
