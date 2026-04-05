import { Facebook, Instagram } from "lucide-react";

const SocialIcons = () => {
  return (
    <div className="flex items-center space-x-4">
      <a
        href="https://www.facebook.com/NepdoraWebBuilder"
        className="text-gray-500 transition-colors hover:text-gray-900"
        target="_blank"
        aria-label="Follow Nepdora on Facebook"
      >
        <Facebook size={20} />
      </a>
      <a
        href="https://www.instagram.com/nep_dora"
        className="text-gray-500 transition-colors hover:text-gray-900"
        target="_blank"
        aria-label="Follow Nepdora on Instagram"
      >
        <Instagram size={20} />
      </a>
    </div>
  );
};

export default SocialIcons;
