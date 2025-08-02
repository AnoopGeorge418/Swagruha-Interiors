import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Phone, Menu, X, ChevronRight, Star, CheckCircle, Instagram, Twitter, Linkedin, Mail, MessageCircle, Users, Award, Heart, TrendingUp, CheckCircle2, Sparkles, ArrowRight, HelpCircle, MapPin, Clock, Navigation, AlertCircle  } from 'lucide-react';

// Optimized Intersection Observer Hook with throttling
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
        // Disconnect after first intersection for better performance
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    }, { threshold: 0.1, rootMargin: '50px', ...options });

    observerRef.current = observer;

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible]);

  return [ref, isVisible];
};

// Form validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
};

const validateName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
};

// Success/Error Alert Component
const Alert = React.memo(({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-[60] flex items-center gap-3 transform transition-all duration-300 animate-slide-in`}>
      {icon}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1">
        <X size={16} />
      </button>
    </div>
  );
});

// Optimized Stats Counter Component with RAF
const StatCounter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();
  const animationRef = useRef();

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-bold text-2xl lg:text-3xl text-amber-600">
      {prefix}{count}{suffix}
    </span>
  );
};

// Optimized Feature Card Component
const FeatureCard = React.memo(({ icon: Icon, title, description, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`group bg-white p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Icon className="text-amber-600" size={28} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
});

// Optimized Image Loading Component
const ImageWithLoading = React.memo(({ src, alt, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => setIsLoading(false), []);
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

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
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
});

// Optimized Image Grid Component
const ImageGrid = React.memo(({ images }) => {
  return (
    <div className="w-full md:w-2/4 flex-shrink-0 p-6">
      <div className="grid grid-cols-2 gap-3 h-80">
        <div className="col-span-2 h-full overflow-hidden rounded-lg">
          <ImageWithLoading 
            src={images.large} 
            alt="Interior Design" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
});

// Optimized Process Card Component - Simplified animations
const ProcessCard = React.memo(({ stepNumber, heading, description, images, isReversed = false }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-2xl overflow-hidden flex flex-col ${
        isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-stretch gap-0 mt-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl lg:text-3xl font-bold text-amber-500">{stepNumber}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-500 to-transparent"></div>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-4">{heading}</h2>
        <p className="text-base text-gray-600 leading-relaxed">{description}</p>
      </div>
      <ImageGrid images={images} />
    </div>
  );
});

// About Section Component
const AboutSection = React.memo(() => {
  const [titleRef, titleVisible] = useIntersectionObserver();
  const [contentRef, contentVisible] = useIntersectionObserver();
  const [imageRef, imageVisible] = useIntersectionObserver();
  const [statsRef, statsVisible] = useIntersectionObserver();

  const features = useMemo(() => [
    {
      icon: Users,
      title: "Expert Team",
      description: "Our skilled designers and craftsmen bring decades of combined experience to every project, ensuring exceptional quality and attention to detail."
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "We use only the finest materials and latest design techniques to create interiors that stand the test of time while maintaining their elegance."
    },
    {
      icon: Heart,
      title: "Client-Centric",
      description: "Your vision is our priority. We work closely with you throughout the process to ensure the final result perfectly matches your dreams and lifestyle."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Staying ahead of design trends and incorporating cutting-edge technology to deliver modern, functional, and future-ready interior solutions."
    }
  ], []);

  const stats = useMemo(() => [
    { label: "Projects Completed", value: 500, suffix: "+" },
    { label: "Happy Clients", value: 450, suffix: "+" },
    { label: "Years Experience", value: 12, suffix: "" },
    { label: "Design Awards", value: 25, suffix: "+" }
  ], []);

  return (
    <section id="about" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <div className={`transform transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} className="fill-current" />
              About Us
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Crafting Inspiring Spaces
              <span className="block text-amber-600">with Elegance & Expertise</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Where creativity meets functionality to transform your vision into breathtaking reality
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div ref={contentRef} className={`transform transition-all duration-700 delay-200 ${
            contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-medium text-gray-900 mb-8">
                At <span className="text-amber-600 font-bold">Swagruha Interiors</span>, we believe that great design has the power to transform not just spaces, but lives.
              </p>
              
              <p>
                Our journey began with a simple yet profound vision: to create interiors that seamlessly blend 
                <strong className="text-gray-900"> aesthetics with functionality</strong>, reflecting the unique personality 
                and lifestyle of each client. Every project we undertake is a canvas where creativity meets precision.
              </p>
              
              <p>
                With our team of <strong className="text-gray-900">expert designers and master craftsmen</strong>, 
                we bring years of experience and passion to every detail. From concept development to final installation, 
                we ensure that quality, innovation, and client satisfaction remain at the heart of everything we do.
              </p>
              
              <p>
                What sets us apart is our commitment to <strong className="text-gray-900">transparency and collaboration</strong>. 
                We believe in keeping you involved throughout the entire process, ensuring that your dream interior becomes 
                a beautiful reality that exceeds your expectations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a href="#portfolio" className="group bg-orange-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:shadow-lg transform hover:scale-105">
                  View Portfolio
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <div ref={imageRef} className={`transform transition-all duration-700 delay-400 ${
            imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="relative group">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <ImageWithLoading 
                  src="src/assets/images/img16.jpg" 
                  alt="Swagruha Interiors Showcase" 
                  className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 transform group-hover:scale-105 transition-all duration-500">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg text-amber-600">500+</div>
                      <div className="text-gray-600">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-amber-600">450+</div>
                      <div className="text-gray-600">Happy Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-amber-600">12</div>
                      <div className="text-gray-600">Years</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-60 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500 delay-100"></div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>

        <div ref={statsRef} className={`bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl p-8 lg:p-12 transform transition-all duration-700 ${
          statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Our Journey in Numbers
            </h3>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Every number tells a story of trust, excellence, and the beautiful spaces we've created together
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="mb-2">
                  <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                    <StatCounter 
                      end={stat.value} 
                      suffix={stat.suffix}
                      duration={2000 + index * 200}
                    />
                  </div>
                </div>
                <p className="text-slate-200 font-medium text-sm lg:text-base group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-400/30">
            <div className="flex flex-wrap justify-center items-center gap-6 text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-slate-200" />
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-slate-200" />
                <span className="font-medium">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-slate-200" />
                <span className="font-medium">On-Time Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Optimized Portfolio Section with better animations
const PortfolioSection = React.memo(() => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [sectionRef, sectionVisible] = useIntersectionObserver();
  const [gridRef, gridVisible] = useIntersectionObserver();

  const categories = useMemo(() => [
    { id: 'all', name: 'All Projects', icon: '🏠' },
    { id: 'residential', name: 'Residential', icon: '🏡' },
    { id: 'commercial', name: 'Commercial', icon: '🏢' },
    { id: 'luxury', name: 'Luxury', icon: '✨' },
    { id: 'modern', name: 'Modern', icon: '🎨' }
  ], []);

  const projects = useMemo(() => [
    {
      id: 1,
      title: "Luxury Villa Interior",
      category: "luxury",
      location: "Mumbai",
      area: "3500 sq ft",
      duration: "75 days",
      budget: "₹15L - ₹20L",
      image: "src/assets/images/portfolio1.jpg",
      gallery: [
        "src/assets/images/portfolio1.jpg",
        "src/assets/images/portfolio1-2.jpg",
        "src/assets/images/portfolio1-3.jpg"
      ],
      description: "A stunning luxury villa featuring contemporary design with traditional elements. Open-plan living spaces with premium materials and smart home integration.",
      features: ["Smart Home Automation", "Premium Materials", "Custom Furniture", "Landscape Integration"],
      client: "Mr. & Mrs. Sharma"
    },
    {
      id: 2,
      title: "Modern Office Space",
      category: "commercial",
      location: "Delhi",
      area: "2800 sq ft",
      duration: "45 days",
      budget: "₹8L - ₹12L",
      image: "src/assets/images/portfolio2.jpg",
      gallery: [
        "src/assets/images/portfolio2.jpg",
        "src/assets/images/portfolio2-2.jpg",
        "src/assets/images/portfolio2-3.jpg"
      ],
      description: "Contemporary office design promoting productivity and collaboration. Ergonomic spaces with biophilic design elements and energy-efficient systems.",
      features: ["Ergonomic Design", "Biophilic Elements", "Energy Efficient", "Collaborative Spaces"],
      client: "TechCorp Solutions"
    },
    {
      id: 3,
      title: "Contemporary Apartment",
      category: "residential",
      location: "Bangalore",
      area: "1800 sq ft",
      duration: "60 days",
      budget: "₹6L - ₹10L",
      image: "src/assets/images/portfolio3.jpg",
      gallery: [
        "src/assets/images/portfolio3.jpg",
        "src/assets/images/portfolio3-2.jpg",
        "src/assets/images/portfolio3-3.jpg"
      ],
      description: "A modern 3BHK apartment with minimalist design approach. Space optimization with multi-functional furniture and abundant natural light.",
      features: ["Space Optimization", "Multi-functional Furniture", "Natural Light", "Minimalist Design"],
      client: "Ms. Priya Reddy"
    },
    {
      id: 4,
      title: "Boutique Hotel Lobby",
      category: "commercial",
      location: "Goa",
      area: "1200 sq ft",
      duration: "30 days",
      budget: "₹5L - ₹8L",
      image: "src/assets/images/portfolio4.jpg",
      gallery: [
        "src/assets/images/portfolio4.jpg",
        "src/assets/images/portfolio4-2.jpg",
        "src/assets/images/portfolio4-3.jpg"
      ],
      description: "Elegant boutique hotel lobby with coastal influences. Warm materials and textures creating an inviting atmosphere for guests.",
      features: ["Coastal Theme", "Warm Materials", "Guest Experience", "Local Art Integration"],
      client: "Serenity Resort"
    },
    {
      id: 5,
      title: "Modern Farmhouse",
      category: "modern",
      location: "Pune",
      area: "4000 sq ft",
      duration: "90 days",
      budget: "₹18L - ₹25L",
      image: "src/assets/images/portfolio5.jpg",
      gallery: [
        "src/assets/images/portfolio5.jpg",
        "src/assets/images/portfolio5-2.jpg",
        "src/assets/images/portfolio5-3.jpg"
      ],
      description: "A perfect blend of modern aesthetics with farmhouse charm. Sustainable materials and indoor-outdoor living concept.",
      features: ["Sustainable Materials", "Indoor-Outdoor Living", "Farmhouse Charm", "Modern Aesthetics"],
      client: "Kumar Family"
    },
    {
      id: 6,
      title: "Penthouse Living",
      category: "luxury",
      location: "Hyderabad",
      area: "5000 sq ft",
      duration: "120 days",
      budget: "₹30L - ₹40L",
      image: "src/assets/images/portfolio6.jpg",
      gallery: [
        "src/assets/images/portfolio6.jpg",
        "src/assets/images/portfolio6-2.jpg",
        "src/assets/images/portfolio6-3.jpg"
      ],
      description: "Ultra-luxury penthouse with panoramic city views. High-end finishes and custom-designed elements throughout.",
      features: ["Panoramic Views", "High-end Finishes", "Custom Design", "Ultra-luxury"],
      client: "Mr. Arjun Mehta"
    }
  ], []);

  const filteredProjects = useMemo(() => 
    activeCategory === 'all' 
      ? projects 
      : projects.filter(project => project.category === activeCategory),
    [activeCategory, projects]
  );

  const ProjectCard = React.memo(({ project, index, onClick }) => {
    const [cardRef, cardVisible] = useIntersectionObserver();

    return (
      <div
        ref={cardRef}
        className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-xl ${
          cardVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: `${index * 50}ms` }}
        onClick={() => onClick(project)}
      >
        <div className="relative h-64 lg:h-72 overflow-hidden">
          <ImageWithLoading 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-amber-600 px-3 py-1 rounded-full text-sm font-semibold">
              {categories.find(cat => cat.id === project.category)?.name}
            </span>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 transform transition-all duration-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <button className="w-full bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2">
              <span>View Project</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {project.description}
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="font-medium text-gray-700">📍 {project.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Area:</span>
              <span className="font-medium text-gray-700">{project.area}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium text-amber-600">{project.duration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const ProjectModal = ({ project, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!project) return null;

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{project.title}</h2>
              <p className="text-amber-600 font-medium">{project.location} • {project.area}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative h-64 lg:h-96">
            <ImageWithLoading 
              src={project.gallery[currentImageIndex]} 
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {project.gallery.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? project.gallery.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-colors duration-200"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === project.gallery.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-colors duration-200"
                >
                  <ChevronRight size={20} />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {project.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Project Overview</h3>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-3">Project Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium text-gray-900">{project.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium text-gray-900">{project.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-amber-600">{project.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium text-green-600">{project.budget}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-3">Key Features</h4>
                <div className="space-y-2">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onClose();
                  document.dispatchEvent(new CustomEvent('openQuoteForm'));
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>Start Similar Project</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-amber-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div ref={sectionRef} className="text-center mb-16">
          <div className={`transform transition-all duration-700 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} className="fill-current" />
              Our Portfolio
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transformative Spaces
              <span className="block text-amber-600">We've Created</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our diverse collection of interior design projects that showcase innovation, elegance, and exceptional craftsmanship
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap justify-center gap-3 mb-12 transform transition-all duration-700 delay-200 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-amber-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-amber-100 hover:text-amber-700 shadow-sm hover:shadow-md'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div ref={gridRef} className={`transform transition-all duration-700 delay-400 ${
          gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        </div>

        <div className={`text-center mt-16 transform transition-all duration-700 delay-600 ${
          gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl p-8 lg:p-12 shadow-xl">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Create Your Dream Space?
            </h3>
            <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss your vision and transform it into a beautiful reality with our expert design team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('openQuoteForm'))}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Start Your Project</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-slate-400 hover:border-white text-slate-200 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
});

// Optimized Testimonials Section with smooth animations
const TestimonialsSection = React.memo(() => {
  const [activeCard, setActiveCard] = useState(0);
  const [sectionRef, sectionVisible] = useIntersectionObserver();

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Homeowner",
      location: "Mumbai",
      rating: 5,
      image: "src/assets/images/client1.jpg",
      quote: "Swagruha Interiors transformed our 3BHK into a masterpiece. Their attention to detail and modern approach exceeded our expectations. The team was professional, punctual, and delivered exactly what they promised.",
      project: "Modern Residential Interior",
      duration: "45 days"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Business Owner",
      location: "Delhi",
      rating: 5,
      image: "src/assets/images/client2.jpg",
      quote: "Outstanding work on our office space! The team understood our corporate requirements perfectly and created a workspace that's both functional and inspiring. Highly recommend their services.",
      project: "Corporate Office Design",
      duration: "30 days"
    },
    {
      id: 3,
      name: "Anita Desai",
      role: "Architect",
      location: "Bangalore",
      rating: 5,
      image: "src/assets/images/client3.jpg",
      quote: "As an architect myself, I was impressed by their innovative design solutions and quality execution. They brought fresh ideas while respecting our budget and timeline constraints.",
      project: "Luxury Villa Interior",
      duration: "60 days"
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "Entrepreneur",
      location: "Pune",
      rating: 5,
      image: "src/assets/images/client4.jpg",
      quote: "The 3D visualization helped us see our dream home before construction. The final result was even better than we imagined. Professional team with excellent communication throughout.",
      project: "Complete Home Makeover",
      duration: "75 days"
    },
    {
      id: 5,
      name: "Meera Patel",
      role: "Interior Designer",
      location: "Ahmedabad",
      rating: 5,
      image: "src/assets/images/client5.jpg",
      quote: "Collaborated with them on a luxury project. Their craftsmanship and material selection is top-notch. They understand modern design trends while maintaining functionality.",
      project: "Luxury Apartment",
      duration: "50 days"
    },
    {
      id: 6,
      name: "Arjun Mehta",
      role: "Tech Executive",
      location: "Hyderabad",
      rating: 5,
      image: "src/assets/images/client6.jpg",
      quote: "From concept to completion, Swagruha Interiors delivered excellence. Their innovative use of space and premium materials created our dream smart home. Exceptional quality and service.",
      project: "Smart Home Interior",
      duration: "65 days"
    }
  ], []);

  // Simple auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const StarRating = React.memo(({ rating }) => {
    return (
      <div className="flex items-center justify-center gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={`${
              index < rating 
                ? 'text-amber-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  });

  const TestimonialCard = React.memo(({ testimonial, index }) => {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out h-full group">
        {/* Quote Icon */}
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
          <span className="text-xl text-amber-600 font-bold">"</span>
        </div>

        {/* Client Image */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-200">
            <ImageWithLoading 
              src={testimonial.image} 
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Star Rating */}
        <StarRating rating={testimonial.rating} />

        {/* Quote */}
        <p className="text-gray-700 text-center italic mb-6 leading-relaxed">
          "{testimonial.quote}"
        </p>

        {/* Client Info */}
        <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-bold text-gray-900 mb-1">
            {testimonial.name}
          </h4>
          <p className="font-semibold text-amber-600 mb-1">
            {testimonial.role}
          </p>
          <p className="text-sm text-gray-500">
            📍 {testimonial.location}
          </p>
        </div>

        {/* Project Details */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-600">Project:</span>
            <span className="font-semibold text-gray-800">{testimonial.project}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-600">Duration:</span>
            <span className="font-semibold text-amber-600">{testimonial.duration}</span>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="flex justify-center mt-4">
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 size={12} />
            Verified
          </div>
        </div>
      </div>
    );
  });

  const stats = useMemo(() => [
    { label: "Client Satisfaction", value: "98%" },
    { label: "On-Time Delivery", value: "100%" },
    { label: "Repeat Clients", value: "95%" },
    { label: "Average Rating", value: "4.9★" }
  ], []);

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div ref={sectionRef} className="text-center mb-16">
          <div className={`transition-opacity duration-700 ${
            sectionVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Heart size={16} className="fill-current" />
              Client Testimonials
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Clients
              <span className="block text-amber-600">Say About Us</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real clients who trusted us with their dream spaces
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        
        {/* Statistics Section */}
        <div className="bg-slate-700 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Client Satisfaction Statistics
          </h3>
          <p className="text-slate-200 mb-8 max-w-2xl mx-auto">
            Numbers that speak for our commitment to excellence
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-200 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// FAQ Section - Optimized
const FAQSection = React.memo(() => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [sectionRef, sectionVisible] = useIntersectionObserver();

  const faqCategories = useMemo(() => [
    {
      title: "Services & Expertise",
      icon: "🎨",
      questions: [
        {
          question: "What interior design services do you offer?",
          answer: "We provide comprehensive interior design services including space planning, color consultation, furniture selection, lighting design, custom millwork, project management, and complete home makeovers. We work on both residential and commercial projects."
        },
        {
          question: "Do you specialize in any particular design style?",
          answer: "We specialize in modern, contemporary, and luxury design styles, but we adapt to your personal preferences. Our portfolio includes minimalist, transitional, and eclectic designs tailored to each client's unique taste."
        },
        {
          question: "Is there a minimum project size you work with?",
          answer: "We work with projects starting from ₹3L and above. This ensures we can dedicate proper attention and resources to deliver exceptional results for every client."
        }
      ]
    },
    {
      title: "Process & Timeline",
      icon: "⚡",
      questions: [
        {
          question: "What's the first step to working with you?",
          answer: "Start with our free consultation where we discuss your vision, budget, and timeline. We'll assess if we're a good fit and provide you with a detailed proposal outlining our approach and investment."
        },
        {
          question: "How long does a typical project take?",
          answer: "Project timelines vary based on scope: Small rooms (2-4 weeks), Full apartments (6-10 weeks), Large homes (3-6 months). We provide detailed timelines during our initial consultation."
        },
        {
          question: "Will I see designs before you start ordering?",
          answer: "Absolutely! We present detailed mood boards, 3D renderings, and material samples for your approval before any purchases. We ensure you love every detail before moving forward."
        }
      ]
    },
    {
      title: "Pricing & Investment",
      icon: "💰",
      questions: [
        {
          question: "How much does interior design cost?",
          answer: "Our projects typically range from ₹3L to ₹50L+ depending on scope and finishes. We offer transparent pricing with detailed breakdowns during consultation. Payment plans are available for larger projects."
        },
        {
          question: "How do you structure your fees?",
          answer: "We charge a design fee (20-30% of total project cost) plus the cost of furniture, materials, and installation. Our fee covers design development, project management, and coordination with all vendors."
        },
        {
          question: "Are consultations free?",
          answer: "Yes! We offer a complimentary 60-minute consultation to discuss your project, assess your space, and determine if we're the right fit for your needs."
        }
      ]
    },
    {
      title: "Logistics & Support",
      icon: "🔧",
      questions: [
        {
          question: "Do you work outside your local area?",
          answer: "We primarily serve Mumbai, Delhi, Bangalore, and surrounding areas. For projects outside these locations, we offer virtual design consultations and can work with local contractors."
        },
        {
          question: "Who purchases the furniture and materials?",
          answer: "We handle all procurement through our trusted vendor network, ensuring quality control and competitive pricing. You'll approve all selections before any orders are placed."
        },
        {
          question: "What if I'm not happy with the final result?",
          answer: "Client satisfaction is our priority. We include revisions in our process and maintain open communication throughout. If issues arise, we'll work together to find solutions that meet your expectations."
        }
      ]
    }
  ], []);

  const toggleFAQ = useCallback((categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFAQ(openFAQ === key ? null : key);
  }, [openFAQ]);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div ref={sectionRef} className="text-center mb-16">
          <div className={`transform transition-all duration-700 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <HelpCircle size={16} />
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need
              <span className="block text-amber-600">To Know</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant answers to the most common questions about our interior design process, pricing, and services
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className={`transform transition-all duration-700 delay-${(categoryIndex + 1) * 100} ${
                sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-white rounded-t-2xl border-l-4 border-amber-500 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                </div>
              </div>

              <div className="bg-white border-l-4 border-amber-500 shadow-lg rounded-b-2xl overflow-hidden">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openFAQ === `${categoryIndex}-${questionIndex}`;
                  
                  return (
                    <div key={questionIndex} className="border-b border-gray-100 last:border-b-0">
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group"
                      >
                        <span className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
                          {faq.question}
                        </span>
                        <ChevronRight 
                          size={20} 
                          className={`text-amber-500 transition-transform duration-300 ${
                            isOpen ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-6 pb-6">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transform transition-all duration-700 delay-600 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-amber-100 text-lg mb-6 max-w-2xl mx-auto">
              We're here to help! Get in touch for a personalized consultation about your interior design project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-amber-600 px-8 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                <span onClick={() => document.dispatchEvent(new CustomEvent('openQuoteForm'))} >Start Free Consultation</span>
              </button>
              <a 
                href="tel:+917411624897"
                className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                <span>Call Us Directly</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Footer Section Component
const FooterSection = React.memo(() => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sectionRef, sectionVisible] = useIntersectionObserver();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleNavClick = useCallback((href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNavigateToLocation = useCallback(() => {
    const address = "Shed No. 5, Plot No. 288/2, Muthanallur Cross, Dommasandra, Bengaluru, Karnataka 562125";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  }, []);

  const handleOpenInGoogleMaps = useCallback(() => {
    const address = "Shed No. 5, Plot No. 288/2, Muthanallur Cross, Dommasandra, Bengaluru, Karnataka 562125";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }, []);

  const footerLinks = useMemo(() => ({
    company: [
      { name: 'Home', href: '#home', isButton: false },
      { name: 'How It Works', href: '#how-it-works', isButton: false },
      { name: 'About', href: '#about', isButton: false },
      { name: 'Portfolio', href: '#portfolio', isButton: false },
      { name: 'Testimonials', href: '#testimonials', isButton: false },
      { name: 'FAQ', href: '#faq', isButton: false },
      { name: 'Get Quote', href: '#get-quote', isButton: true },
    ],
    services: [
      { name: 'Residential Design', href: '#services' },
      { name: 'Commercial Design', href: '#services' },
      { name: 'Space Planning', href: '#services' },
      { name: 'Furniture Selection', href: '#services' },
      { name: 'Consultation', href: '#services' }
    ]
  }), []);

  const contactInfo = useMemo(() => [
    { 
      icon: <MapPin size={18} className="text-amber-400" />, 
      text: 'Shed No. 5, Plot No. 288/2, Muthanallur Cross, Dommasandra, Bengaluru, Karnataka 562125',
      action: handleOpenInGoogleMaps,
      type: 'location'
    },
    { 
      icon: <Phone size={18} className="text-amber-400" />, 
      text: '+91 7411624897',
      action: () => window.open('tel:+917411624897'),
      type: 'phone'
    },
    { 
      icon: <Mail size={18} className="text-amber-400" />, 
      text: 'swagruhainteriors@gmail.com',
      action: () => window.open('mailto:swagruhainteriors@gmail.com'),
      type: 'email'
    },
    { 
      icon: <Clock size={18} className="text-amber-400" />, 
      text: 'Mon - Sat: 9:00 AM - 6:00 PM',
      type: 'hours'
    }
  ], [handleOpenInGoogleMaps]);

  const socialLinks = useMemo(() => [
    { 
      name: 'Instagram', 
      icon: <Instagram size={20} />, 
      href: 'https://instagram.com/swagruhainteriors',
      color: 'hover:bg-pink-600'
    },
    { 
      name: 'Twitter', 
      icon: <X size={20} />, 
      href: 'https://twitter.com/swagruhainteriors',
      color: 'hover:bg-blue-500'
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={20} />, 
      href: 'https://linkedin.com/company/swagruhainteriors',
      color: 'hover:bg-blue-700'
    }
  ], []);

  const achievements = useMemo(() => [
    { number: '500+', label: 'Projects Completed' },
    { number: '50+', label: 'Happy Clients' },
    { number: '15+', label: 'Years Experience' },
    { number: '25+', label: 'Design Awards' }
  ], []);

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-gradient-to-br from-slate-600/10 to-slate-700/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div ref={sectionRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
            <div className={`grid lg:grid-cols-4 md:grid-cols-2 gap-8 lg:gap-12 transform transition-all duration-700 ${
              sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={24} />
                    Swagruha Interiors
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    Transforming spaces into beautiful, functional environments that reflect your unique style and personality. 
                    Experience luxury living with our expert interior design services.
                  </p>
                  
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-slate-700 ${social.color} text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                        title={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-amber-500">{achievement.number}</div>
                      <div className="text-xs text-slate-400">{achievement.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-6">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className="text-slate-300 hover:text-amber-400 transition-colors duration-200 cursor-pointer flex items-center gap-2 group"
                      >
                        <ChevronRight size={14} className="text-amber-500 group-hover:translate-x-1 transition-transform duration-200" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-6">Our Services</h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className="text-slate-300 hover:text-amber-400 transition-colors duration-200 cursor-pointer flex items-center gap-2 group"
                      >
                        <ChevronRight size={14} className="text-amber-500 group-hover:translate-x-1 transition-transform duration-200" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-6">Get In Touch</h4>
                <div className="space-y-4">
                  {contactInfo.map((contact, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 ${
                        contact.action ? 'cursor-pointer hover:text-amber-400 transition-colors duration-200' : ''
                      }`}
                      onClick={contact.action}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {contact.icon}
                      </div>
                      <span className="text-slate-300 text-sm leading-relaxed">
                        {contact.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button 
                    onClick={() => window.open('tel:+917411624897')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    Call Now
                  </button>
                  <button 
                    onClick={() => window.open('https://wa.me/917411624897')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className={`mt-12 transform transition-all duration-700 delay-300 ${
              sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h4 className="text-2xl font-bold text-white mb-6 text-center">Visit Our Factory</h4>
              <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="relative rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2573267487716!2d72.8776559148707!3d19.076090387093268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8c6b3fa7b7b%3A0x9d9d9d9d9d9d9d9d!2sSwagruha%20Interiors!5e0!3m2!1sen!2sin!4v1647887654321!5m2!1sen!2sin"
                    className="w-full h-64 lg:h-80 border-0 rounded-xl"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Our Office Location"
                  />
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={handleNavigateToLocation}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:scale-105"
                    >
                      <Navigation size={16} />
                      Navigate
                    </button>
                    <button
                      onClick={handleOpenInGoogleMaps}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:scale-105"
                    >
                      <MapPin size={16} />
                      View in Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 bg-slate-900 flex">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="text-slate-400 text-sm text-center lg:text-left">
                  © 2024 Swagruha Interiors. All rights reserved. | Designed with ❤️ for beautiful spaces
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`fixed bottom-8 right-8 w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          onClick={handleBackToTop}
          title="Back to Top"
        >
          <ChevronRight size={20} className="rotate-[-90deg] group-hover:translate-y-[-2px] transition-transform duration-200" />
        </button>
      </footer>
    </>
  );
});

// Connect With Us Modal Component
const ConnectWithUsModal = React.memo(({ isOpen, onClose }) => {
  const socialLinks = useMemo(() => [
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
      href: 'https://wa.me/917411624897',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    }
  ], []);

  const contactMethods = useMemo(() => [
    {
      name: 'Phone Call',
      icon: Phone,
      href: 'tel:+917411624897',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      text: '+91 7411624897'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:swagruhainteriors@gmail.com',
      color: 'bg-gradient-to-r from-gray-600 to-gray-800',
      hoverColor: 'hover:from-gray-700 hover:to-gray-900',
      text: 'swagruhainteriors@gmail.com'
    }
  ], []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-lg transform transition-all duration-300">
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

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
});

// Enhanced Quote Form Component with Validation
const QuoteFormModal = React.memo(({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name (letters and spaces only, minimum 2 characters)';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (minimum 10 digits)';
    }

    // Project type validation
    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type';
    }

    // Message validation (optional but if provided, should be meaningful)
    if (formData.message && formData.message.trim().length < 10) {
      newErrors.message = 'Please provide more details about your project (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setAlert({
        type: 'error',
        message: 'Please fix the errors below and try again.'
      });
      return;
    }

    setIsSubmitting(true);

    try {

      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Success message UI
    setAlert({
      type: 'success',
      message: 'Thank you! Your quote request has been submitted successfully. We will contact you within 24 hours.'
    });

    // Prepare WhatsApp message after user confirmation
    const whatsappMessage = `🏠 *New Quote Request - Swagruha Interiors*
... // (same message generation logic as before)
`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = '917411624897';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Reset form for user
    setFormData({
      name: '', email: '', phone: '', projectType: '', budget: '', timeline: '', message: ''
    });
    setErrors({});

    // Close form/modal after 1.5-2 seconds (user sees success)
    setTimeout(() => {
      onClose();
      setAlert(null);
      // NOW open WhatsApp **after** closing the form & clearing alert!
      window.open(whatsappURL, '_blank');
    }, 1800);
      
      // // Success
      // setAlert({
      //   type: 'success',
      //   message: 'Thank you! Your quote request has been submitted successfully. We will contact you within 24 hours.'
      // });
      
      // // Reset form
      // setFormData({
      //   name: '', email: '', phone: '', projectType: '', budget: '', timeline: '', message: ''
      // });
      // setErrors({});
      
      // // Close form after 3 seconds
      // setTimeout(() => {
      //   onClose();
      //   setAlert(null);
      // }, 3000);
      
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Sorry, there was an error submitting your request. Please try again or call us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onClose]);

  const closeAlert = useCallback(() => {
    setAlert(null);
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '', email: '', phone: '', projectType: '', budget: '', timeline: '', message: ''
      });
      setErrors({});
      setAlert(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {alert && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Get Your Free Quote</h2>
              <p className="text-gray-600 mt-1">Tell us about your project and we'll provide a detailed estimate</p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
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
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-amber-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
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
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-amber-500'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

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
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.phone 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-amber-500'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.projectType 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-amber-500'
                  }`}
                >
                  <option value="">Select Project Type</option>
                  <option value="residential">Residential Interior</option>
                  <option value="commercial">Commercial Interior</option>
                  <option value="office">Office Design</option>
                  <option value="renovation">Renovation</option>
                  <option value="consultation">Design Consultation</option>
                  <option value="other">Other</option>
                </select>
                {errors.projectType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.projectType}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Budget Range</option>
                  <option value="under-3l">Under ₹3,00,000</option>
                  <option value="3l-5l">₹3,00,000 - ₹5,00,000</option>
                  <option value="5l-10l">₹5,00,000 - ₹10,00,000</option>
                  <option value="10l-15l">₹10,00,000 - ₹15,00,000</option>
                  <option value="15l-25l">₹15,00,000 - ₹25,00,000</option>
                  <option value="above-25l">Above ₹25,00,000</option>
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
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Details
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.message 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-amber-500'
                }`}
                placeholder="Tell us more about your project, requirements, style preferences, space details, etc."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    <span>Submit Quote Request</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 disabled:text-gray-500 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 size={18} className="text-amber-600" />
                  </div>
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">What happens next?</p>
                    <ul className="space-y-1 text-amber-700">
                      <li>• Our design consultant will call you within 24 hours</li>
                      <li>• We'll schedule a free consultation at your convenience</li>
                      <li>• Receive a detailed project proposal and quote</li>
                      <li>• No obligation - completely free consultation</li>
                    </ul>
                  </div>
                </div>
              </div>
          </form>
        </div>
      </div>
    </>
  );
});

// Main Landing Component
const Landing = () => {
  const heroImages = useMemo(() => [
    "src/assets/images/img18.jpg",
    "src/assets/images/img19.jpg", 
    "src/assets/images/img20.jpg",
    "src/assets/images/img21.jpg"
  ], []);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Optimized auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Listen for custom events
  useEffect(() => {
    const handleOpenQuoteForm = () => setFormOpen(true);
    document.addEventListener('openQuoteForm', handleOpenQuoteForm);
    return () => document.removeEventListener('openQuoteForm', handleOpenQuoteForm);
  }, []);

  const navItems = useMemo(() => [
    { name: 'Home', href: '#home', isButton: false },
    { name: 'How It Works', href: '#how-it-works', isButton: false },
    { name: 'About', href: '#about', isButton: false },
    { name: 'Portfolio', href: '#portfolio', isButton: false },
    { name: 'Testimonials', href: '#testimonials', isButton: false },
    { name: 'FAQ', href: '#faq', isButton: false },
    { name: 'Get Quote', href: '#get-quote', isButton: true },
  ], []);

  const processSteps = useMemo(() => [
    {
      stepNumber: "01",
      heading: "Understanding Your Vision",
      description: "Our journey begins with you — your ideas, your lifestyle, your expectations. We start with a personal consultation where we listen carefully to what you want, how you live, and what matters most to you in a home. We discuss your aesthetic preferences, daily routines, space constraints, and budget expectations. This collaborative session helps us understand your story and build a clear vision of your ideal space.",
      images: {
        large: "src/assets/images/img2.jpg",
      }
    },
    {
      stepNumber: "02",
      heading: "3D Visualization & Planning",
      description: "Using detailed architectural plans and advanced 3D rendering tools, we build a digital model of your interior. You'll see your future home from every angle, with realistic lighting and accurate proportions. This immersive experience allows you to walk through your space virtually, make changes, and understand exactly how your interior will look and function before execution begins.",
      images: {
        large: "src/assets/images/img5.jpg",
      }
    },
    {
      stepNumber: "03",
      heading: "Premium Material Selection",
      description: "Our material experts handpick premium-quality resources suited for durability, elegance, and long-term comfort. From engineered wood to high-gloss laminates, every element is chosen for both aesthetic appeal and daily usability. Your custom furniture goes into production at our state-of-the-art facility with strict quality control protocols ensuring perfection.",
      images: {
        large: "src/assets/images/img8.jpg",
      }
    },
    {
      stepNumber: "04",
      heading: "Secure Packing & Dispatch",
      description: "Each component is wrapped using shock-resistant packaging and protective cushioning to safeguard it during transit. Our logistics team plans and schedules delivery with precision, coordinating with you for suitable timing. Your dream design is handled with the same care in shipping as it was in design and manufacturing.",
      images: {
        large: "src/assets/images/img11.jpg",
      }
    },
    {
      stepNumber: "05",
      heading: "Professional Installation",
      description: "Our skilled installation team transforms your space according to the finalized plan. Every element is assembled on-site with perfect alignment and spotless finish. We handle all technical aspects including electrical and plumbing adjustments. The final handover reveals your beautiful, functional, custom-designed home exactly as envisioned.",
      images: {
        large: "src/assets/images/img15.jpg",
      }
    }
  ], []);

  const handleNavClick = useCallback((href) => {
    setMenuOpen(false);
    if (href === '#get-quote') {
      setFormOpen(true);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <a 
              href="#home" 
              className="flex items-center transform hover:scale-105 transition-transform duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
            >
              <div>
                <img 
                  src="src/assets/images/img17.jpg"
                  alt="Swagruha Interiors" 
                  className="rounded-2xl h-24 lg:h-32 w-auto max-w-[900px] lg:max-w-[1200px] object-contain shadow-lg"
                />
              </div>
            </a>
            
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

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl z-50 transform transition-transform duration-300 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}>
        <div className="p-6 pt-20">
          <div className="p-4 mb-8 mx-auto w-fit">
            <img 
              src="src/assets/images/img17.jpg"
              alt="Swagruha Interiors" 
              className="h-28 w-[720px] max-w-[720px] object-contain"
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

      <section id="home" className="relative h-screen overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        
        <div className="absolute inset-0 bg-black/40"></div>
        
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
              className="bg-amber-400 hover:bg-white hover:text-amber-500 text-black px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center gap-2 cursor-pointer"
            >
              Get Your Free Quote
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

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

      <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
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

      <AboutSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />

      <ConnectWithUsModal 
        isOpen={connectModalOpen} 
        onClose={() => setConnectModalOpen(false)} 
      />

      <QuoteFormModal 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
      />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Landing;