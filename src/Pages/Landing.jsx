import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ChevronRight, Star, CheckCircle, Instagram, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';

// Image Loading Component with skeleton and error handling
const ImageWithLoading = ({ src, alt, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500 text-sm font-medium">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Image Grid Component - Fixed layout issues
const ImageGrid = ({ images }) => {
  return (
    <div className="w-full md:w-1/2 flex-shrink-0 p-13">
      <div className="grid grid-cols-3 gap-3 h-80">
        {/* Large Image on the Left */}
        <div className="col-span-2 h-full overflow-hidden rounded-lg">
          <ImageWithLoading 
            src={images.large} 
            alt="Interior Design" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right column with stacked images */}
        <div className="flex flex-col gap-3 h-full">
          <div className="flex-1 overflow-hidden rounded-lg">
            <ImageWithLoading 
              src={images.small1} 
              alt="Interior Detail" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden rounded-lg">
            <ImageWithLoading 
              src={images.small2} 
              alt="Interior Decor" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Process Card Component - Fixed padding and spacing issues
const ProcessCard = ({ stepNumber, heading, description, images, isReversed = false }) => {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden flex flex-col ${
      isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
    } items-stretch gap-0 mt-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
      {/* Text Content */}
      <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl lg:text-3xl font-bold text-amber-500">{stepNumber}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-500 to-transparent"></div>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-4">{heading}</h2>
        <p className="text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      {/* Image Grid */}
      <ImageGrid images={images} />
    </div>
  );
};

// Connect With Us Modal Component
const ConnectWithUsModal = ({ isOpen, onClose }) => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/swagruhainteriors',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      name: 'X(Twitter)',
      icon: X,
      href: 'https://X.com/swagruhainteriors',
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/swagruhainteriors',
      color: 'bg-gradient-to-r from-blue-600 to-blue-800',
      hoverColor: 'hover:from-blue-700 hover:to-blue-900'
    },
    {
      name: 'Whatsapp',
      icon: MessageCircle,
      href: 'https://whatsapp.com/u/swagruhainteriors',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    }
  ];

  const contactMethods = [
    {
      name: 'Phone Call',
      icon: Phone,
      href: 'tel:+91XXXXXXXXXX',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      text: '+91 XXXX XXXXXX'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:contact@swagruhainteriors.com',
      color: 'bg-gradient-to-r from-gray-600 to-gray-800',
      hoverColor: 'hover:from-gray-700 hover:to-gray-900',
      text: 'contact@swagruhainteriors.com'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-lg transform transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Connect With Us</h2>
            <p className="text-gray-600 mt-1">Follow us and stay updated with our latest projects</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Social Media</h3>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} ${social.hoverColor} text-white p-4 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
              >
                <social.icon size={20} />
                <span className="font-medium">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Direct Contact</h3>
          <div className="space-y-3">
            {contactMethods.map((contact) => (
              <a
                key={contact.name}
                href={contact.href}
                className={`${contact.color} ${contact.hoverColor} text-white p-4 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full`}
              >
                <contact.icon size={20} />
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm opacity-90">{contact.text}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Landing = () => {
  // Hero slider images
  const heroImages = [
    "src/assets/images/img18.jpg",
    "src/assets/images/img19.jpg", 
    "src/assets/images/img20.jpg",
    "src/assets/images/img21.jpg"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Navigation items
  const navItems = [
    { name: 'Home', href: '#home', isButton: false },
    { name: 'How It Works', href: '#how-it-works', isButton: false },
    { name: 'About', href: '#about', isButton: false },
    { name: 'Portfolio', href: '#portfolio', isButton: false },
    { name: 'Get Quote', href: '#get-quote', isButton: true },
  ];

  // Process steps data
  const processSteps = [
    {
      stepNumber: "01",
      heading: "Understanding Your Vision",
      description: "Our journey begins with you — your ideas, your lifestyle, your expectations. We start with a personal consultation where we listen carefully to what you want, how you live, and what matters most to you in a home. We discuss your aesthetic preferences, daily routines, space constraints, and budget expectations. This collaborative session helps us understand your story and build a clear vision of your ideal space.",
      images: {
        large: "src/assets/images/img2.jpg",
        small1: "src/assets/images/img3.jpg",
        small2: "src/assets/images/img4.jpg"
      }
    },
    {
      stepNumber: "02",
      heading: "3D Visualization & Planning",
      description: "Using detailed architectural plans and advanced 3D rendering tools, we build a digital model of your interior. You'll see your future home from every angle, with realistic lighting and accurate proportions. This immersive experience allows you to walk through your space virtually, make changes, and understand exactly how your interior will look and function before execution begins.",
      images: {
        large: "src/assets/images/img5.jpg",
        small1: "src/assets/images/img6.jpg",
        small2: "src/assets/images/img7.jpg"
      }
    },
    {
      stepNumber: "03",
      heading: "Premium Material Selection",
      description: "Our material experts handpick premium-quality resources suited for durability, elegance, and long-term comfort. From engineered wood to high-gloss laminates, every element is chosen for both aesthetic appeal and daily usability. Your custom furniture goes into production at our state-of-the-art facility with strict quality control protocols ensuring perfection.",
      images: {
        large: "src/assets/images/img8.jpg",
        small1: "src/assets/images/img9.jpg",
        small2: "src/assets/images/img10.jpg"
      }
    },
    {
      stepNumber: "04",
      heading: "Secure Packing & Dispatch",
      description: "Each component is wrapped using shock-resistant packaging and protective cushioning to safeguard it during transit. Our logistics team plans and schedules delivery with precision, coordinating with you for suitable timing. Your dream design is handled with the same care in shipping as it was in design and manufacturing.",
      images: {
        large: "src/assets/images/img11.jpg",
        small1: "src/assets/images/img12.jpg",
        small2: "src/assets/images/img13.jpg"
      }
    },
    {
      stepNumber: "05",
      heading: "Professional Installation",
      description: "Our skilled installation team transforms your space according to the finalized plan. Every element is assembled on-site with perfect alignment and spotless finish. We handle all technical aspects including electrical and plumbing adjustments. The final handover reveals your beautiful, functional, custom-designed home exactly as envisioned.",
      images: {
        large: "src/assets/images/img14.jpg",
        small1: "src/assets/images/img15.jpg",
        small2: "src/assets/images/img2.jpg"
      }
    }
  ];

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href === '#get-quote') {
      setFormOpen(true);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleFormSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will contact you soon.');
    setFormOpen(false);
    setFormData({
      name: '', email: '', phone: '', projectType: '', budget: '', timeline: '', message: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Fixed Navigation - Improved logo styling */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo - Improved styling */}
            <a 
              href="#home" 
              className="flex items-center transform hover:scale-105 transition-transform duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
            >
              <div className="">
                <img 
                  src="src/assets/images/img17.jpg"
                  alt="Swagruha Interiors" 
                  className="bg-white rounded-2xl h-20 lg:h-24 w-auto max-w-[800px] lg:max-w-[1000px] object-contain"
                />
              </div>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.isButton ? (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="bg-amber-400 hover:bg-white hover:text-amber-500 text-black px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer rounded-2xl"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className="text-white font-semibold hover:text-amber-400 transition-colors duration-300 drop-shadow-lg text-sm lg:text-base"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Improved logo styling */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl z-50 transform transition-transform duration-300 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}>
        <div className="p-6 pt-20">
          <div className="p-4 mb-8 mx-auto w-fit">
            <img 
              src="src/assets/images/img17.jpg"
              alt="Swagruha Interiors" 
              className="bg-white rounded-2xl h-22 w-auto max-w-[480px] object-contain"
            />
          </div>
          
          <div className="space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.isButton ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-black px-6 py-3 font-semibold transition-all duration-300 cursor-pointer rounded-2xl"
                  >
                    {item.name}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="block text-white hover:text-amber-400 font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1500 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Your Space
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-light mb-8 opacity-90">
              Creating Beautiful Interiors That Inspire and Delight
            </p>
            <button
              onClick={() => handleNavClick('#get-quote')}
              className="bg-amber-400 hover:bg-white hover:text-amber-500 text-black px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center gap-2 cursor-pointer "
            >
              Get Your Free Quote
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star size={16} className="fill-current" />
              How It Works
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              From Vision to Reality
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A seamless journey to your dream interior, handled with care and precision at every step
            </p>
          </div>

          {/* Process Cards */}
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <ProcessCard
                key={index}
                stepNumber={step.stepNumber}
                heading={step.heading}
                description={step.description}
                images={step.images}
                isReversed={index % 2 === 1}
              />
            ))}
          </div>

            {/* Communication Card - Fixed padding and mobile alignment */}
            <div className="bg-white px-6 lg:px-10 py-8 lg:py-12 rounded-2xl shadow-xl mt-8 border border-gray-100">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                    <div className="flex items-start gap-4 flex-1 w-full md:w-auto">
                    <div className="bg-amber-100 p-3 rounded-xl flex-shrink-0">
                        <Phone className="text-amber-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                        Ongoing Client Communication
                        </h3>
                        <p className="text-gray-600 leading-relaxed max-w-2xl">
                        Throughout every step — from design to delivery — we keep you updated via regular calls, 
                        messages, and previews. Transparency, clarity, and peace of mind are always guaranteed.
                        </p>
                    </div>
                    </div>
                    <button
                    onClick={() => setConnectModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex-shrink-0 w-full md:w-auto justify-center md:justify-start"
                    >
                    <CheckCircle size={18} />
                    Real-time Updates
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Connect With Us Modal */}
      <ConnectWithUsModal 
        isOpen={connectModalOpen} 
        onClose={() => setConnectModalOpen(false)} 
      />

      {/* Quote Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
            {/* Form Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Get Your Free Quote</h2>
                <p className="text-gray-600 mt-1">Tell us about your project and we'll provide a detailed estimate</p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone and Project Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="">Select Project Type</option>
                    <option value="residential">Residential Interior</option>
                    <option value="commercial">Commercial Interior</option>
                    <option value="office">Office Design</option>
                    <option value="renovation">Renovation</option>
                    <option value="consultation">Design Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Budget and Timeline Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="under-50k">Under ₹50,000</option>
                    <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                    <option value="1l-3l">₹1,00,000 - ₹3,00,000</option>
                    <option value="3l-5l">₹3,00,000 - ₹5,00,000</option>
                    <option value="5l-10l">₹5,00,000 - ₹10,00,000</option>
                    <option value="above-10l">Above ₹10,00,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="">Select Timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-3months">1-3 months</option>
                    <option value="3-6months">3-6 months</option>
                    <option value="6-12months">6-12 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200 resize-vertical"
                  placeholder="Tell us more about your project, requirements, style preferences, etc."
                />
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleFormSubmit}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105"
                >
                  Submit Quote Request
                </button>
                <button
                  onClick={() => setFormOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
