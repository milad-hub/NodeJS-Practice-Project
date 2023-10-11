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

            const fetchData = await fetch(`${baseApiUrl}/${endpoint}`, requestOptions);

            if (fetchData.redirected && fetchData.url) {
                window.location.href = fetchData.url;
                return;
            }

            const responseData = await fetchData.json();
            responseData.status = fetchData.status;

            const toastType = fetchData.ok ? 'success' : 'error';
            displayToast(responseData.message, toastType);

            return responseData;
        } catch (error) {
            throw new AppError(`Error: ${error.message}`, statusCode.internalServerError);
        }
    }
}

export default HttpClient;