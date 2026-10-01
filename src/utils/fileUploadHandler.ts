// Enhanced file upload handler with proper error handling
import { supabase } from '@/integrations/supabase/client';
import { getErrorMessage, logError, reportError } from './errorHandler';

export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface FileUploadOptions {
  bucket: string;
  path: string;
  file: File;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  overwrite?: boolean;
}

export class FileUploadHandler {
  private static readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];

  static async uploadFile(options: FileUploadOptions): Promise<FileUploadResult> {
    const { bucket, path, file, maxSize, allowedTypes, overwrite = true } = options;
    
    try {
      // Validate file
      const validationError = this.validateFile(file, maxSize, allowedTypes);
      if (validationError) {
        return {
          success: false,
          error: validationError
        };
      }

      // Check if file exists and handle overwrite
      if (!overwrite) {
        const { data: existingFile } = await supabase.storage
          .from(bucket)
          .list(path.split('/').slice(0, -1).join('/'));
        
        if (existingFile?.some(f => f.name === path.split('/').pop())) {
          return {
            success: false,
            error: 'File already exists'
          };
        }
      }

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: overwrite
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      logError('FileUpload', null, { 
        bucket, 
        path, 
        fileSize: file.size, 
        fileType: file.type 
      });

      return {
        success: true,
        url: urlData.publicUrl
      };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logError('FileUpload', error, { bucket, path, fileName: file.name });
      reportError('FileUpload', error, { bucket, path, fileName: file.name });
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  static async deleteFile(bucket: string, path: string): Promise<FileUploadResult> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      return {
        success: true
      };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logError('FileDelete', error, { bucket, path });
      reportError('FileDelete', error, { bucket, path });
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private static validateFile(
    file: File, 
    maxSize = this.DEFAULT_MAX_SIZE, 
    allowedTypes = this.DEFAULT_ALLOWED_TYPES
  ): string | null {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }

    // Check if file is corrupted (basic check)
    if (file.size === 0) {
      return 'File appears to be corrupted or empty';
    }

    return null;
  }

  static generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${random}.${extension}`;
  }

  static async uploadWithProgress(
    options: FileUploadOptions,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResult> {
    // For now, we'll use the regular upload method
    // In the future, this could be enhanced with chunk uploading for progress tracking
    if (onProgress) {
      onProgress(0);
    }

    const result = await this.uploadFile(options);

    if (onProgress) {
      onProgress(result.success ? 100 : 0);
    }

    return result;
  }
}