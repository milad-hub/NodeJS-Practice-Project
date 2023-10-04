import HttpClient from '../core/httpClient.js';
import { httpMethods, httpHeaders } from '../shared/config.js';

class AuthServices {

    constructor() {
        this.httpClient = new HttpClient();
    }

    async loginUser(userData) {
        try {
            const response = await this.httpClient.request('auth/login', httpMethods.POST, httpHeaders.content.json, userData);

            const token = response.token;
            document.cookie = `token=${token}; path=/`;

            // if (response.data) {
            //     const token = 'Bearer ' + response.data;
            //     localStorage.setItem('token', token);
            // }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async registerUser(userData) {
        try {
            const response = await this.httpClient.request('auth/register', httpMethods.POST, httpHeaders.content.json, userData);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default AuthServices;
