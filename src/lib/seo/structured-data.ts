import { BlogPost } from '@/lib/blog/types'
import { SITE_CONFIG } from '@/lib/constants'
import { BreadcrumbItem } from '@/components/navigation/Breadcrumbs'

// Core site configuration for structured data
const STRUCTURED_DATA_CONFIG = {
  baseUrl: SITE_CONFIG.url,
  siteName: 'Luis Travels',
  author: {
    name: 'Luis Gunther',
    alternateName: 'Luis Travels',
    description: 'Digital nomad, travel blogger, and autodidact sharing stories from around the world',
    jobTitle: 'Digital Nomad & Content Creator',
    nationality: 'Germany',
    email: 'hello@luistravels.com',
    image: `${SITE_CONFIG.url}/images/portrait.jpg`,
    sameAs: [
      'https://instagram.com/luistravels',
      'https://pinterest.com/luistravels',
      'https://ko-fi.com/luistravels'
    ]
  },
  organization: {
    name: 'Luis Travels',
    description: 'Digital nomad travel blog sharing authentic stories and experiences from around the world',
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    foundingDate: '2024',
    contactPoint: {
      telephone: '+49-000-000-0000', // Update with actual number
      email: 'hello@luistravels.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'German']
    }
  }
}

/**
 * Generate Person Schema for Luis Gunther - 2025 Enhanced
 * Essential for entity-based SEO and Knowledge Graph
 * NEW: Enhanced with additionalType, disambiguatingDescription, and expanded expertise
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "CreativeWork"],
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`,
    "name": STRUCTURED_DATA_CONFIG.author.name,
    "alternateName": STRUCTURED_DATA_CONFIG.author.alternateName,
    "description": STRUCTURED_DATA_CONFIG.author.description,
    "disambiguatingDescription": "German digital nomad, travel content creator, and professional photographer documenting authentic cultural experiences worldwide since 2024",
    "additionalType": [
      "https://schema.org/TravelAgent",
      "https://schema.org/Photographer",
      "https://schema.org/ContentCreator"
    ],
    "url": STRUCTURED_DATA_CONFIG.baseUrl,
    "image": {
      "@type": "ImageObject",
      "url": STRUCTURED_DATA_CONFIG.author.image,
      "width": 400,
      "height": 400,
      "caption": `${STRUCTURED_DATA_CONFIG.author.name} - Digital Nomad & Travel Blogger`,
      "contentRating": "general",
      "isFamilyFriendly": true
    },
    "jobTitle": STRUCTURED_DATA_CONFIG.author.jobTitle,
    "knowsAbout": [
      {
        "@type": "Thing",
        "name": "Digital Nomadism",
        "sameAs": "https://en.wikipedia.org/wiki/Digital_nomad",
        "additionalType": "https://schema.org/LifestyleModification"
      },
      {
        "@type": "Thing", 
        "name": "Travel Photography",
        "sameAs": "https://en.wikipedia.org/wiki/Travel_photography",
        "additionalType": "https://schema.org/PhotographAction"
      },
      {
        "@type": "Thing",
        "name": "Backpacking",
        "sameAs": "https://en.wikipedia.org/wiki/Backpacking_(travel)",
        "additionalType": "https://schema.org/TravelAction"
      },
      {
        "@type": "Thing",
        "name": "Cultural Exploration",
        "additionalType": "https://schema.org/EducationalOccupationalProgram"
      },
      {
        "@type": "Thing",
        "name": "Remote Work",
        "additionalType": "https://schema.org/WorkFromHome"
      },
      {
        "@type": "Thing",
        "name": "Content Creation",
        "additionalType": "https://schema.org/CreativeWork"
      }
    ],
    "sameAs": STRUCTURED_DATA_CONFIG.author.sameAs,
    "mainEntityOfPage": STRUCTURED_DATA_CONFIG.baseUrl,
    "nationality": {
      "@type": "Country",
      "name": STRUCTURED_DATA_CONFIG.author.nationality,
      "sameAs": "https://en.wikipedia.org/wiki/Germany"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": STRUCTURED_DATA_CONFIG.author.email,
      "contactType": "personal",
      "availableLanguage": ["English", "German"],
      "areaServed": "Worldwide"
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Digital Nomad",
      "occupationLocation": {
        "@type": "Place",
        "name": "Worldwide",
        "additionalType": "https://schema.org/TouristDestination"
      },
      "skills": [
        "Travel Writing",
        "Photography", 
        "Digital Marketing",
        "Remote Work",
        "Cultural Adaptation",
        "Visual Storytelling",
        "Social Media Strategy",
        "Cross-Cultural Communication"
      ],
      "educationRequirements": "Self-taught expertise in travel documentation and digital content creation",
      "experienceRequirements": "5+ years of international travel and remote work experience"
    },
    "brand": {
      "@type": "Brand",
      "name": "Luis Travels",
      "logo": `${STRUCTURED_DATA_CONFIG.baseUrl}/images/logo.png`,
      "slogan": "Authentic travel stories from a digital nomad perspective"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Luis Travels",
      "sameAs": STRUCTURED_DATA_CONFIG.baseUrl
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Self-Directed Learning",
      "description": "Autodidact approach to travel, photography, and content creation"
    },
    "award": "Featured Digital Nomad Content Creator 2024",
    "memberOf": {
      "@type": "Organization",
      "name": "Global Digital Nomad Community"
    }
  }
}

/**
 * Generate Website Schema - 2025 Enhanced
 * Establishes site authority and search functionality
 * NEW: Enhanced with audience, about, and advanced metadata
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["WebSite", "Blog"],
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#website`,
    "url": STRUCTURED_DATA_CONFIG.baseUrl,
    "name": STRUCTURED_DATA_CONFIG.siteName,
    "alternateName": "LT - Luis Travels",
    "description": SITE_CONFIG.description,
    "abstract": "Comprehensive digital nomad travel blog featuring authentic cultural experiences, professional photography, and practical remote work insights from around the world",
    "about": [
      {
        "@type": "Thing", 
        "name": "Digital Nomad Lifestyle",
        "sameAs": "https://en.wikipedia.org/wiki/Digital_nomad"
      },
      {
        "@type": "Thing",
        "name": "Travel Photography", 
        "sameAs": "https://en.wikipedia.org/wiki/Travel_photography"
      },
      {
        "@type": "Thing",
        "name": "Cultural Documentation"
      }
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Travel Enthusiasts, Digital Nomads, Remote Workers, Photography Enthusiasts",
      "geographicArea": "Worldwide"
    },
    "publisher": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog?search={search_term_string}`,
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
            "http://schema.org/IOSPlatform",
            "http://schema.org/AndroidPlatform"
          ]
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "SubscribeAction",
        "target": `${STRUCTURED_DATA_CONFIG.baseUrl}/newsletter`,
        "name": "Subscribe to Newsletter"
      }
    ],
    "inLanguage": ["en", "de"],
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "mainEntity": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "significantLink": [
      `${STRUCTURED_DATA_CONFIG.baseUrl}/blog`,
      `${STRUCTURED_DATA_CONFIG.baseUrl}/gallery`,
      `${STRUCTURED_DATA_CONFIG.baseUrl}/about`,
      `${STRUCTURED_DATA_CONFIG.baseUrl}/contact`
    ],
    "hasPart": [
      {
        "@type": "Blog",
        "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/#blog`
      },
      {
        "@type": "ImageGallery",
        "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/gallery/#gallery`
      }
    ],
    "keywords": "digital nomad, travel blog, remote work, travel photography, cultural exploration, backpacking, nomad lifestyle",
    "accessibilityFeature": [
      "alternativeText",
      "captions",
      "structuredNavigation",
      "readingOrder"
    ],
    "accessibilityHazard": "none",
    "accessibilityControl": ["fullKeyboardControl", "fullMouseControl", "fullTouchControl"]
  }
}

/**
 * Generate Organization Schema - 2025 Enhanced
 * For business entity recognition and brand authority
 * NEW: Enhanced branding, certifications, and recognition data
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Brand"],
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#organization`,
    "name": STRUCTURED_DATA_CONFIG.organization.name,
    "legalName": "Luis Travels",
    "alternateName": "HTG",
    "description": STRUCTURED_DATA_CONFIG.organization.description,
    "disambiguatingDescription": "Premium digital nomad travel blog and photography platform established in 2024, focusing on authentic cultural experiences and remote work lifestyle documentation",
    "url": STRUCTURED_DATA_CONFIG.baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": STRUCTURED_DATA_CONFIG.organization.logo,
      "width": 300,
      "height": 300,
      "caption": "Luis Travels - Travel Blog Logo",
      "representativeOfPage": true
    },
    "image": [
      STRUCTURED_DATA_CONFIG.organization.logo,
      `${STRUCTURED_DATA_CONFIG.baseUrl}/images/brand-hero.jpg`,
      `${STRUCTURED_DATA_CONFIG.baseUrl}/images/about-hero.jpg`
    ],
    "foundingDate": STRUCTURED_DATA_CONFIG.organization.foundingDate,
    "founder": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "employee": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": STRUCTURED_DATA_CONFIG.organization.contactPoint.telephone,
        "email": STRUCTURED_DATA_CONFIG.organization.contactPoint.email,
        "contactType": STRUCTURED_DATA_CONFIG.organization.contactPoint.contactType,
        "availableLanguage": STRUCTURED_DATA_CONFIG.organization.contactPoint.availableLanguage,
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint",
        "contactType": "business inquiries",
        "email": "business@heretheregone.com",
        "availableLanguage": ["English", "German"]
      }
    ],
    "sameAs": STRUCTURED_DATA_CONFIG.author.sameAs,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DE",
      "addressRegion": "Worldwide (Digital Nomad)",
      "addressLocality": "Remote Operations"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "knowsAbout": [
      "Digital Nomad Lifestyle",
      "Travel Photography", 
      "Cultural Documentation",
      "Remote Work Strategies",
      "International Travel",
      "Backpacking Adventures"
    ],
    "brand": {
      "@type": "Brand",
      "name": "Luis Travels",
      "logo": STRUCTURED_DATA_CONFIG.organization.logo,
      "slogan": "Authentic Stories. Real Adventures. Digital Nomad Life."
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Travel Content Creation",
          "description": "Professional travel writing and photography services"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Digital Nomad Consulting",
          "description": "Expert guidance on remote work and nomadic lifestyle"
        }
      }
    ],
    "hasCredential": "Self-certified travel content expert with 5+ years international experience",
    "award": "Featured Digital Nomad Blog 2024",
    "publishingPrinciples": `${STRUCTURED_DATA_CONFIG.baseUrl}/editorial-guidelines`,
    "ethicsPolicy": `${STRUCTURED_DATA_CONFIG.baseUrl}/ethics`,
    "diversityPolicy": `${STRUCTURED_DATA_CONFIG.baseUrl}/diversity`
  }
}

/**
 * Generate Article Schema for Blog Posts - 2025 Enhanced
 * Critical for blog post SEO and rich snippets
 * NEW: Enhanced with E-A-T signals, content analysis, and topic clustering
 */
