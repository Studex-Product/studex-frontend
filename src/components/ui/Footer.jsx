import { memo } from 'react';
import { Link } from 'react-router-dom';
import Logo from "../common/Logo";
import Facebook from "/src/assets/icons/Facebook.svg";
import Twitter from "/src/assets/icons/Twitter.svg";
import LinkedIn from "/src/assets/icons/linkedIn.svg";
import TikTok from "/src/assets/icons/tikTok.svg";

const NAVIGATION_SECTIONS = {
  platform: [
    { text: 'About Us', url: '/about' },
    { text: 'Why StudEx', url: '/#why-studex' },
    { text: 'Testimonials', url: '/#testimonials' },
    { text: 'Blog', url: '/#blog' }
  ],
  explore: [
    { text: 'Resale Listings', url: '/#listings' },
    { text: 'Roommate Listings', url: '/#roommates' },
    { text: 'Student Deals', url: '/#deals' },
    { text: 'Resale Guidelines', url: '#/guidelines' },
    { text: 'FAQs', url: '/#faq' }
  ],
  account: [
    { text: 'My Purchases', url: '/login' },
    { text: 'Payment Methods', url: '/login' },
    { text: 'My Info', url: '/login' }
  ]
};

const SOCIAL_LINKS = [
  { icon: Facebook, alt: 'Facebook', href: '#' },
  { icon: Twitter, alt: 'Twitter', href: '#' },
  { icon: LinkedIn, alt: 'LinkedIn', href: '#' },
  { icon: TikTok, alt: 'TikTok', href: '#' }
];

const CONTACT_EMAILS = [
  'StudEx@hotmail.com',
  'StudEx@gmail.com'
];

const NavSection = ({ title, links, className = "", orderClass = "" }) => (
  <div className={`flex flex-col gap-2 py-4 md:py-12 px-2 ${orderClass} ${className}`}>
    <h3 className="text-white font-semibold mb-4">{title}</h3>
    <ul className="space-y-3 ">
      {links.map(link => (
        <li key={link.text}>
          <Link to={link.url} className="text-gray-300 hover:text-white hover:-translate-y-1 cursor-pointer transition-all duration-300 inline-block">
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const ContactSection = () => (
  <div className="bg-green-700 flex flex-col gap-2 py-4 md:py-12 order-4 md:order-none px-2">
    <h5 className="text-white font-semibold">Contact Us</h5>
    <hr className="w-16 border-t border-white my-2" />
    <ul className="space-y-3">
      {CONTACT_EMAILS.map(email => (
        <li key={email}>
          <a
            href={`mailto:${email}`}
            className="text-gray-300 hover:text-white hover:-translate-y-1 cursor-pointer transition-all duration-300 inline-block"
          >
            {email}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLinks = () => (
  <div className="flex space-x-4">
    {SOCIAL_LINKS.map(({ icon, alt, href }) => (
      <a key={alt} href={href} className="text-gray-300 hover:text-white hover:-translate-y-1 transition-all duration-300 inline-block">
        <img src={icon} alt={alt} className="w-6 h-6" />
      </a>
    ))}
  </div>
);

const Footer = memo(() => {
  return (
    <footer className="relative bg-[url('/src/assets/images/footer-img.png')] bg-cover bg-center text-white">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#363636] opacity-70 z-0"></div>

      {/* Content container */}
      <div className="flex flex-col md:flex-row relative px-2 md:px-6 z-10 backdrop-blur bg-accent-foreground/20">
        <div className="absolute inset-0 bg-green-800 opacity-30 h-[20%] lg:h-1/2 top-[80%] lg:top-1/2 -z-10"></div>
        {/* Logo and tagline section */}
        <div className="z-10 mt-6">
          <Logo />
          <p className="mt-4 mb-8 w-3/4 text-gray-300">
            StudEx makes campus buying and selling simple.
          </p>
        </div>

        {/* Navigation sections */}
        <div className="grid grid-cols-2 lg:grid-cols-4  md:gap-2 lg:gap-8 w-full">
          <NavSection 
            title="Platform" 
            links={NAVIGATION_SECTIONS.platform}
            className="w-full"
            orderClass="order-2 md:order-none"
          />
          <NavSection 
            title="Explore" 
            links={NAVIGATION_SECTIONS.explore}
            orderClass="order-3 md:order-none"
          />
          <NavSection 
            title="My Account" 
            links={NAVIGATION_SECTIONS.account}
            orderClass="order-1 md:order-none"
          />
          <ContactSection />
        </div>

        {/* Bottom section with copyright and social links */}
      </div>
      <div className="flex relative z-10 justify-between px-4 lg:px-8 py-6 lg:py-14 items-center border-t border-gray-600 backdrop-blur bg-accent-foreground/20">
        <div className="flex  items-center">
          <span className="text-white">© 2025 StudEx.ng</span>
        </div>

        <SocialLinks />
      </div>
    </footer>
  );
});

export default Footer;
