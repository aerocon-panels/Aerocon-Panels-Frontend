import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Check,
  ShieldCheck,
  Layers3,
  Headphones,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Star,
  MessageCircle,
  Building2,
  Ruler,
  HardHat,
  Home,
  BriefcaseBusiness,
  Send
} from 'lucide-react';

import './styles.css';
import { supabase } from './lib/supabaseClient';

// Gallery data is loaded from Supabase.
// Category is inferred from each title because the current gallery_items table
// does not have a separate category column.
const getGalleryCategory = (item) => {
  const title = (item?.title || '').toLowerCase();

  if (title.includes('residential')) return 'Residential';
  if (title.includes('commercial') || title.includes('office')) return 'Commercial';
  if (title.includes('interior') || title.includes('partition')) return 'Interior';
  if (
    title.includes('construction') ||
    title.includes('wall work') ||
    title.includes('installation')
  ) {
    return 'Construction';
  }

  return 'Other';
};



const products = [
  {
    title: 'Cement Boards',
    desc: 'Practical panel solutions for modern construction requirements.',
    icon: <Layers3 />,
    img: '/products/Screenshot%202026-09-21%20174934.png',
    details: {
      heading: 'Elements Collection',
      subtitle: 'Premium designer cement boards inspired by Earth, Water, and Air',
      description:
        'Elements Collection is a curated range of designer cement boards inspired by the primal forces of nature - Earth, Water, and Air. More than just surfaces, each design translates nature’s textures and elemental forms into distinctive patterns and finishes for modern interior applications. Designed for architects, interior designers and specifiers, the collection combines functional performance with elevated aesthetics to enable differentiated, design-forward interior solutions for premium residential and commercial spaces.',
      sizes: '595 mm × 595 mm Variants',
      designs:
        'Designs: 8 distinctive designer surface patterns across the Elements Collection range',
      usage:
        'Feature walls\nDecorative ceilings\nTextured walls\nLiving rooms\nEntrance areas\nOffice interiors\nRetail spaces\nHospitality spaces'
    }
  },
  {
    title: 'Partition Panels',
    desc: 'Solutions for practical interior and commercial partitions.',
    icon: <Ruler />,
    img: '/products/Screenshot%202026-09-21%20214531.png',
    details: {
      heading: 'BirlaNu Aerocon Fiber Cement Boards',
      subtitle:
        'Durable, eco-friendly boards made from cement, fly ash & fibers, used as a wood alternative for construction.',
      description:
        'BirlaNu Aerocon Fiber Cement Boards are crafted from fly ash, cellulose fibers, and fire-resistant fillers, then strengthened through high-pressure steam autoclaving for exceptional durability and dimensional stability. A superior alternative to wood, these boards are versatile, impact-resistant, and weather-resilient - offering endless design possibilities for interiors and exteriors across residential, commercial, and industrial spaces.',
      sizes:
        '2440 mm x 1219 mm & 1829 mm x 1219 mm (thickness 4mm, 6mm, 8mm, 10mm, 12mm, 14mm, 16mm, 18mm)',
      designs: 'IS:14862',
      usage:
        'False Ceiling\nPartition\nFixed Furniture\nComputer Numerical Control cutting'
    }
  },
  {
    title: 'Interior Panels',
    desc: 'Panel options for a range of interior applications.',
    icon: <Home />,
    img: '/products/Screenshot%202026-09-21%20174713.png',
    details: {
      heading: 'BirlaNu Aerocon Wall Panels',
      subtitle:
        'Pre-fabricated sandwich panels for high-speed, eco-friendly wall construction.',
      description:
        'BirlaNu Aerocon Wall Panels are advanced lightweight sandwich panels made from fibre-reinforced cement sheets and an aerated cementitious core. Designed for rapid, dry construction, they deliver excellent strength, fire resistance, and thermal insulation. Suitable for partitions, cladding, mezzanine floors, and industrial structures, they provide a durable and efficient alternative to conventional walls.',
      sizes:
        'Lengths: 2400 mm, 2700 mm, 3000mm\nWidth: 600 mm\nThicknesses: 50 mm, 75 mm,100mm',
      designs: 'IS:14862',
      usage:
        'Internal partitions\nDemountable walls\nPre frabricated structure\nMezzanine floors\nCladding'
    }
  },
  {
    title: 'Classic Series',
    desc: 'Exterior-grade designer cement boards for cladding, soffits, and façades.',
    icon: <Building2 />,
    img: '/products/Screenshot%202026-09-21%20212554.png',
    details: {
      heading: 'Classic Series',
      subtitle:
        'Exterior-grade designer cement boards for cladding, soffits, and façades.',
      description:
        'BirlaNu Aerocon Fiber Designer Boards redefine surface aesthetics by combining durability with versatile design possibilities for high-performance spaces. Engineered for both interior and exterior applications, these eco-friendly boards feature a natural grainy texture and undergo high-pressure steam curing (autoclaving) for superior visual appeal, dimensional stability, and long-term resistance to weather, termites, and water. They are available in both standard cement and designer series finishes, offering reliable performance and enhanced aesthetics.',
      sizes:
        '595 mm x 595 mm (with variant as Hill & Valley, Oceanic, Aceme, Elite)',
      designs: 'IS:14862',
      usage:
        'Interior ceilings\nExterior ceilings\nInterior cladding\nExterior cladding\nBuilding façades\nExterior soffits\nBoundary fences'
    }
  }
];