export function generateArticleSchema(post: BlogPost) {
  const imageUrl = post.gallery && post.gallery.length > 0 
    ? `${STRUCTURED_DATA_CONFIG.baseUrl}/images/gallery/${post.gallery[0]}`
    : STRUCTURED_DATA_CONFIG.author.image

  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(' ').length : 0
  const readingTime = Math.ceil(wordCount / 200)

  return {
    "@context": "https://schema.org",
    "@type": ["Article", "BlogPosting", "TravelAction"],
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/${post.slug}`,
    "headline": post.title,
    "alternativeHeadline": post.alternativeTitle || `${post.title} - Digital Nomad Experience`,
    "description": post.excerpt,
    "abstract": post.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "width": 1200,
      "height": 630,
      "caption": `Featured image for ${post.title}`,
      "contentRating": "general",
      "isFamilyFriendly": true,
      "representativeOfPage": true
    },
    "datePublished": post.date,
    "dateModified": post.modifiedDate || post.date,
    "dateCreated": post.date,
    "author": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "publisher": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#organization`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/${post.slug}`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": STRUCTURED_DATA_CONFIG.baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.title }
        ]
      }
    },
    "keywords": post.tags.join(', '),
    "articleSection": post.category || "Travel",
    "articleBody": post.content?.substring(0, 500) + '...',
    "inLanguage": post.language || "en",
    "wordCount": wordCount,
    "timeRequired": `PT${readingTime}M`,
    "typicalAgeRange": "18-65",
    "contentRating": "general",
    "isFamilyFriendly": true,
    "isAccessibleForFree": true,
    "about": post.tags.map(tag => ({
      "@type": "Thing",
      "name": tag,
      "additionalType": "https://schema.org/DefinedTerm"
    })),
    "mentions": extractMentions(post.content),
    "locationCreated": extractLocation(post.tags, post.content),
    "genre": ["Travel Blog", "Digital Nomad Content", "Cultural Documentation"],
    "audience": {
      "@type": "Audience",
      "audienceType": "Travel Enthusiasts, Digital Nomads, Remote Workers",
      "geographicArea": "Worldwide"
    },
    "educationalLevel": "beginner to advanced",
    "learningResourceType": "Article",
    "teaches": post.tags.filter(tag => 
      ['travel', 'nomad', 'culture', 'photography', 'tips'].some(keyword => 
        tag.toLowerCase().includes(keyword)
      )
    ),
    "citation": post.sources || [],
    "usageInfo": "Free to read, share with attribution",
    "copyrightNotice": `© ${new Date().getFullYear()} Luis Gunther - Luis Travels`,
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "contentReferenceTime": post.date,
    "backstory": `Written during ${post.location || 'travels'} as part of authentic digital nomad documentation`,
    "editorsChoice": post.featured || false,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".post-excerpt"]
    },
    "potentialAction": {
      "@type": "ReadAction",
      "target": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/${post.slug}`
    }
  }
}

