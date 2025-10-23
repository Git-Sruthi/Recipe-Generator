import { ChefHat, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";

export function Footer({ onNavigate }) {
  const handleLinkClick = (linkName) => {
    toast.info(`${linkName} page would be implemented here`);
  };

  const handleSocialClick = (platform) => {
    toast.info(`Opening ${platform} page`);
  };
  const footerLinks = {
    company: [
      { name: "About Us", action: () => onNavigate("about") },
      { name: "Contact", action: () => handleLinkClick("Contact") },
      { name: "Careers", action: () => handleLinkClick("Careers") },
      { name: "Blog", action: () => handleLinkClick("Blog") }
    ],
    legal: [
      { name: "Privacy Policy", action: () => handleLinkClick("Privacy Policy") },
      { name: "Terms of Service", action: () => handleLinkClick("Terms of Service") },
      { name: "Cookie Policy", action: () => handleLinkClick("Cookie Policy") },
      { name: "DMCA", action: () => handleLinkClick("DMCA") }
    ],
    support: [
      { name: "Help Center", action: () => handleLinkClick("Help Center") },
      { name: "Community", action: () => handleLinkClick("Community") },
      { name: "Submit Recipe", action: () => handleLinkClick("Submit Recipe") },
      { name: "Report Issue", action: () => handleLinkClick("Report Issue") }
    ]
  };

  const socialIcons = [
    { Icon: Facebook, action: () => handleSocialClick("Facebook"), label: "Facebook" },
    { Icon: Twitter, action: () => handleSocialClick("Twitter"), label: "Twitter" },
    { Icon: Instagram, action: () => handleSocialClick("Instagram"), label: "Instagram" },
    { Icon: Youtube, action: () => handleSocialClick("YouTube"), label: "YouTube" }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-green-600" />
              <span className="font-bold text-xl text-gray-900">RecipeFinder</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Discover amazing recipes from around the world. Cook with confidence 
              using our easy-to-follow instructions and helpful tips.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialIcons.map(({ Icon, action, label }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 shadow-sm"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={link.action}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={link.action}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={link.action}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 RecipeFinder. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 sm:mt-0">
            Made with ❤️ for food lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}