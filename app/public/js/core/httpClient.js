import AppError from '../shared/error.js';
import displayToast from '../shared/toast.js';
import { baseApiUrl, statusCode } from '../shared/config.js';

class HttpClient {

    async request(endpoint, method, header, data) {
        try {
            const response = await fetch(`${baseApiUrl}/${endpoint}`, {
                method: method,
                headers: {
                    ...header,
                    credentials: 'include'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (!response.ok) {
                displayToast(responseData.message, 'error');
                throw new AppError(responseData.message, response.status);
            }

            return responseData;
        } catch (error) {
            throw new AppError(`Error: ${error.message}`, statusCode.internalServerError);
        }
    }
}

export default HttpClient;