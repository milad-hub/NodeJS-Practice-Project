const { handleAsyncErrors } = require('../helpers/handlers/error');
const { decodeToken, isUserActive } = require('../services/auth');
const { getUserRoleFromRedisCache } = require('../services/redis');

const authGuard = (allowedRoles) => {
    return handleAsyncErrors(async (req, res, next) => {
        const token = req.cookies?.token;

        if (!token) {
            return res.redirect('/auth');
        }

        try {
            const user = decodeToken(token);
            const isValidatedUser = await isUserActive(user.id);

            if (!isValidatedUser) {
                return res.redirect('/auth');
            }

            const userRoles = await getUserRoleFromRedisCache(user.id);

            if (!allowedRoles.includes(userRoles) || !userRoles) {
                return res.redirect('/auth/403');
            }

            next();

        } catch (error) {
            return res.redirect('/auth');
        }
    });
};

module.exports = authGuard;