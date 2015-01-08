function createtTransform (prefix) {
	return function addPrefix (string) {
		return prefix + string;
	}
}

module.exports = createTransform;