/**
 * Generate BreadcrumbList Schema
 * Essential for navigation structure understanding
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item) => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.href ? `${STRUCTURED_DATA_CONFIG.baseUrl}${item.href}` : undefined
    }))
  }
}

/**
 * Generate Blog Schema for Blog Index Page
 */
export function generateBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/#blog`,
    "url": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog`,
    "name": `${STRUCTURED_DATA_CONFIG.siteName} - Travel Blog`,
    "description": "Travel stories, digital nomad experiences, and cultural insights from around the world",
    "publisher": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "author": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "inLanguage": ["en", "de"],
    "genre": ["Travel", "Lifestyle", "Digital Nomad"],
    "keywords": "travel blog, digital nomad, backpacking, cultural exploration, travel photography",
    "audience": {
      "@type": "Audience",
      "audienceType": "Travel Enthusiasts, Digital Nomads, Backpackers"
    }
  }
}

/**
 * Generate ImageGallery Schema for Gallery Page
 */
export function generateImageGallerySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/gallery/#gallery`,
    "url": `${STRUCTURED_DATA_CONFIG.baseUrl}/gallery`,
    "name": `${STRUCTURED_DATA_CONFIG.siteName} - Photo Gallery`,
    "description": "Travel photography and visual stories from around the world",
    "creator": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "publisher": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "genre": "Travel Photography",
    "audience": {
      "@type": "Audience",
      "audienceType": "Travel Photography Enthusiasts"
    }
  }
}

