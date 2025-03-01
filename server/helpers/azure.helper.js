import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import mime from "mime-types";
import path from "path";

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING in environment variables");
}

/**
 * Sanitizes a filename to be valid for Azure Blob Storage.
 * @param {string} filename - The original filename.
 * @returns {string} - The sanitized filename.
 */
const sanitizeFileName = (filename) => {
    const ext = path.extname(filename);

    const baseName = path.basename(filename, ext);

    const sanitized = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);

    return `${sanitized}-${timestamp}-${randomString}${ext.toLowerCase()}`;
};

/**
 * Uploads a file buffer to Azure Blob Storage.
 * @param {string} containerName - The name of the Azure Storage container.
 * @param {Buffer} fileBuffer - The file data buffer.
 * @param {string} originalName - The original filename.
 * @returns {Promise<string>} - The file URL.
 * @throws {Error} - If the upload fails.
 */
export const AzureFileUploader = async (containerName, fileBuffer, originalName) => {
    if (!containerName) {
        throw new Error('Container name is required');
    }

    if (!fileBuffer) {
        throw new Error(`File buffer is empty for ${originalName}`);
    }

    if (!originalName) {
        throw new Error('Original filename is required');
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        await containerClient.createIfNotExists({ access: "container" });

        const blobName = sanitizeFileName(originalName);

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const mimeType = mime.lookup(originalName) || "application/octet-stream";

        const uploadResponse = await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: {
                blobContentType: mimeType,
                blobCacheControl: 'public, max-age=31536000'
            },
        });

        if (!uploadResponse.requestId) {
            throw new Error('Upload failed - no request ID received');
        }

        return blockBlobClient.url;
    } catch (error) {
        console.error(`Error in AzureFileUploader: ${error.message}`);
        throw new Error(`File upload failed: ${error.message}`);
    }
};

/**
 * Downloads a file from an Azure Blob Storage container.
 * @param {string} containerName - The name of the Azure Storage container.
 * @param {string} blobName - The name of the blob (file) in Azure Storage.
 * @param {string} downloadFilePath - The local file path where the downloaded file should be saved.
 * @returns {Promise<boolean>} - Returns true if the download was successful.
 * @throws {Error} - If the download fails.
 */
export const AzureFileDownloader = async (containerName, blobName, downloadFilePath) => {
    if (!containerName || !blobName || !downloadFilePath) {
        throw new Error('Container name, blob name, and download path are required');
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const exists = await blockBlobClient.exists();
        if (!exists) {
            throw new Error(`File ${blobName} not found in container ${containerName}`);
        }

        await blockBlobClient.downloadToFile(downloadFilePath);
        console.log(`File downloaded successfully to: ${downloadFilePath}`);

        return true;
    } catch (error) {
        console.error(`Error in AzureFileDownloader: ${error.message}`);
        throw new Error(`File download failed: ${error.message}`);
    }
}