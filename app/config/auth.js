const jwtSecretKey = String(process.env.JWT_SECRET_KEY);
const cyptoSecretKey = String(process.env.CYPTO_SECRET_KEY);

module.exports = {
    jwtSecretKey,
    cyptoSecretKey
};