function createTransform (postfix) {
	return function addPostfix (string) {
		return string + postfix;
	}
}

module.exports = createTransform;