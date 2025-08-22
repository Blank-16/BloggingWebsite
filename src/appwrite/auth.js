import config from "../config/config.js"
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite Service :: createAccount :: error", error);
            throw error; // Re-throw to handle in UI
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("Appwrite Service :: login :: error", error);
            throw error; // Re-throw to handle in UI
        }
    }

    async getCurrentUser() {
        try {
            // First check if there's an active session
            const session = await this.account.getSession('current');
            if (session) {
                // If session exists, get user account
                return await this.account.get();
            }
            return null;
        } catch (error) {
            // Handle specific error cases
            if (error.code === 401 || error.type === 'general_unauthorized_scope') {
                // User not authenticated or missing scope
                console.log("Appwrite service :: getCurrentUser :: User not authenticated");
                return null;
            }
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    // Alternative method to check if user is logged in
    async isLoggedIn() {
        try {
            const session = await this.account.getSession('current');
            return !!session;
        } catch (error) {
            return false;
        }
    }

    // Get user info only if authenticated
    async getUserIfAuthenticated() {
        try {
            const isAuthenticated = await this.isLoggedIn();
            if (isAuthenticated) {
                return await this.account.get();
            }
            return null;
        } catch (error) {
            console.log("Appwrite service :: getUserIfAuthenticated :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
            return { success: true };
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;