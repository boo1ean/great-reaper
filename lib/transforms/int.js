function createTransform (postfix) {
	return function addPostfix (string) {
		return parseInt(string);
	}
}

module.exports = createTransform;
