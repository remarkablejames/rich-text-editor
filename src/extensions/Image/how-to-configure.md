```ts
/**
 * Create upload and delete functions for the Image extension
 */
export function createS3ImageHandlers(config: S3Config) {
    const storage = new S3Storage(config);

    return {
        upload: async (file: File): Promise<string> => {
            try {
                return await storage.uploadFile(file);
            } catch (error) {
                console.error('S3 upload error:', error);
                throw new Error('Failed to upload image to storage');
            }
        },

        onDelete: async (src: string): Promise<void> => {
            try {
                await storage.deleteFile(src);
                console.log('Successfully deleted image:', src);
            } catch (error) {
                console.error('S3 delete error:', error);
                // Don't throw here to avoid breaking the editor
                // Just log the error for monitoring
            }
        },
    };
}


// Create the handlers
const { upload, onDelete } = createS3ImageHandlers(s3Config);

// Example usage in your editor configuration


export const imageExtensionConfig = () => {
    return Image.configure({
        upload: upload, // Handles file upload to S3
        onDelete: onDelete, // Handles cleanup when images are deleted
        acceptMimes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: true,
        resourceImage: 'both', // allow both upload and URL input
        onError: (error) => {
            console.error('Image error:', error);
            // Handle errors (show toast, etc.)
        },
    });
};
```