const baseUrl = String(process.env.BASE_URL);

const jwtSecretKey = String(process.env.JWT_SECRET_KEY);
const cryptoSecretKey = String(process.env.CYPTO_SECRET_KEY);

module.exports = {
    baseUrl,
    jwtSecretKey,
    cryptoSecretKey
};