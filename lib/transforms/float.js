function createTransform (postfix) {
	return function addPostfix (string) {
		return parseFloat(string);
	}
}

module.exports = createTransform;
