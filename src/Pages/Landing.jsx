import React, { useState, useEffect, useRef } from 'react';
import { Phone, Menu, X, ChevronRight, Star, CheckCircle, Instagram, Twitter, Linkedin, Mail, MessageCircle, Users, Award, Heart, TrendingUp, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

// Intersection Observer Hook for animations
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
};

// Stats Counter Component
const StatCounter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const startCount = 0;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startCount) + startCount);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-bold text-2xl lg:text-3xl text-amber-600">
      {prefix}{count}{suffix}
    </span>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`group bg-white p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
};

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

// About Section Component - UPDATED with new colors
const AboutSection = () => {
  const [titleRef, titleVisible] = useIntersectionObserver();
  const [contentRef, contentVisible] = useIntersectionObserver();
  const [imageRef, imageVisible] = useIntersectionObserver();
  const [statsRef, statsVisible] = useIntersectionObserver();

  const features = [
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
  ];

  const stats = [
    { label: "Projects Completed", value: 500, suffix: "+" },
    { label: "Happy Clients", value: 450, suffix: "+" },
    { label: "Years Experience", value: 12, suffix: "" },
    { label: "Design Awards", value: 25, suffix: "+" }
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Content */}
          <div ref={contentRef} className={`transform transition-all duration-1000 delay-300 ${
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
                <button className="group bg-orange-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:shadow-lg transform hover:scale-105">
                  Start Your Journey
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-gray-300 hover:border-amber-500 text-gray-700 hover:text-amber-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                  View Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className={`transform transition-all duration-1000 delay-500 ${
            imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="relative group">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <ImageWithLoading 
                  src="src/assets/images/img16.jpg" 
                  alt="Swagruha Interiors Showcase" 
                  className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay with floating elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Floating Stats Card */}
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

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-60 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500 delay-100"></div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 150}
              />
            ))}
          </div>
        </div>

        {/* Stats Section - UPDATED COLORS */}
        <div ref={statsRef} className={`bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl p-8 lg:p-12 transform transition-all duration-1000 ${
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

          {/* Trust Indicators */}
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
};

// Portfolio Section Component with Advanced Animations and Effects
const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [sectionRef, sectionVisible] = useIntersectionObserver();
  const [headerRef, headerVisible] = useIntersectionObserver();
  const [filterRef, filterVisible] = useIntersectionObserver();
  const [gridRef, gridVisible] = useIntersectionObserver();

  // Portfolio projects data
  const portfolioProjects = [
    {
      id: 1,
      title: "Modern Living Spaces",
      category: "residential",
      description: "Contemporary 3BHK apartment with minimalist design and smart storage solutions",
      image: "src/assets/images/portfolio1.jpg",
      beforeImage: "src/assets/images/before1.jpg",
      client: "Sharma Family",
      location: "Mumbai",
      year: "2024",
      area: "1,200 sq ft",
      duration: "45 days",
      budget: "₹8,50,000",
      tags: ["Modern", "Minimalist", "Smart Storage"],
      gallery: [
        "src/assets/images/gallery1-1.jpg",
        "src/assets/images/gallery1-2.jpg",
        "src/assets/images/gallery1-3.jpg"
      ]
    },
    {
      id: 2,
      title: "Luxury Villa Interior",
      category: "luxury",
      description: "Opulent villa design with premium materials and custom furniture",
      image: "src/assets/images/portfolio2.jpg",
      beforeImage: "src/assets/images/before2.jpg",
      client: "Patel Residence",
      location: "Bangalore",
      year: "2024",
      area: "3,500 sq ft",
      duration: "75 days",
      budget: "₹25,00,000",
      tags: ["Luxury", "Custom Furniture", "Premium"],
      gallery: [
        "src/assets/images/gallery2-1.jpg",
        "src/assets/images/gallery2-2.jpg",
        "src/assets/images/gallery2-3.jpg"
      ]
    },
    {
      id: 3,
      title: "Corporate Office Design",
      category: "commercial",
      description: "Modern office space designed for productivity and collaboration",
      image: "src/assets/images/portfolio3.jpg",
      beforeImage: "src/assets/images/before3.jpg",
      client: "Tech Solutions Pvt Ltd",
      location: "Pune",
      year: "2024",
      area: "2,800 sq ft",
      duration: "60 days",
      budget: "₹15,00,000",
      tags: ["Corporate", "Modern", "Collaborative"],
      gallery: [
        "src/assets/images/gallery3-1.jpg",
        "src/assets/images/gallery3-2.jpg",
        "src/assets/images/gallery3-3.jpg"
      ]
    },
    {
      id: 4,
      title: "Boutique Restaurant",
      category: "commercial",
      description: "Intimate dining space with warm ambiance and artistic elements",
      image: "src/assets/images/portfolio4.jpg",
      beforeImage: "src/assets/images/before4.jpg",
      client: "Spice Garden Restaurant",
      location: "Delhi",
      year: "2023",
      area: "1,800 sq ft",
      duration: "50 days",
      budget: "₹12,00,000",
      tags: ["Restaurant", "Artistic", "Warm Ambiance"],
      gallery: [
        "src/assets/images/gallery4-1.jpg",
        "src/assets/images/gallery4-2.jpg",
        "src/assets/images/gallery4-3.jpg"
      ]
    },
    {
      id: 5,
      title: "Traditional Home Makeover",
      category: "residential",
      description: "Blend of traditional and contemporary design elements",
      image: "src/assets/images/portfolio5.jpg",
      beforeImage: "src/assets/images/before5.jpg",
      client: "Kumar Family",
      location: "Jaipur",
      year: "2023",
      area: "2,200 sq ft",
      duration: "65 days",
      budget: "₹18,00,000",
      tags: ["Traditional", "Contemporary", "Cultural"],
      gallery: [
        "src/assets/images/gallery5-1.jpg",
        "src/assets/images/gallery5-2.jpg",
        "src/assets/images/gallery5-3.jpg"
      ]
    },
    {
      id: 6,
      title: "Penthouse Paradise",
      category: "luxury",
      description: "Sky-high luxury living with panoramic city views",
      image: "src/assets/images/portfolio6.jpg",
      beforeImage: "src/assets/images/before6.jpg",
      client: "Elite Towers",
      location: "Mumbai",
      year: "2023",
      area: "4,200 sq ft",
      duration: "90 days",
      budget: "₹35,00,000",
      tags: ["Penthouse", "City Views", "Ultra Luxury"],
      gallery: [
        "src/assets/images/gallery6-1.jpg",
        "src/assets/images/gallery6-2.jpg",
        "src/assets/images/gallery6-3.jpg"
      ]
    },
    {
      id: 7,
      title: "Cozy Studio Apartment",
      category: "residential",
      description: "Space-efficient design for modern urban living",
      image: "src/assets/images/portfolio7.jpg",
      beforeImage: "src/assets/images/before7.jpg",
      client: "Young Professional",
      location: "Bangalore",
      year: "2024",
      area: "650 sq ft",
      duration: "30 days",
      budget: "₹4,50,000",
      tags: ["Studio", "Space Efficient", "Urban"],
      gallery: [
        "src/assets/images/gallery7-1.jpg",
        "src/assets/images/gallery7-2.jpg",
        "src/assets/images/gallery7-3.jpg"
      ]
    },
    {
      id: 8,
      title: "Hotel Suite Design",
      category: "commercial",
      description: "Luxury hotel suite with world-class amenities",
      image: "src/assets/images/portfolio8.jpg",
      beforeImage: "src/assets/images/before8.jpg",
      client: "Grand Plaza Hotel",
      location: "Goa",
      year: "2023",
      area: "800 sq ft",
      duration: "40 days",
      budget: "₹10,00,000",
      tags: ["Hotel", "Luxury", "Hospitality"],
      gallery: [
        "src/assets/images/gallery8-1.jpg",
        "src/assets/images/gallery8-2.jpg",
        "src/assets/images/gallery8-3.jpg"
      ]
    },
    {
      id: 9,
      title: "Smart Home Integration",
      category: "luxury",
      description: "Cutting-edge smart home with automated systems",
      image: "src/assets/images/portfolio9.jpg",
      beforeImage: "src/assets/images/before9.jpg",
      client: "Tech Entrepreneur",
      location: "Hyderabad",
      year: "2024",
      area: "2,800 sq ft",
      duration: "70 days",
      budget: "₹22,00,000",
      tags: ["Smart Home", "Automation", "Technology"],
      gallery: [
        "src/assets/images/gallery9-1.jpg",
        "src/assets/images/gallery9-2.jpg",
        "src/assets/images/gallery9-3.jpg"
      ]
    }
  ];

  // Filter categories
  const filterCategories = [
    { key: 'all', label: 'All Projects', icon: TrendingUp },
    { key: 'residential', label: 'Residential', icon: Users },
    { key: 'commercial', label: 'Commercial', icon: Award },
    { key: 'luxury', label: 'Luxury', icon: Sparkles }
  ];

  // Filter projects based on active filter
  useEffect(() => {
    const filtered = activeFilter === 'all' 
      ? portfolioProjects 
      : portfolioProjects.filter(project => project.category === activeFilter);
    setFilteredProjects(filtered);
  }, [activeFilter]);

  // Enhanced Project Card Component with advanced animations
  const ProjectCard = ({ project, index, delay = 0 }) => {
    const [cardRef, cardVisible] = useIntersectionObserver();
    const [imageLoaded, setImageLoaded] = useState(false);
    const isHovered = hoveredProject === project.id;

    return (
      <div
        ref={cardRef}
        className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transform transition-all duration-700 ease-out hover:shadow-2xl hover:-translate-y-3 ${
          cardVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-95'
        }`}
        style={{ 
          transitionDelay: `${delay}ms`,
          transformOrigin: 'center bottom'
        }}
        onMouseEnter={() => setHoveredProject(project.id)}
        onMouseLeave={() => setHoveredProject(null)}
      >
        {/* Glowing border effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm -z-10 scale-105`}></div>
        
        {/* Image Container with advanced effects */}
        <div className="relative h-64 lg:h-72 overflow-hidden bg-gray-200">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
            </div>
          )}
          
          {/* Main project image */}
          <ImageWithLoading 
            src={project.image} 
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-all duration-300 ${
              project.category === 'residential' ? 'bg-blue-500/90 text-white' :
              project.category === 'commercial' ? 'bg-green-500/90 text-white' :
              'bg-purple-500/90 text-white'
            } ${isHovered ? 'scale-110 shadow-lg' : ''}`}>
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </span>
          </div>
          
          {/* Quick action buttons */}
          <div className={`absolute top-4 right-4 flex gap-2 transform transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}>
            <button
              onClick={() => {
                setLightboxImage(project);
                setLightboxOpen(true);
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <Eye size={16} />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
              <Heart size={16} />
            </button>
          </div>

          {/* Floating stats on hover */}
          <div className={`absolute bottom-4 left-4 right-4 transform transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3">
              <div className="flex justify-between items-center text-xs">
                <div className="text-center">
                  <div className="font-bold text-amber-600">{project.area}</div>
                  <div className="text-gray-600">Area</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-amber-600">{project.duration}</div>
                  <div className="text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-amber-600">{project.budget}</div>
                  <div className="text-gray-600">Budget</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Project title and location */}
          <div className="mb-4">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-gray-600 text-sm font-medium mb-3">
              📍 {project.location} • {project.year}
            </p>
            <p className="text-gray-700 leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Client info and action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                <Users size={16} className="text-amber-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{project.client}</div>
                <div className="text-xs text-gray-500">Client</div>
              </div>
            </div>
            
            <button className="group/btn bg-gray-100 hover:bg-amber-500 text-gray-700 hover:text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm transform hover:scale-105">
              View Details
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Hover reveal: Before/After indicator */}
        <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform transition-all duration-500 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}></div>
      </div>
    );
  };

  // Enhanced Lightbox Component
  const Lightbox = ({ isOpen, project, onClose }) => {
    if (!isOpen || !project) return null;

    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl transform transition-all duration-500">
          {/* Lightbox Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
              <p className="text-gray-600">{project.location} • {project.year}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Lightbox Content */}
          <div className="p-6">
            {/* Before/After Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Before</h3>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <ImageWithLoading 
                    src={project.beforeImage} 
                    alt={`${project.title} - Before`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-amber-600">After</h3>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <ImageWithLoading 
                    src={project.image} 
                    alt={`${project.title} - After`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Project Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-semibold">{project.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-semibold">{project.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-semibold">{project.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{project.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-semibold text-amber-600">{project.budget}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Description</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{project.description}</p>
                
                <h4 className="font-semibold mb-2 text-gray-800">Key Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Project Gallery</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {project.gallery.map((image, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <ImageWithLoading 
                      src={image} 
                      alt={`${project.title} - Gallery ${index + 1}`}
                      className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-amber-50 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-5 animate-bounce-slow"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-3 animate-spin-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Award size={16} className="fill-current animate-pulse" />
              Our Portfolio
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Our Beautiful
              <span className="block text-amber-600">Design Projects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our diverse portfolio of stunning interior designs that showcase our expertise and creativity
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div ref={filterRef} className={`transform transition-all duration-1000 delay-300 ${
          filterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filterCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.key}
                  onClick={() => setActiveFilter(category.key)}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeFilter === category.key
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600 shadow-md'
                  }`}
                >
                  <Icon size={18} className={`transition-transform duration-300 ${
                    activeFilter === category.key ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  {category.label}
                  {activeFilter === category.key && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className={`transform transition-all duration-1000 delay-500 ${
          gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 mb-12">
            {filteredProjects.slice(0, visibleProjects).map((project, index) => (
              <ProjectCard
                key={`${project.id}-${activeFilter}`}
                project={project}
                index={index}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleProjects < filteredProjects.length && (
            <div className="text-center">
              <button
                onClick={() => setVisibleProjects(prev => prev + 3)}
                className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 mx-auto"
              >
                Load More Projects
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>

        {/* Portfolio Stats */}
        <div className="mt-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Portfolio Highlights
            </h3>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Our portfolio represents years of dedication to creating exceptional spaces
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                <StatCounter end={150} suffix="+" duration={2000} />
              </div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                Completed Projects
              </p>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                <StatCounter end={25} suffix="+" duration={2200} />
              </div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                Awards Won
              </p>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                <StatCounter end={98} suffix="%" duration={2400} />
              </div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                Client Satisfaction
              </p>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                <StatCounter end={50} suffix="+" duration={2600} />
              </div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                Cities Covered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox 
        isOpen={lightboxOpen} 
        project={lightboxImage} 
        onClose={() => {
          setLightboxOpen(false);
          setLightboxImage(null);
        }} 
      />

      {/* Enhanced CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};



// Enhanced Testimonials Section with 6 Cards and Premium Effects
// Fixed Testimonials Section with Better Hover Effects - UPDATED COLORS
const TestimonialsSection = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destroyingCard, setDestroyingCard] = useState(null);
  const [sectionRef, sectionVisible] = useIntersectionObserver();
  const [cardsRef, cardsVisible] = useIntersectionObserver();

  const testimonials = [
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
  ];

  // Slower auto-rotate with destruction effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning && hoveredCard === null) {
        handleCardTransition();
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [activeCard, isTransitioning, hoveredCard]);

  const handleCardTransition = () => {
    setIsTransitioning(true);
    setDestroyingCard(activeCard);

    setTimeout(() => {
      const nextIndex = (activeCard + 1) % testimonials.length;
      setActiveCard(nextIndex);
      
      setTimeout(() => {
        setDestroyingCard(null);
        setIsTransitioning(false);
      }, 800);
    }, 1500);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={`${
              index < rating 
                ? 'text-amber-400 fill-current' 
                : 'text-gray-300'
            } transition-colors duration-300`}
          />
        ))}
      </div>
    );
  };

  const TestimonialCard = ({ testimonial, index, isActive, isDestroying }) => {
    const [cardRef, cardVisible] = useIntersectionObserver();
    const isHovered = hoveredCard === index;
    const isInBackground = hoveredCard !== null && hoveredCard !== index;
    
    // Fixed card state classes with reduced scaling and faster transitions
    const getCardClasses = () => {
      let baseClasses = "relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 transform transition-all duration-300 ease-out cursor-pointer";
      
      if (isDestroying) {
        return `${baseClasses} opacity-0 scale-75 -rotate-12 translate-y-12 blur-sm shadow-none`;
      }
      
      if (isHovered) {
        return `${baseClasses} opacity-100 scale-105 shadow-xl ring-2 ring-amber-300 z-30 bg-gradient-to-br from-white to-amber-50/30`;
      }
      
      if (isInBackground) {
        return `${baseClasses} opacity-40 scale-98 blur-sm shadow-md z-5`;
      }
      
      if (isActive) {
        return `${baseClasses} opacity-100 scale-102 shadow-lg ring-1 ring-amber-200 z-20`;
      }
      
      return `${baseClasses} opacity-90 scale-100 shadow-md hover:shadow-lg z-10`;
    };

    return (
      <div
        ref={cardRef}
        className={`${getCardClasses()} ${
          cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ 
          transitionDelay: cardVisible ? `${index * 100}ms` : '0ms', // Faster stagger
          animation: (isActive || isHovered) ? 'subtle-glow 4s infinite' : 'none',
          transformOrigin: 'center center',
          filter: isInBackground ? 'blur(1px)' : 'blur(0px)',
          // Reduced and softer box shadows
          boxShadow: isHovered ? 
            '0 10px 20px -6px rgba(0, 0, 0, 0.10), 0 0 0 1px rgba(71, 85, 105, 0.15), 0 0 20px rgba(71, 85, 105, 0.07)' :
        isActive ? 
            '0 8px 18px -6px rgba(0, 0, 0, 0.09), 0 0 12px rgba(71, 85, 105, 0.06)' :
            '0 3px 10px -4px rgba(0, 0, 0, 0.05)',

        backgroundColor: isHovered ? 'rgba(248, 250, 252, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        border: isActive ? '1px solid rgba(71, 85, 105, 0.2)' : '1px solid rgba(226, 232, 240, 0.5)'
        }}
        onMouseEnter={() => {
          if (!isTransitioning) {
            setHoveredCard(index);
            setActiveCard(index);
          }
        }}
        onMouseLeave={() => {
          setHoveredCard(null);
        }}
      >
        {/* Subtle glowing border effect */}
        {(isHovered || isActive) && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 opacity-15 animate-pulse blur-sm -z-10"></div>
        )}

        {/* Destruction Particle Effects */}
        {isDestroying && (
          <>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 80}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </>
        )}

        {/* Smaller decorative elements */}
        <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full opacity-15 transition-all duration-500 ${
          isHovered ? 'animate-spin-slow scale-125 opacity-25' : 'animate-pulse'
        }`}></div>
        <div className={`absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 transition-all duration-500 ${
          isHovered ? 'animate-bounce-slow scale-110 opacity-20' : ''
        }`}></div>
        
        {/* Smaller quote icon */}
        <div className={`absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'shadow-amber-300 shadow-md scale-110' : 'shadow-amber-200 shadow-sm'
        }`}>
          <span className="text-xl text-amber-600 font-bold">"</span>
        </div>

        {/* Smaller client image */}
        <div className="flex justify-center mb-5 mt-4">
          <div className="relative">
            <div className={`w-20 h-20 rounded-full overflow-hidden border-3 transition-all duration-300 ${
              isHovered ? 'border-amber-400 shadow-amber-200 shadow-md scale-110' : 'border-amber-200 shadow-sm'
            }`}>
              <ImageWithLoading 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Smaller online indicator */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}>
              <div className="w-full h-full rounded-full bg-green-500 animate-ping opacity-60"></div>
            </div>
            
            {/* Subtle halo effect */}
            {isHovered && (
              <div className="absolute inset-0 rounded-full bg-amber-300 opacity-20 animate-ping scale-125"></div>
            )}
          </div>
        </div>

        {/* Enhanced Rating */}
        <div className="flex justify-center">
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Quote with subtle enhancement */}
        <p className={`text-base leading-relaxed mb-6 text-center italic font-medium transition-all duration-300 ${
          isHovered ? 'text-gray-900 font-semibold' : 'text-gray-700'
        }`}>
          "{testimonial.quote}"
        </p>

        {/* Improved client info card */}
        <div className={`text-center mb-5 p-3 rounded-xl transition-all duration-300 ${
          isHovered ? 
          'bg-gradient-to-r from-amber-50/50 to-white border border-amber-100' :
          'bg-gradient-to-r from-gray-50/50 to-white'
        }`}>
          <h4 className={`text-lg font-bold mb-1 transition-all duration-300 ${
            isHovered ? 'text-amber-800' : 'text-gray-900'
          }`}>
            {testimonial.name}
          </h4>
          <p className={`font-semibold mb-1 transition-all duration-300 ${
            isHovered ? 'text-amber-700' : 'text-amber-600'
          }`}>
            {testimonial.role}
          </p>
          <p className={`text-sm transition-all duration-300 ${
            isHovered ? 'text-gray-700' : 'text-gray-500'
          }`}>
            📍 {testimonial.location}
          </p>
        </div>

        {/* Improved project details card */}
        <div className={`rounded-xl p-4 space-y-2 transition-all duration-300 border ${
          isHovered ? 
          'bg-gradient-to-r from-amber-50/30 to-white border-amber-150' :
          'bg-gradient-to-r from-gray-50/50 to-gray-100/50 border-gray-150'
        }`}>
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium transition-all duration-300 ${
              isHovered ? 'text-amber-700' : 'text-gray-600'
            }`}>Project:</span>
            <span className={`font-semibold transition-all duration-300 ${
              isHovered ? 'text-amber-800' : 'text-gray-800'
            }`}>{testimonial.project}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium transition-all duration-300 ${
              isHovered ? 'text-amber-700' : 'text-gray-600'
            }`}>Duration:</span>
            <span className={`font-semibold transition-all duration-300 ${
              isHovered ? 'text-amber-800' : 'text-amber-600'
            }`}>{testimonial.duration}</span>
          </div>
        </div>

        {/* Smaller verified badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all duration-300 ${
            isHovered ? 
            'bg-gradient-to-r from-green-200 to-green-300 text-green-900 scale-105' :
            'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
          }`}>
            <CheckCircle2 size={12} />
            Verified
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-amber-50 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full opacity-8 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-8 animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-5 animate-spin-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={sectionRef} className="text-center mb-16">
          <div className={`transform transition-all duration-800 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Heart size={16} className="fill-current animate-pulse" />
              Client Testimonials
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              What Our Clients
              <span className="block text-amber-600">Say About Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real stories from real clients who trusted us with their dream spaces
            </p>
          </div>
        </div>

        {/* 6-Card Testimonials Grid */}
        <div ref={cardsRef} className={`transform transition-all duration-800 delay-200 ${
          cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
                isActive={activeCard === index}
                isDestroying={destroyingCard === index}
              />
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setActiveCard(index);
                }
              }}
              className={`relative transition-all duration-300 ${
                index === activeCard
                  ? 'w-8 h-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full scale-110'
                  : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
            >
              {index === activeCard && (
                <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-60"></div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Footer - UPDATED COLORS */}
        <div className="mt-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Client Satisfaction Statistics
            </h3>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Numbers that speak for our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">98%</div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                Client Satisfaction
              </p>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">100%</div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                On-Time Delivery
              </p>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">95%</div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                Repeat Clients
              </p>
            </div>
            <div className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">4.9★</div>
              <p className="text-slate-200 font-medium group-hover:text-white transition-colors duration-300">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Custom CSS */}
      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.15); 
          }
          50% { 
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.25); 
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
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

      {/* Navigation - Made fully transparent and increased logo size */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo - Increased size */}
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

      {/* Mobile Menu - Updated logo size */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl z-50 transform transition-transform duration-300 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}>
        <div className="p-6 pt-20">
          <div className="p-4 mb-8 mx-auto w-fit">
            <img 
              src="src/assets/images/img17.jpg"
              alt="Swagruha Interiors" 
              className="bg-white rounded-2xl h-28 w-auto max-w-[520px] object-contain"
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
              className="bg-amber-400 hover:bg-white hover:text-amber-500 text-black px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center gap-2 cursor-pointer"
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

      {/* About Section */}
      <AboutSection />

      {/* Testimonials Section */}
        <TestimonialsSection />

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
