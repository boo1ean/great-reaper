function createTransform (postfix) {
	return function addPostfix (string) {
		return string.toLowerCase();
	}
}

module.exports = createTransform;
