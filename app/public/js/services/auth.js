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

    async logoutUser() {
        try {
            const response = await this.httpClient.request('auth/logout', httpMethods.GET, httpHeaders.content.json);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(userData) {
        try {
            const response = await this.httpClient.request('auth/forgotPassword', httpMethods.POST, httpHeaders.content.json, userData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(userData) {
        try {
            const response = await this.httpClient.request('auth/resetPassword', httpMethods.PATCH, httpHeaders.content.json, userData);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default AuthServices;
