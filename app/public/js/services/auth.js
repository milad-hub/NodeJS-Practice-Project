import HttpClient from '../core/httpClient.js';
import { httpMethods, httpHeaders } from '../shared/config.js';

class AuthServices {

    constructor() {
        this.httpClient = new HttpClient();
    }

    async registerUser(userData) {
        try {
            return await this.httpClient.request('auth', httpMethods.POST, httpHeaders.content.json, userData);
        } catch (error) {
            throw error;
        }
    }
}

export default AuthServices;
