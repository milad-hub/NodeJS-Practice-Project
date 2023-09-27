import HttpClient from '../core/httpClient.js';
import { httpMethods, httpHeaders } from '../shared/config.js';

class UserServices {

    constructor() {
        this.httpClient = new HttpClient();
    }

    async createUser(userData) {
        try {
            return await this.httpClient.request('user', httpMethods.POST, httpHeaders.content.json, userData);
        } catch (error) {
            throw error;
        }
    }
}

export default UserServices;
