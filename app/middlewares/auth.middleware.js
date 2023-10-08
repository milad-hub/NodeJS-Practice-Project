const { handleAsyncErrors } = require('../helpers/handlers/error');
const { decodeToken, isUserActive } = require('../services/auth');

const authGuard = handleAsyncErrors(async (req, res, next) => {

    const token = req.cookies?.token;

    if (!token) {
        res.redirect('/auth');
    }

    try {
        const user = decodeToken(token);
        const isValidatedUser = await isUserActive(user.id);

        isValidatedUser ? next() : res.redirect('/auth');

    } catch (error) {
        res.redirect('/auth');
    }
});

module.exports = authGuard;