/**
 * Generate FAQ Schema (for future use)
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

/**
 * Generate LocalBusiness Schema for Contact/Services
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#business`,
    "name": STRUCTURED_DATA_CONFIG.organization.name,
    "description": "Digital nomad consulting and travel content creation services",
    "url": STRUCTURED_DATA_CONFIG.baseUrl,
    "telephone": STRUCTURED_DATA_CONFIG.organization.contactPoint.telephone,
    "email": STRUCTURED_DATA_CONFIG.organization.contactPoint.email,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DE",
      "addressRegion": "Worldwide (Remote Services)"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "Varies (Digital Nomad)",
      "longitude": "Varies (Digital Nomad)"
    },
    "serviceType": [
      "Travel Content Creation",
      "Digital Nomad Consulting", 
      "Travel Photography",
      "Cultural Documentation"
    ],
    "areaServed": "Worldwide",
    "availableLanguage": ["English", "German"],
    "founder": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    }
  }
}

/**
 * Generate Combined Schema Graph for Homepage - 2025 Enhanced
 * Combines multiple schemas for maximum SEO impact and entity recognition
 * NEW: Knowledge Graph optimization with entity relationships
 */
export function generateHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generatePersonSchema(),
      generateWebsiteSchema(),
      generateOrganizationSchema(),
      generateBlogSchema(),
      generateLocalBusinessSchema(),
      // NEW: Enhanced schema relationships for 2025
      {
        "@type": "WebPage",
        "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#webpage`,
        "url": STRUCTURED_DATA_CONFIG.baseUrl,
        "name": "Luis Travels - Digital Nomad Travel Blog",
        "description": "Authentic travel stories and digital nomad experiences from around the world",
        "mainEntity": {
          "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
        },
        "about": {
          "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#organization`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${STRUCTURED_DATA_CONFIG.baseUrl}/images/hero-homepage.jpg`,
          "width": 1200,
          "height": 630
        },
        "significantLink": [
          `${STRUCTURED_DATA_CONFIG.baseUrl}/blog`,
          `${STRUCTURED_DATA_CONFIG.baseUrl}/gallery`,
          `${STRUCTURED_DATA_CONFIG.baseUrl}/about`
        ],
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", "h2", ".hero-description"]
        }
      }
    ]
  }
}

