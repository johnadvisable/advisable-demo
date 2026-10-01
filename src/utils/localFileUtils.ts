
import { v4 as uuidv4 } from "uuid";

// Base path for locally stored media files
export const LOCAL_MEDIA_PATH = "/media";

/**
 * Uploads a file to the local filesystem
 * @param file The file to upload
 * @param folder Optional subfolder within the media directory
 * @returns The path to the uploaded file
 */
export const uploadLocalFile = async (file: File, folder: string = ""): Promise<string> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create the file path
    const filePath = folder 
      ? `${LOCAL_MEDIA_PATH}/${folder}/${fileName}`
      : `${LOCAL_MEDIA_PATH}/${fileName}`;
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', filePath);
    
    // Send the file to our API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload file');
    }
    
    const data = await response.json();

    return data.filePath;
  } catch (error) {
    console.error("Local file upload failed:", error);
    throw error; // Re-throw to allow proper error handling
  }
};

/**
 * Handles image upload to local filesystem
 * @param file The file to upload
 * @param type Type of image (for folder organization)
 * @returns The path to the uploaded image
 */
export const handleLocalImageUpload = async (file: File, type: string = "general"): Promise<string | null> => {
  if (!file) return null;
  
  try {
    // Upload to local filesystem
    const imagePath = await uploadLocalFile(file, type);
    return imagePath;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    return null;
  }
};
