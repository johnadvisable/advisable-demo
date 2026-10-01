import { useState, useEffect } from 'react';
import { getPublicSiteSettings } from '@/services/siteSettingsService';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await getPublicSiteSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error('Failed to load site settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, isLoading };
};