/**
 * NEW 2025: Generate Topic Page Schema for enhanced SEO
 */
export function generateTopicPageSchema(data: {
  name: string
  description: string
  url: string
  posts: any[]
  totalPosts: number
  tag: string
  cluster?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "AboutPage"],
    "@id": `${data.url}#topic`,
    "name": `${data.name} Travel Content`,
    "description": data.description,
    "url": data.url,
    "about": {
      "@type": "Thing",
      "name": data.name,
      "additionalType": "https://schema.org/DefinedTerm",
      "description": data.description
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": data.totalPosts,
      "itemListElement": data.posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/${post.slug}`,
          "headline": post.title,
          "url": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/${post.slug}`
        }
      }))
    },
    "keywords": data.tag,
    "audience": {
      "@type": "Audience",
      "audienceType": "Travel Enthusiasts interested in ${data.name}"
    },
    "isPartOf": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/#blog`
    }
  }
}

/**
 * NEW 2025: Generate Collection Page Schema for categories
 */
export function generateCollectionPageSchema(data: {
  name: string
  description: string
  url: string
  items: any[]
  totalItems: number 
  category: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${data.url}#collection`,
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "about": {
      "@type": "Thing",
      "name": data.category,
      "additionalType": "https://schema.org/DefinedTerm"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": data.totalItems,
      "itemListElement": data.items.slice(0, 10).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/${item.slug}`,
          "headline": item.title,
          "url": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/${item.slug}`
        }
      }))
    },
    "isPartOf": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/blog/#blog`
    }
  }
}

/**
 * NEW 2025: Generate Enhanced Gallery Schema
 */
