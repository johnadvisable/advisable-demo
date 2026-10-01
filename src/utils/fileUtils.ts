import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { handleLocalImageUpload } from "./localFileUtils";

// Base path for locally stored admin images
export const ADMIN_IMAGES_BASE_PATH = "/images-admin";

// Flag to determine if we should use local storage or Supabase
const USE_LOCAL_STORAGE = false;

export const uploadFile = async (file: File, bucket: string, folder: string = ""): Promise<string | null> => {
  // If we're using local storage, use the local upload function
  if (USE_LOCAL_STORAGE) {
    try {
      return await handleLocalImageUpload(file, folder);
    } catch (error) {
      console.error("Error in local file upload:", error);
      return null;
    }
  }
  
  // Otherwise use Supabase storage
  try {
    const fileExt = file.name.split(".").pop();
    const filePath = folder 
      ? `${folder}/${uuidv4()}.${fileExt}`
      : `${uuidv4()}.${fileExt}`;

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error uploading file to Supabase:", error);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("File upload failed:", error);
    return null;
  }
};

// Function to get a proper URL for an image, handling both local and Supabase URLs
export const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return it as is
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath;
  }
  
  // If it's a path from our admin images
  if (imagePath.startsWith(ADMIN_IMAGES_BASE_PATH) || imagePath.startsWith('/media')) {
    // For paths that use our admin images path, construct the proper URL
    return imagePath;
  }
  
  // Default path handling
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
};

export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getPlaceholderImage = (name: string): string => {
  // Create a placeholder with the initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200&color=fff&bold=true&font-size=0.5&length=2`;
};

// Generic image upload function that can be used for different image types
export const handleImageUpload = async (file: File, type: string = "general"): Promise<string | null> => {
  if (!file) return null;
  
  try {
    if (USE_LOCAL_STORAGE) {
      return await handleLocalImageUpload(file, type);
    }
    
    // Determine the appropriate bucket and folder based on the type
    let bucket = "admin-images";
    let folder = type;
    
    // Upload to Supabase storage
    const imageUrl = await uploadFile(file, bucket, folder);
    return imageUrl;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    return null;
  }
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.includes(type));
};

// Component for image upload with preview
export const createImageUploadHandler = (
  _file: File | null, 
  setFile: (file: File | null) => void, 
  setPreview: (preview: string | null) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Store the file for upload
      setFile(selectedFile);
    }
  };
};