const reviews = [
  {
    name: 'Susagar Divi',
    meta: 'Local Guide • 21 reviews • 12 photos',
    rating: 5,
    time: 'a year ago',
    text: 'I really liked the material quality and servicing provided by SAAS Agency (Sadiq’s Team). Work completed in just 3 days with good finishing.',
    avatar: 'S',
    avatarClass: 'avatar-susagar'
  },
  {
    name: 'Anand S',
    meta: 'Local Guide • 21 reviews • 18 photos',
    rating: 5,
    time: '5 months ago',
    text: 'SaaS Agency have a very good product supply on time and stocked in better place to supply Us.',
    avatar: 'A',
    avatarClass: 'avatar-anand'
  },
  {
    name: 'Kandhi Sridhar Reddy',
    meta: 'Local Guide • 12 reviews • 5 photos',
    rating: 5,
    time: '7 months ago',
    text: 'Thanks SAAS ! Prompt service by just booking my requirement on call and not even visited the shop . Thanks again for the quality material and your quick supply even to about 100 kms away from your supply place',
    avatar: 'K',
    avatarClass: 'avatar-kandhi'
  },
  {
    name: 'Sidharthsidu Sidharthsidu',
    meta: '5 reviews • 1 photo',
    rating: 5,
    time: '3 months ago',
    text: 'Best service and proper communication',
    avatar: 'S',
    avatarClass: 'avatar-sid'
  },
  {
    name: 'vijaya bhaskar reddy palla',
    meta: 'Local Guide • 30 reviews • 57 photos',
    rating: 5,
    time: '4 years ago',
    text: 'Im getting the products at best prices and also very friendly service. He take care of transportation at best prices',
    avatar: 'V',
    avatarClass: 'avatar-vijaya'
  }
];