export function generateGallerySchema(album: any) {
  return {
    "@context": "https://schema.org",
    "@type": ["ImageGallery", "CreativeWork"],
    "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/gallery/${album.slug}#gallery`,
    "name": album.title,
    "description": album.description,
    "creator": {
      "@id": `${STRUCTURED_DATA_CONFIG.baseUrl}/#person`
    },
    "dateCreated": album.dateCreated,
    "keywords": album.tags?.join(', '),
    "locationCreated": album.location ? {
      "@type": "Place",
      "name": album.location
    } : undefined,
    "image": album.images?.map((img: any) => ({
      "@type": "ImageObject",
      "url": `${STRUCTURED_DATA_CONFIG.baseUrl}/images/gallery/${img.filename}`,
      "caption": img.caption,
      "width": img.width,
      "height": img.height
    })),
    "genre": "Travel Photography",
    "audience": {
      "@type": "Audience",
      "audienceType": "Photography Enthusiasts, Travel Lovers"
    }
  }
}

/**
 * Utility Functions for Content Analysis - Enhanced 2025
 */

// Enhanced mention extraction with 2025 entity recognition
function extractMentions(content: string): Array<{ "@type": string; name: string; additionalType?: string; sameAs?: string }> {
  const mentions: Array<{ "@type": string; name: string; additionalType?: string; sameAs?: string }> = []
  
  if (!content) return mentions
  
  // Enhanced location patterns with more countries
  const locationPatterns = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:,\s*)?(?:Thailand|Germany|Colombia|Spain|Indonesia|Vietnam|Nepal|India|Japan|South Korea|Malaysia|Philippines|Singapore|Cambodia|Laos|Myanmar|Brunei|East Timor|Brazil|Argentina|Chile|Peru|Ecuador|Bolivia|Mexico|Guatemala|Costa Rica|Panama|Turkey|Greece|Italy|France|Portugal|Morocco|Egypt|Tanzania|Kenya|Uganda|Rwanda|Ethiopia|Madagascar|Mauritius|Seychelles|Australia|New Zealand|Fiji|Vanuatu|Papua New Guinea)\b/gi
  
  // Transportation mentions
  const transportPatterns = /\b(flight|bus|train|ferry|boat|taxi|uber|grab|motorbike|scooter|bicycle|tuk-tuk|rickshaw)\b/gi
  
  // Accommodation mentions  
  const accommodationPatterns = /\b(hotel|hostel|guesthouse|airbnb|resort|villa|apartment|homestay|camping|glamping)\b/gi
  
  // Activity mentions
  const activityPatterns = /\b(trekking|hiking|diving|snorkeling|surfing|climbing|temple|museum|market|festival|beach|mountain|jungle|desert|safari|cruise)\b/gi
  
  // Extract locations
  const locationMatches = content.match(locationPatterns)
  if (locationMatches) {
    locationMatches.slice(0, 3).forEach(match => {
      mentions.push({
        "@type": "Place",
        "name": match.trim(),
        "additionalType": "https://schema.org/TouristDestination"
      })
    })
  }
  
  // Extract transportation
  const transportMatches = content.match(transportPatterns)
  if (transportMatches) {
    [...new Set(transportMatches)].slice(0, 2).forEach(match => {
      mentions.push({
        "@type": "Vehicle",
        "name": match.trim(),
        "additionalType": "https://schema.org/TransportAction"
      })
    })
  }
  
  // Extract accommodations
  const accommodationMatches = content.match(accommodationPatterns)
  if (accommodationMatches) {
    [...new Set(accommodationMatches)].slice(0, 2).forEach(match => {
      mentions.push({
        "@type": "LodgingBusiness",
        "name": match.trim(),
        "additionalType": "https://schema.org/Accommodation"
      })
    })
  }
  
  // Extract activities
  const activityMatches = content.match(activityPatterns)
  if (activityMatches) {
    [...new Set(activityMatches)].slice(0, 2).forEach(match => {
      mentions.push({
        "@type": "Action",
        "name": match.trim(),
        "additionalType": "https://schema.org/TravelAction"
      })
    })
  }
  
  return mentions.slice(0, 8) // Increased limit for better entity coverage
}

