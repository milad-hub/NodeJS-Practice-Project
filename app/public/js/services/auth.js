import HttpClient from '../core/httpClient.js';
import { httpMethods, httpHeaders } from '../shared/config.js';

class AuthServices {

    constructor() {
        this.httpClient = new HttpClient();
    }

    async loginUser(userData) {
        try {
            return await this.httpClient.request('auth/login', httpMethods.POST, httpHeaders.content.json, userData);
        } catch (error) {
            throw error;
        }
    }

    async registerUser(userData) {
        try {
            return await this.httpClient.request('auth/register', httpMethods.POST, httpHeaders.content.json, userData);
        } catch (error) {
            throw error;
        }
    }
}

export default AuthServices;