function WhatsAppIcon({ size = 27 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20.52 3.49A11.75 11.75 0 0 0 12.46 0C5.65 0 .1 5.53.1 12.35c0 2.17.57 4.29 1.66 6.15L0 24l5.64-1.5a12.34 12.34 0 0 0 5.82 1.4H12c6.82 0 12.35-5.55 12.35-12.38 0-3.3-1.28-6.42-3.83-8.73ZM12 21.6c-1.85 0-3.65-.5-5.2-1.44l-.38-.22-3.34.89.9-3.26-.25-.4A9.75 9.75 0 0 1 2.4 12.35c0-5.39 4.38-9.78 9.79-9.78 2.62 0 5.08 1.02 6.94 2.87A9.72 9.72 0 0 1 21.78 12.3C21.78 17.7 17.4 21.6 12 21.6Zm5.37-7.18c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.66.15-.19.29-.73.95-.9 1.14-.17.19-.34.21-.63.07-.29-.15-1.23-.46-2.34-1.48-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.44.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.3-.48.1-.19.05-.36-.02-.51-.08-.14-.66-1.59-.9-2.18-.24-.58-.49-.5-.66-.51l-.56-.01a1.08 1.08 0 0 0-.78.36c-.27.29-1.03 1-1.03 2.44s1.06 2.82 1.21 3.02c.15.2 2.08 3.2 5.05 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.72-.7 1.96-1.38.24-.67.24-1.25.17-1.37-.08-.12-.27-.2-.57-.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

function App() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('All');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [sent, setSent] = useState(false);
  const [selectedProductTitle, setSelectedProductTitle] = useState(null);

  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState('');

  const selectedProduct =
    products.find((p) => p.title === selectedProductTitle) || null;

  const visible = useMemo(() => {
    if (filter === 'All') return galleryItems;

    return galleryItems.filter(
      (item) => getGalleryCategory(item) === filter
    );
  }, [galleryItems, filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('show');
        }),
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((x) => observer.observe(x));

    return () => observer.disconnect();
  }, [galleryItems]);

  useEffect(() => {
    const loadGallery = async () => {
      setGalleryLoading(true);
      setGalleryError('');

      const { data, error } = await supabase
        .from('gallery_items')
        .select('id, title, type, media_url, thumbnail_url, is_published')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gallery loading error:', error);
        setGalleryItems([]);
        setGalleryError('Unable to load the gallery right now.');
      } else {
        setGalleryItems(data || []);
      }

      setGalleryLoading(false);
    };

    loadGallery();
  }, []);

  const scrollTo = (id) => {
    setMenu(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // Supabase-connected enquiry submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(false);

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.message.trim()
    ) {
      setSent('Please fill the required fields.');
      return;
    }

    const { error } = await supabase
      .from('customer_enquiries')
      .insert([
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          message: form.message.trim()
        }
      ]);

    if (error) {
      console.error('Supabase enquiry error:', error);
      setSent('Unable to submit your enquiry. Please try again.');
      return;
    }

    setForm({
      name: '',
      phone: '',
      email: '',
      message: ''
    });

    setSent(
      'Thank you! Your enquiry has been submitted successfully.'
    );

    setTimeout(() => setSent(''), 5000);
  };

  return (
    <div>
      <header>
        <div className="container nav">
          <a
            href="#home"
            className="logo"
            onClick={() => setMenu(false)}
          >
            <img
              src="/logo.png"
              alt="SaaS Agency"
              className="siteLogo"
            />
          </a>

          <nav className="navlinks">
            {[
              'home',
              'about',
              'products',
              'services',
              'gallery',
              'contact'
            ].map((x) => (
              <a key={x} href={'#' + x}>
                {x[0].toUpperCase() + x.slice(1)}
              </a>
            ))}
          </nav>

          <div className="navactions">
            <a className="btn btn-primary" href="#contact">
              Get a Quote <ArrowUpRight size={16} />
            </a>

            <button
              className="menuBtn"
              aria-label="Open menu"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <div className={'mobileMenu ' + (menu ? 'open' : '')}>
          {[
            'home',
            'about',
            'products',
            'services',
            'gallery',
            'contact'
          ].map((x) => (
            <a
              key={x}
              href={'#' + x}
              onClick={() => setMenu(false)}
            >
              {x[0].toUpperCase() + x.slice(1)}
            </a>
          ))}

          <a
            className="btn btn-primary"
            href="#contact"
            onClick={() => setMenu(false)}
          >
            Get a Quote
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <img
            className="heroImg"
            alt="Modern construction project using wall panels"
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=90"
          />

          <div className="ambient" />

          <div className="container heroContent reveal">
            <span className="pill">
              Hyderabad • Construction & Interiors
            </span>

            <h1>
              Aerocon Panels & Cement Board - High Quality Wall Solutions
            </h1>

            <p>
              Lightweight, durable and versatile panel solutions for
              modern residential, commercial and interior construction
              projects across Hyderabad.
            </p>

            <div className="heroBtns">
              <a className="btn btn-primary" href="#contact">
                Get a Free Quote <ArrowRight size={17} />
              </a>

              <a className="btn btn-secondary" href="#products">
                Explore Products
              </a>

              <a
                className="btn btn-secondary"
                href="https://wa.me/918317666756"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} /> Chat on WhatsApp
              </a>
            </div>

            <div className="trust">
              <span>Quality Materials</span>
              <span>Professional Support</span>
              <span>Fast Response</span>
              <span>Hyderabad Service</span>
            </div>
          </div>
        </section>

        <section id="about" className="section paper">
          <div className="container twoCol">
            <div className="reveal">
              <span className="eyebrow">About Aerocon Panels</span>

              <h2 className="title">
                Building Better Spaces with Aerocon Panels
              </h2>

              <p className="lead">
                Aerocon Panels provides practical and modern panel
                solutions for residential, commercial and interior
                construction requirements. Our focus is on helping
                customers choose suitable panel solutions for their
                projects while providing reliable product guidance and
                responsive service.
              </p>

              <div className="featureGrid grid">
                <div className="featureCard">
                  <div className="featureIcon">
                    <ShieldCheck size={22} />
                  </div>
                  <h3>Quality</h3>
                  <p>
                    Reliable construction panel solutions for different
                    project requirements.
                  </p>
                </div>

                <div className="featureCard">
                  <div className="featureIcon">
                    <Layers3 size={22} />
                  </div>
                  <h3>Versatility</h3>
                  <p>
                    Suitable for partitions, interiors and a variety
                    of construction applications.
                  </p>
                </div>

                <div className="featureCard">
                  <div className="featureIcon">
                    <Headphones size={22} />
                  </div>
                  <h3>Professional Support</h3>
                  <p>
                    Get guidance based on your project requirements.
                  </p>
                </div>

                <div className="featureCard">
                  <div className="featureIcon">
                    <MapPin size={22} />
                  </div>
                  <h3>Hyderabad Service</h3>
                  <p>
                    Serving customers across Hyderabad and nearby
                    locations.
                  </p>
                </div>
              </div>
            </div>

            <div className="imageCard reveal">
              <img
                alt="Construction team on a modern project site"
                src="https://afjycqtwhvcxaygukche.supabase.co/storage/v1/object/public/aerocon-photos/better.jpeg"
              />
            </div>
          </div>
        </section>

        <section id="products" className="section darkSection">
          <div className="container">
            <div className="sectionHead reveal">
              <div>
                <span className="eyebrow">Products</span>

                <h2 className="title">Our Products</h2>

                <p className="lead">
                  Panel solutions for modern construction and interior
                  applications.
                </p>
              </div>

              <a className="btn btn-secondary" href="#contact">
                Request a Quote <ArrowRight size={16} />
              </a>
            </div>

            <div className="cardGrid grid">
              {products.map((p) => {
                const isSelected =
                  selectedProductTitle === p.title;

                return (
                  <article
                    className="productCard reveal"
                    key={p.title}
                  >
                    <img src={p.img} alt={p.title} />

                    <div className="productBody">
                      <div className="pill">
                        {p.icon}
                        {p.title}
                      </div>

                      <p>{p.desc}</p>

                      <div className="productLinks">
                        <button
                          type="button"
                          className="textLink btnLink"
                          onClick={() =>
                            setSelectedProductTitle(
                              isSelected ? null : p.title
                            )
                          }
                        >
                          {isSelected
                            ? 'Hide Details'
                            : 'View Details'}{' '}
                          ↗
                        </button>

                        <a
                          className="textLink"
                          href="#contact"
                        >
                          Get Quote ↗
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {selectedProduct &&
              selectedProduct.details && (
                <div className="detailPanel">
                  <h3>
                    # {selectedProduct.details.heading}
                  </h3>

                  <h4>
                    {selectedProduct.details.subtitle}
                  </h4>

                  <p className="detailDescription">
                    {selectedProduct.details.description}
                  </p>

                  <div className="detailSection">
                    <h5>Sizes / SKUs Available</h5>

                    <p>
                      {selectedProduct.details.sizes}
                    </p>

                    <p>
                      <strong>Designs:</strong>{' '}
                      {selectedProduct.details.designs.replace(
                        'Designs: ',
                        ''
                      )}
                    </p>
                  </div>

                  <div className="detailSection">
                    <h5>Application / Area of Usage</h5>

                    <ul className="usageList">
                      {selectedProduct.details.usage
                        .split('\n')
                        .map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </section>

        <section id="services" className="section paper">
          <div className="container">
            <div className="sectionHead reveal">
              <div>
                <span className="eyebrow">Services</span>

                <h2 className="title">Our Services</h2>

                <p className="lead">
                  Support for residential, commercial and interior
                  panel requirements.
                </p>
              </div>
            </div>

            <div className="services grid">
              {[
                [
                  'Panel Supply',
                  'Supply of suitable construction and interior panel solutions.',
                  <Layers3 />
                ],
                [
                  'Project Guidance',
                  'Help customers identify suitable panel options for their requirements.',
                  <Headphones />
                ],
                [
                  'Site Requirement Support',
                  'Understand project requirements and provide appropriate product guidance.',
                  <Ruler />
                ],
                [
                  'Interior Partition Solutions',
                  'Panel solutions for offices, commercial spaces and interior projects.',
                  <BriefcaseBusiness />
                ],
                [
                  'Residential Solutions',
                  'Panel solutions for homes and residential projects.',
                  <Home />
                ],
                [
                  'Commercial Solutions',
                  'Panel solutions for offices, shops and commercial construction.',
                  <Building2 />
                ]
              ].map(([t, p, i]) => (
                <div
                  className="serviceCard reveal"
                  key={t}
                >
                  <div className="featureIcon">{i}</div>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section darkSection">
          <div className="container">
            <div className="sectionHead reveal">
              <div>
                <span className="eyebrow">
                  Why Choose Us
                </span>

                <h2 className="title">
                  A clearer way to plan your panel requirement.
                </h2>
              </div>

              <a className="btn btn-primary" href="#contact">
                Discuss Your Project
              </a>
            </div>

            <div className="reasonGrid grid">
              {[
                {
                  heading: 'Quality-focused solutions',
                  description: 'Durable panel solutions selected for reliable construction and finishing.'
                },
                {
                  heading: 'Professional guidance',
                  description: 'Get practical guidance on choosing the right panels and materials for your project.'
                },
                {
                  heading: 'Wide application range',
                  description: 'Suitable for partitions, walls, ceilings, cladding and other construction applications.'
                },
                {
                  heading: 'Responsive customer service',
                  description: 'Quick assistance from enquiry to material selection and project requirements.'
                },
                {
                  heading: 'Hyderabad-focused service',
                  description: 'Serving customers across Hyderabad and nearby areas with convenient local support.'
                },
                {
                  heading: 'Easy enquiry and quotation process',
                  description: 'Share your project requirements and get clear information for your next step.'
                }
              ].map((item, i) => (
                <div
                  className="reasonCard reveal"
                  key={item.heading}
                >
                  <div className="reasonTop">
                    <div className="reasonNo">
                      0{i + 1}
                    </div>

                    <Check color="#f6a623" />
                  </div>

                  <h3>{item.heading}</h3>

                  <p>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="section paper">
          <div className="container">
            <div className="sectionHead reveal">
              <div>
                <span className="eyebrow">Gallery</span>

                <h2 className="title">Our Gallery</h2>

                <p className="lead">
                  Explore our completed Aerocon Panel projects and quality construction work.
                </p>
              </div>
            </div>

            <div className="tabs">
              {[
                'All',
                'Residential',
                'Commercial',
                'Interior',
                'Construction'
              ].map((x) => (
                <button
                  className={
                    'tab ' +
                    (filter === x ? 'active' : '')
                  }
                  key={x}
                  onClick={() => setFilter(x)}
                >
                  {x}
                </button>
              ))}
            </div>

            {galleryLoading && (
              <p className="lead">Loading gallery...</p>
            )}

            {!galleryLoading && galleryError && (
              <p className="lead">{galleryError}</p>
            )}

            {!galleryLoading && !galleryError && visible.length === 0 && (
              <p className="lead">No published gallery items found.</p>
            )}

            {!galleryLoading && !galleryError && visible.length > 0 && (
              <div className="gallery grid">
                {visible.map((g) => {
                  const mediaUrl = g.media_url || g.thumbnail_url;
                  const poster = g.thumbnail_url || undefined;
                  const isVideo = g.type?.toLowerCase() === 'video';

                  return (
                    <div
                      className="galleryItem reveal"
                      key={g.id}
                    >
                      {isVideo ? (
                        <video
                          controls
                          playsInline
                          preload="metadata"
                          poster={poster}
                          src={mediaUrl}
                          aria-label={g.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={g.title}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

<section id="reviews" className="section darkSection">
          <div className="container reviewContainer">
            <div className="reveal">
              <span className="eyebrow">Reviews</span>

              <h2 className="title">
                Customer Reviews
              </h2>
            </div>

            <div className="reviewFeed">
              {reviews.map((review) => (
                <article
                  className="googleReview reveal"
                  key={review.name}
                >
                  <div className="reviewHeader">
                    <div
                      className={
                        `reviewAvatar ${review.avatarClass}`
                      }
                    >
                      {review.avatar}
                    </div>

                    <div className="reviewIdentity">
                      <h3>{review.name}</h3>

                      <div className="reviewMeta">
                        {review.meta}
                      </div>
                    </div>

                    <div className="reviewMenu">⋮</div>
                  </div>

                  <div
                    className="reviewStars"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {'★'.repeat(review.rating)}

                    <span>
                      {'★'.repeat(5 - review.rating)}
                    </span>
                  </div>

                  <div className="reviewTime">
                    {review.time}
                  </div>

                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section darkSection">
          <div className="container">
            <div className="areaBox reveal">
              <span className="eyebrow">
                Local Service
              </span>

              <h2
                className="title"
                style={{
                  fontSize: 'clamp(2rem,4vw,3.4rem)'
                }}
              >
               Located in Hyderabad and serving across Telangana and Andhra Pradesh.
              </h2>

              <p className="lead">
                Aerocon Panels provides residential, commercial and interior
                panel solutions across Hyderabad and throughout Telangana and
                Andhra Pradesh.
              </p>

              <div className="areaTags">
                {[
                  'Hyderabad',
                  'Gachibowli',
                  'Madhapur',
                  'Kondapur',
                  'Hitech City',
                  'Miyapur'
                ].map((x) => (
                  <span
                    className="areaTag"
                    key={x}
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section darkSection">
          <div className="container">
            <div className="reveal">
              <span className="eyebrow">Contact</span>

              <h2 className="title">
                Tell Us About Your Project
              </h2>

              <p className="lead">
                Looking for the right panel solution?
                Send us your requirements and our team
                can get back to you.
              </p>
            </div>

            <div className="contactGrid">
              <div className="contactCard reveal">
                <h3>Contact Aerocon Panels</h3>

                <div className="contactList">
                  <div className="contactRow">
                    <Phone size={19} />

                    <div>
                      <small>WhatsApp</small>

                      <a
                        href="https://wa.me/918317666756"
                        target="_blank"
                        rel="noreferrer"
                      >
                        8317666756
                      </a>

                      <br />

                      <a
                        href="https://wa.me/919381789564"
                        target="_blank"
                        rel="noreferrer"
                      >
                        9381789564
                      </a>
                    </div>
                  </div>

                  <div className="contactRow">
                    <MapPin size={19} />

                    <div>
                      <small>Shop Address</small>

                      <div>
                        Plot No. 19, H.No. 1-121/19,
                        Sonata Lane, Miyapur, Allwyn X
                        Roads, Hyderabad, Telangana.
                      </div>
                    </div>
                  </div>

                  <div className="contactRow">
                    <ExternalLink size={19} />

                    <div>
                      <small>Location</small>

                      <a
                        href="https://maps.app.goo.gl/531atkbHnKo6R56E8?g_st=awb"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Google Maps
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  className="btn btn-primary"
                  style={{ marginTop: 24 }}
                  href="https://maps.app.goo.gl/531atkbHnKo6R56E8?g_st=awb"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions <ExternalLink size={16} />
                </a>
              </div>

              <div className="contactCard reveal">
                <h3>Send an Enquiry</h3>

                <form onSubmit={handleSubmit}>
                  <div className="formGrid">
                    <div className="field">
                      <label htmlFor="name">
                        Name *
                      </label>

                      <input
                        id="name"
                        value={form.name}
                        maxLength={100}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value
                          })
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="phone">
                        Phone *
                      </label>

                      <input
                        id="phone"
                        value={form.phone}
                        maxLength={20}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value
                          })
                        }
                        required
                      />
                    </div>

                    <div className="field full">
                      <label htmlFor="email">
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        maxLength={200}
                        value={form.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="field full">
                      <label htmlFor="message">
                        Message *
                      </label>

                      <textarea
                        id="message"
                        maxLength={2000}
                        value={form.message}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            message: e.target.value
                          })
                        }
                        required
                        placeholder="Tell us about your project..."
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    type="submit"
                    style={{ marginTop: 16 }}
                  >
                    <Send size={16} /> Send Enquiry
                  </button>

                  <div className="formMsg">
                    {typeof sent === 'string'
                      ? sent
                      : ''}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section"
          style={{ paddingTop: 0 }}
        >
          <div className="container">
            <div className="mapCard">
              <iframe
                className="mapFrame"
                title="Aerocon Panels shop location"
                src="https://www.google.com/maps?q=Plot%20No.%2019,%20H.No.%201-121/19,%20Sonata%20Lane,%20Miyapur,%20Hyderabad&output=embed"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footerGrid">
            <div>
              <div className="logo">
                <img
                  src="/logo.png"
                  alt="SaaS Agency"
                  className="siteLogo"
                />
              </div>

              <p style={{ maxWidth: 330 }}>
                Modern construction, partition and interior
                panel solutions for projects across
                Hyderabad.
              </p>
            </div>

            <div>
              <h4>Quick Links</h4>

              <div className="footerLinks">
                {[
                  'home',
                  'about',
                  'products',
                  'services',
                  'gallery',
                  'contact'
                ].map((x) => (
                  <a
                    key={x}
                    href={'#' + x}
                  >
                    {x[0].toUpperCase() + x.slice(1)}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4>Reach Us</h4>

              <p>
                WhatsApp:{' '}
                <a
                  href="https://wa.me/918317666756"
                  target="_blank"
                  rel="noreferrer"
                >
                  8317666756
                </a>
                ,{' '}
                <a
                  href="https://wa.me/919381789564"
                  target="_blank"
                  rel="noreferrer"
                >
                  9381789564
                </a>
              </p>

              <p>
                Plot No. 19, H.No. 1-121/19,
                Sonata Lane, Miyapur, Allwyn X
                Roads, Hyderabad, Telangana.
              </p>
            </div>

            <div>
              <h4>Follow us on</h4>

              <div className="footerLinks">
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">LinkedIn</a>
                <a href="#">YouTube</a>
              </div>
            </div>
          </div>

          <div className="footerBottom">
            <span>
              © 2026 Aerocon Panels. All Rights Reserved.
            </span>

            <span>
              Gallery and enquiries powered by Supabase.
            </span>
          </div>
        </div>
      </footer>

      <a
        className="wa"
        href="https://wa.me/919381789564"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Aerocon Panels on WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}

createRoot(
  document.getElementById('root')
).render(<App />);