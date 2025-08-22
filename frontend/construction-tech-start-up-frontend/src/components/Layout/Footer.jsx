import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'; 
import FooterLogo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const quickLinks = [
  { title: "Home", path: "/" },
  { title: "About Us", path: "/about" },
  { title: "Contact Us", path: "/contactUs" },
  { title: "Terms of Service", path: "/terms" },
  { title: "Privacy Policy", path: "/privacy" },
];

function Footer() {
  return (
    <footer className="bg-gray-900 text-white w-full">
      {/* Main Footer Content */}
      <div className="w-full px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Company Info */}
          <div>
            <div className="inline-block p-1 bg-white rounded-lg">
              <img 
                src={FooterLogo} 
                alt="Houzzify Logo" 
                className="w-32 sm:w-40 h-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-4 max-w-sm mx-auto md:mx-0">
              We help construction professionals find clients, and clients find 
              construction professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-primary-500 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-amber-400 transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
         <div className="text-center md:text-left">
  <h3 className="text-lg font-bold text-primary-500 mb-4">Contact Info</h3>
  <div className="space-y-3">

    <div className="flex items-center justify-center md:justify-start gap-3">
      <FontAwesomeIcon icon={faPhone} className="text-primary-500" />
      <div className="text-left">
        <p className="text-gray-300 text-sm font-medium">Phone</p>
        <p className="text-gray-400 text-sm">+234 700 000 0000</p>
      </div>
    </div>

    <div className="flex items-center justify-center md:justify-start gap-3">
      <FontAwesomeIcon icon={faEnvelope} className="text-primary-500" />
      <div className="text-left">
        <p className="text-gray-300 text-sm font-medium">Email</p>
        <p className="text-gray-400 text-sm">hello@houzzify.com</p>
      </div>
    </div>

  </div>
</div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 w-full">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; 2025 Houzzify. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs sm:text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contactUs" className="text-gray-400 hover:text-amber-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
