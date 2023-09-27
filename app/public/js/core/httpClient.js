import { baseApiUrl, statusCode } from '../shared/config.js';
import AppError from '../shared/error.js';

class HttpClient {

    async request(endpoint, method, header, data) {
        try {
            const response = await fetch(`${baseApiUrl}/${endpoint}`, {
                method: method,
                headers: header,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new AppError(`HTTP error! status: ${response.status}`, response.status);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw new AppError(`Error: ${error.message}`, statusCode.internalServerError);
        }
    }
}

export default HttpClient;