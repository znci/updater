const { cached } = require("../..");

module.exports = {
	method: 'GET',
	path: '/api/allrepos',
	handler: (req, res) => {
		res.json(cached);
	}
}