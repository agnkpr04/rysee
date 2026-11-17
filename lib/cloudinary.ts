import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload video to Cloudinary
 * @param file - File object or base64 string
 * @param folder - Folder name in Cloudinary (default: 'rysee-products')
 * @returns Promise with upload result
 */
export async function uploadVideo(
  file: File | string,
  folder: string = 'rysee-products'
): Promise<{ url: string; publicId: string }> {
  try {
    let uploadResult;

    if (typeof file === 'string') {
      // Base64 upload
      uploadResult = await cloudinary.uploader.upload(file, {
        resource_type: 'video',
        folder,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 720, crop: 'limit' },
        ],
      });
    } else {
      // File upload (need to convert to base64 first)
      const base64 = await fileToBase64(file);
      uploadResult = await cloudinary.uploader.upload(base64, {
        resource_type: 'video',
        folder,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 720, crop: 'limit' },
        ],
      });
    }

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    throw new Error('Failed to upload video to Cloudinary');
  }
}

/**
 * Generate video URL with transformations
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 * @returns Video URL
 */
export function getVideoUrl(
  publicId: string,
  options: {
    width?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  const { width = 720, quality = 'auto', format = 'auto' } = options;

  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { quality, fetch_format: format },
      { width, crop: 'limit' },
    ],
    secure: true,
  });
}

/**
 * Delete video from Cloudinary
 * @param publicId - Cloudinary public ID
 * @returns Promise with delete result
 */
export async function deleteVideo(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    });
  } catch (error) {
    console.error('Cloudinary video delete error:', error);
    throw new Error('Failed to delete video from Cloudinary');
  }
}

/**
 * Convert File to Base64
 * @param file - File object
 * @returns Base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:video/mp4;base64,")
      const base64 = result.split(',')[1];
      resolve(`data:video/mp4;base64,${base64}`);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary video URL
 * @returns Public ID
 */
export function extractPublicId(url: string): string {
  const matches = url.match(/\/v\d+\/(.+?)\.(mp4|webm|mov)/);
  return matches ? matches[1] : '';
}