// Enhanced location extraction with comprehensive geographic coverage
function extractLocation(tags: string[], content: string): any {
  // Expanded country list for better global coverage
  const countries = [
    'Thailand', 'Germany', 'Colombia', 'Spain', 'Indonesia', 'Vietnam', 'Nepal', 'India', 'Japan',
    'South Korea', 'Malaysia', 'Philippines', 'Singapore', 'Cambodia', 'Laos', 'Myanmar',
    'Brazil', 'Argentina', 'Chile', 'Peru', 'Ecuador', 'Bolivia', 'Mexico', 'Guatemala',
    'Costa Rica', 'Panama', 'Turkey', 'Greece', 'Italy', 'France', 'Portugal', 'Morocco',
    'Egypt', 'Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Ethiopia', 'Madagascar', 'Mauritius',
    'Seychelles', 'Australia', 'New Zealand', 'Fiji', 'Vanuatu', 'Papua New Guinea'
  ]
  
  const foundCountry = tags.find(tag => 
    countries.some(country => 
      tag.toLowerCase().includes(country.toLowerCase())
    )
  )
  
  if (foundCountry) {
    const countryName = countries.find(country => 
      foundCountry.toLowerCase().includes(country.toLowerCase())
    )
    return {
      "@type": "Country",
      "name": countryName,
      "additionalType": "https://schema.org/TouristDestination",
      "sameAs": `https://en.wikipedia.org/wiki/${countryName?.replace(/\s/g, '_')}`
    }
  }
  
  if (!content) return null
  
  // Enhanced city patterns with more global cities
  const cityPattern = /\b(Bangkok|Berlin|Medellín|Barcelona|Jakarta|Ho Chi Minh City|Kathmandu|Mumbai|Tokyo|Seoul|Kuala Lumpur|Manila|Singapore|Phnom Penh|Vientiane|Yangon|São Paulo|Rio de Janeiro|Buenos Aires|Santiago|Lima|Quito|La Paz|Mexico City|Guatemala City|San José|Panama City|Istanbul|Athens|Rome|Paris|Lisbon|Casablanca|Cairo|Dar es Salaam|Nairobi|Kampala|Kigali|Addis Ababa|Antananarivo|Port Louis|Victoria|Sydney|Melbourne|Auckland|Suva|Port Vila|Port Moresby)\b/i
  const cityMatch = content.match(cityPattern)
  
  if (cityMatch) {
    return {
      "@type": "City",
      "name": cityMatch[1],
      "additionalType": "https://schema.org/TouristDestination",
      "sameAs": `https://en.wikipedia.org/wiki/${cityMatch[1].replace(/\s/g, '_')}`
    }
  }
  
  // Look for regions or states
  const regionPattern = /\b(Bali|Phuket|Chiang Mai|Bavaria|Catalonia|Andalusia|Tuscany|Provence|Patagonia|Amazon|Sahara|Himalayas|Alps|Andes|Great Barrier Reef)\b/i
  const regionMatch = content.match(regionPattern)
  
  if (regionMatch) {
    return {
      "@type": "Place",
      "name": regionMatch[1],
      "additionalType": "https://schema.org/TouristDestination"
    }
  }
  
  return null
}

/**
 * Validation helper for structured data
 */
/**
 * Enhanced structured data validation for 2025 standards
 */
export function validateStructuredData(schema: any): boolean {
  try {
    // Basic validation - ensure required fields exist
    if (!schema['@context'] || !schema['@type']) {
      console.warn('Missing required @context or @type in structured data')
      return false
    }
    
    // Validate JSON structure
    JSON.stringify(schema)
    
    // NEW: Enhanced validation for 2025
    if (schema['@type'] === 'Person') {
      if (!schema.name || !schema.url) {
        console.warn('Person schema missing required name or url')
        return false
      }
    }
    
    if (schema['@type'] === 'Organization') {
      if (!schema.name || !schema.url || !schema.logo) {
        console.warn('Organization schema missing required fields')
        return false
      }
    }
    
    if (schema['@type'] === 'Article' || schema['@type']?.includes?.('Article')) {
      if (!schema.headline || !schema.author || !schema.datePublished) {
        console.warn('Article schema missing critical fields')
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Structured data validation failed:', error)
    return false
  }
}