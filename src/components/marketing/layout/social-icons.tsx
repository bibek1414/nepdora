import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const SocialIcons = () => {
  return (
    <div className="flex items-center space-x-4">
      <a
        href="#"
        className="text-gray-500 transition-colors hover:text-gray-900"
      >
        <Facebook size={20} />
      </a>
      <a
        href="#"
        className="text-gray-500 transition-colors hover:text-gray-900"
      >
        <Instagram size={20} />
      </a>
      <a
        href="#"
        className="text-gray-500 transition-colors hover:text-gray-900"
      >
        <Linkedin size={20} />
      </a>
      <a
        href="#"
        className="text-gray-500 transition-colors hover:text-gray-900"
      >
        <Twitter size={20} />
      </a>
    </div>
  );
};

export default SocialIcons;
