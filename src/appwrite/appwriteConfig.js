import config from '../config/config.js';
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {

        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                ID.unique(),
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite service CreatePost error", error);
        }
    }

    async updatePost({ slug, title, content, featuredImage, status, userId }) {
        try {
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite service UpdatePost error", error);

        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite service DeletePost error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite error getPost error", error);
            return false;

        }
    }

    async getPosts(queries = [Query.equal('status', 'active')]) {
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite error in GetPosts error", error);
            return false;
        }
    }



    // file upload methods

    async uploadFile(file, ownerUserId) {
        try {
            if (!file) {
                console.error("Appwrite service UploadFile error: No file provided to upload");
                return false;
            }
            if (!config.appwriteBucketId || config.appwriteBucketId === 'undefined') {
                console.error("Appwrite service UploadFile error: Missing or invalid appwriteBucketId. Check your .env VITE_APPWRITE_BUCKET_ID and restart the dev server.");
                return false;
            }
            const permissions = [
                Permission.read(Role.any()),
                ownerUserId ? Permission.write(Role.user(ownerUserId)) : Permission.write(Role.any())
            ]
            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file,
                permissions
            )
        } catch (error) {
            console.log("Appwrite service UploadFile error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite service DeleteFile error", error);
            return false;

        }
    }

    getFilePreview(fileId) {
        try {
            if (!fileId) {
                console.error('getFilePreview: No fileId provided');
                return null;
            }
            if (!config.appwriteBucketId) {
                console.error('getFilePreview: No bucket ID configured');
                return null;
            }
            // Use getFileDownload instead of getFilePreview to avoid transformation errors
            const result = this.bucket.getFileDownload(
                config.appwriteBucketId,
                fileId
            );
            return result;
        } catch (error) {
            console.error('getFilePreview error:', error);
            return null;
        }
    }
}

const service = new Service();

export default service;