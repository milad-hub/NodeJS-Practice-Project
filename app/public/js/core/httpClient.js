import AppError from '../shared/error.js';
import displayToast from '../shared/toast.js';
import { baseApiUrl, statusCode } from '../shared/config.js';

class HttpClient {
    async request(endpoint, method, header, data = null) {
        try {
            const requestOptions = {
                method: method,
                headers: {
                    ...header,
                    credentials: 'include'
                },
            };

            if (data) {
                requestOptions.body = JSON.stringify(data);
            }

            const response = await fetch(`${baseApiUrl}/${endpoint}`, requestOptions);

            if (response.redirected && response.url) {
                window.location.href = response.url;
                return;
            }

            const responseData = await response.json();

            if (!response.ok) {
                displayToast(responseData.message, 'error');
            }

            return responseData;
        } catch (error) {
            throw new AppError(`Error: ${error.message}`, statusCode.internalServerError);
        }
    }
}

export default HttpClient;