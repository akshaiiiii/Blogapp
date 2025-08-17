const { signup, login } = require('../controllers/authController');

module.exports = async (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    console.log("helloooo")
    req.on('end', () => {
        const data = JSON.parse(body);
        if (req.url === '/signup') {
            return signup(req, res, data);
        } else if (req.url === '/login') {
             return login(req, res, data);
        }
    });
};
