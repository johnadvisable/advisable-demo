import { Facebook, Linkedin, Twitter, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  getDomainForLanguage, 
  buildLocalizedUrl,
  isLocalDevelopment 
} from '@/utils/multilanguageUtils';

interface SocialShareButtonsProps {
  title: string;
  slug: string;
}

export default function SocialShareButtons({ title, slug }: SocialShareButtonsProps) {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);
  
  // Generate the full URL
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() 
    ? window.location.origin 
    : `https://www.${domain}`;
  const articleUrl = `${baseUrl}${buildLocalizedUrl(`/insights/${slug}`, currentLanguage)}`;
  
  // Encoded values for sharing
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);
  
  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
  };
  
  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
  };
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      toast({
        title: currentLanguage === 'el' ? 'Αντιγράφηκε!' : 'Copied!',
        description: currentLanguage === 'el' 
          ? 'Ο σύνδεσμος αντιγράφηκε στο πρόχειρο.' 
          : 'Link copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: currentLanguage === 'el' ? 'Σφάλμα' : 'Error',
        description: currentLanguage === 'el' 
          ? 'Δεν ήταν δυνατή η αντιγραφή.' 
          : 'Could not copy link.',
        variant: 'destructive',
      });
    }
  };
  
  const shareLabel = currentLanguage === 'el' ? 'Κοινοποίηση:' : 'Share:';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground mr-1">{shareLabel}</span>
      
      {/* LinkedIn */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
        onClick={() => handleShare('linkedin')}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      {/* Twitter/X */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
        onClick={() => handleShare('twitter')}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      {/* Facebook */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
        onClick={() => handleShare('facebook')}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      {/* Copy Link */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        onClick={handleCopyLink}
        aria-label={currentLanguage === 'el' ? 'Αντιγραφή συνδέσμου' : 'Copy link'}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
