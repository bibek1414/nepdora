export interface SiteConfig {
  id: number;
  favicon: string | null;
  logo: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
}

export interface SiteConfigFormData {
  favicon?: File | string | null;
  logo?: File | string | null;
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}
