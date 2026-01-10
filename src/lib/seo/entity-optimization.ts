/**
 * 🎯 ENTITY-BASED SEO OPTIMIZATION SYSTEM
 * 10/10 Knowledge Graph & Entity Authority Implementation
 */

import { BlogPost } from '@/lib/blog/types'

export interface EntitySchema {
  '@context': string
  '@type': string
  '@id'?: string
  [key: string]: any
}

export interface EntityConnection {
  entityId: string
  entityName: string
  relationshipType: 'sameAs' | 'worksFor' | 'knowsAbout' | 'hasOccupation' | 'nationality'
  wikidataId?: string
  strength: number
}

/**
 * Core Entity Schemas for Maximum Authority
 */
export const entitySchemas = {
  person: {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://luistravels.com/#person",
    "name": "Luis Gunther",
    "alternateName": ["Luis Travels", "Luis", "Digital Nomad Luis"],
    "url": "https://luistravels.com",
    "image": [
      "https://luistravels.com/images/luis-portrait.jpg",
      "https://luistravels.com/images/luis-travel.jpg"
    ],
    "description": "Digital nomad, travel content creator, and location independence expert sharing authentic travel experiences and practical nomad advice from around the world.",
    "jobTitle": ["Digital Nomad", "Travel Content Creator", "Location Independence Expert"],
    "worksFor": {
      "@type": "Organization",
      "@id": "https://luistravels.com/#organization",
      "name": "Luis Travels",
      "url": "https://luistravels.com"
    },
    "knowsAbout": [
      {
        "@type": "Thing",
        "@id": "https://www.wikidata.org/wiki/Q1004",
        "name": "Travel",
        "description": "Global travel and cultural exploration"
      },
      {
        "@type": "Thing", 
        "@id": "https://www.wikidata.org/wiki/Q620615",
        "name": "Digital Nomadism",
        "description": "Location-independent lifestyle and remote work"
      },
      {
        "@type": "Thing",
        "@id": "https://www.wikidata.org/wiki/Q11695",
        "name": "Photography",
        "description": "Travel and street photography"
      },
      {
        "@type": "Thing",
        "name": "Cultural Exploration",
        "description": "Understanding and experiencing different cultures"
      },
      {
        "@type": "Thing",
        "name": "Remote Work",
        "description": "Working remotely while traveling"
      }
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Digital Nomad",
      "description": "Location-independent professional working remotely while traveling",
      "occupationLocation": {
        "@type": "Place",
        "name": "Global",
        "description": "Working from various locations worldwide"
      },
      "skills": [
        "Content Creation",
        "Travel Photography", 
        "Cultural Communication",
        "Remote Work Management",
        "Location Independence Consulting"
      ]
    },
    "sameAs": [
      "https://instagram.com/luistravels",
      "https://pinterest.com/luistravels",
      "https://ko-fi.com/luistravels",
      "https://youtube.com/@luistravels"
    ],
    "nationality": {
      "@type": "Country",
      "@id": "https://www.wikidata.org/wiki/Q183",
      "name": "Germany"
    },
    "birthPlace": {
      "@type": "Place",
      "addressCountry": "Germany"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Self-taught Digital Nomad",
      "description": "Autodidactic learning approach to location independence"
    },
    "award": [
      "Authentic Travel Storyteller",
      "Digital Nomad Community Contributor"
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Global Digital Nomad Community"
      }
    ]
  },
  
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://luistravels.com/#website",
    "url": "https://luistravels.com",
    "name": "Luis Travels",
    "alternateName": "Luis Travels Blog",
    "description": "Digital nomad and travel storyteller sharing authentic adventures from around the world. Follow Luis as he explores new cultures, hidden gems, and the nomadic lifestyle.",
    "publisher": {
      "@id": "https://luistravels.com/#person"
    },
    "author": {
      "@id": "https://luistravels.com/#person"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://luistravels.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["en", "de"],
    "about": [
      {
        "@type": "Thing",
        "@id": "https://www.wikidata.org/wiki/Q620615",
        "name": "Digital Nomadism"
      },
      {
        "@type": "Thing",
        "@id": "https://www.wikidata.org/wiki/Q1004", 
        "name": "Travel"
      },
      {
        "@type": "Thing",
        "@id": "https://www.wikidata.org/wiki/Q11695",
        "name": "Photography"
      }
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Digital Nomads, Remote Workers, Travel Enthusiasts",
      "geographicArea": "Global"
    },
    "keywords": [
      "digital nomad",
      "travel blog", 
      "location independence",
      "remote work",
      "travel photography",
      "nomad lifestyle",
      "cultural exploration"
    ]
  },
  
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://luistravels.com/#organization", 
    "name": "Luis Travels",
    "alternateName": "Luis Travels Blog",
    "url": "https://luistravels.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://luistravels.com/images/logo.png",
      "width": 300,
      "height": 300
    },
    "founder": {
      "@id": "https://luistravels.com/#person"
    },
    "foundingDate": "2024",
    "description": "Digital nomad travel platform sharing authentic adventures and practical advice for location-independent living around the world.",
    "knowsAbout": [
      "Digital Nomadism",
      "Travel",
      "Remote Work",
      "Cultural Exploration",
      "Location Independence"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@luistravels.com",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://instagram.com/luistravels",
      "https://pinterest.com/luistravels",
      "https://youtube.com/@luistravels"
    ]
  }
}

/**
 * Generate Article Schema for Blog Posts
 */
export function generateArticleSchema(post: BlogPost): EntitySchema {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://luistravels.com/blog/${post.slug}`,
    "headline": post.title,
    "description": post.excerpt || "",
    "image": post.gallery && post.gallery.length > 0 
      ? `https://luistravels.com/images/gallery/${post.gallery[0]}`
      : "https://luistravels.com/images/default-post.jpg",
    "datePublished": post.date,
    "dateModified": post.modifiedDate || post.date,
    "author": {
      "@id": "https://luistravels.com/#person"
    },
    "publisher": {
      "@id": "https://luistravels.com/#organization"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://luistravels.com/blog/${post.slug}`
    },
    "keywords": post.tags?.join(', ') || "",
    "articleSection": "Travel",
    "articleBody": post.content,
    "wordCount": post.content ? post.content.split(' ').length : 0,
    "inLanguage": post.language || "en",
    "about": generateArticleEntities(post),
    "mentions": generateMentionedEntities(post),
    "locationCreated": post.location ? {
      "@type": "Place",
      "name": post.location
    } : undefined,
    "isPartOf": {
      "@id": "https://luistravels.com/#website"
    },
    "potentialAction": {
      "@type": "ReadAction",
      "target": `https://luistravels.com/blog/${post.slug}`
    }
  }
}

/**
 * Generate entities mentioned in article
 */
function generateArticleEntities(post: BlogPost): EntitySchema[] {
  const entities: EntitySchema[] = []
  
  // Location entity
  if (post.location) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": `https://luistravels.com/location/${encodeURIComponent(post.location)}`,
      "name": post.location,
      "description": `Travel destination featured in ${post.title}`
    })
  }
  
  // Tag-based entities
  if (post.tags) {
    post.tags.forEach(tag => {
      entities.push({
        "@context": "https://schema.org",
        "@type": "Thing",
        "@id": `https://luistravels.com/tag/${encodeURIComponent(tag)}`,
        "name": tag,
        "description": `Topic related to ${post.title}`
      })
    })
  }
  
  return entities
}

/**
 * Generate mentioned entities for knowledge graph
 */
function generateMentionedEntities(post: BlogPost): EntitySchema[] {
  const mentions: EntitySchema[] = []
  
  // Always mention the author
  mentions.push({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://luistravels.com/#person"
  })

  // Add location mentions
  if (post.location) {
    mentions.push({
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": `https://luistravels.com/location/${encodeURIComponent(post.location)}`,
      "name": post.location
    })
  }
  
  return mentions
}

/**
 * Generate Image Schema for Gallery Items
 */
export function generateImageSchema(
  imageSrc: string, 
  title: string, 
  description?: string,
  location?: string
): EntitySchema {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `https://luistravels.com${imageSrc}`,
    "url": `https://luistravels.com${imageSrc}`,
    "name": title,
    "description": description || `Travel photography by Luis Gunther`,
    "author": {
      "@id": "https://luistravels.com/#person"
    },
    "creator": {
      "@id": "https://luistravels.com/#person"
    },
    "copyrightHolder": {
      "@id": "https://luistravels.com/#person"
    },
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "acquireLicensePage": "https://luistravels.com/contact",
    "contentLocation": location ? {
      "@type": "Place",
      "name": location
    } : undefined,
    "keywords": "travel photography, digital nomad, cultural exploration",
    "inLanguage": "en",
    "uploadDate": new Date().toISOString()
  }
}

/**
 * Generate Local Business Schema for Nomad Services
 */
export function generateLocalBusinessSchema(): EntitySchema {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://luistravels.com/#business",
    "name": "Luis Travels - Digital Nomad Consulting",
    "description": "Professional digital nomad consulting and travel content creation services",
    "provider": {
      "@id": "https://luistravels.com/#person"
    },
    "areaServed": "Global",
    "serviceType": [
      "Digital Nomad Consulting",
      "Travel Content Creation", 
      "Location Independence Coaching",
      "Remote Work Strategy"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Digital Nomad Consultation",
        "description": "One-on-one consultation for aspiring digital nomads",
        "url": "https://luistravels.com/contact"
      },
      {
        "@type": "Offer", 
        "name": "Travel Content Creation",
        "description": "Professional travel photography and content services",
        "url": "https://luistravels.com/contact"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@luistravels.com",
      "contactType": "customer service",
      "availableLanguage": ["English", "German"]
    },
    "sameAs": [
      "https://instagram.com/luistravels",
      "https://ko-fi.com/luistravels"
    ]
  }
}

/**
 * Generate FAQ Schema for enhanced SERP features
 */
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>): EntitySchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://luistravels.com/faq",
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
 * Generate How-To Schema for guides
 */
export function generateHowToSchema(
  title: string,
  description: string,
  steps: Array<{name: string, text: string}>
): EntitySchema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "image": "https://luistravels.com/images/how-to-guide.jpg",
    "author": {
      "@id": "https://luistravels.com/#person"
    },
    "datePublished": new Date().toISOString(),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  }
}

/**
 * Entity Relationship Mapping
 */
export const entityRelationships: EntityConnection[] = [
  {
    entityId: 'person',
    entityName: 'Luis Gunther',
    relationshipType: 'sameAs',
    wikidataId: 'Q123456789', // This would be the actual Wikidata ID
    strength: 1.0
  },
  {
    entityId: 'digital-nomadism',
    entityName: 'Digital Nomadism',
    relationshipType: 'knowsAbout',
    wikidataId: 'Q620615',
    strength: 0.95
  },
  {
    entityId: 'travel',
    entityName: 'Travel',
    relationshipType: 'knowsAbout',
    wikidataId: 'Q1004',
    strength: 0.90
  },
  {
    entityId: 'photography',
    entityName: 'Photography',
    relationshipType: 'knowsAbout',
    wikidataId: 'Q11695',
    strength: 0.85
  }
]

/**
 * Validate entity schema against Schema.org requirements
 */
export function validateEntitySchema(schema: EntitySchema): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields validation
  if (!schema['@context']) {
    errors.push('Missing @context property')
  }
  
  if (!schema['@type']) {
    errors.push('Missing @type property')
  }
  
  if (!schema['@id']) {
    warnings.push('Missing @id property (recommended for entity linking)')
  }
  
  // Type-specific validations
  if (schema['@type'] === 'Person') {
    if (!schema.name) {
      errors.push('Person schema missing required name property')
    }
  }
  
  if (schema['@type'] === 'Article' || schema['@type'] === 'BlogPosting') {
    if (!schema.headline) {
      errors.push('Article schema missing required headline property')
    }
    if (!schema.author) {
      errors.push('Article schema missing required author property')
    }
    if (!schema.datePublished) {
      errors.push('Article schema missing required datePublished property')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Generate complete entity markup for a page
 */
export function generatePageEntityMarkup(
  pageType: 'home' | 'blog' | 'post' | 'gallery',
  data?: any
): EntitySchema[] {
  const schemas: EntitySchema[] = []
  
  // Always include core schemas
  schemas.push(entitySchemas.person)
  schemas.push(entitySchemas.website)
  schemas.push(entitySchemas.organization)
  
  // Page-specific schemas
  switch (pageType) {
    case 'post':
      if (data?.post) {
        schemas.push(generateArticleSchema(data.post))
      }
      break
    case 'gallery':
      if (data?.images) {
        data.images.forEach((image: any) => {
          schemas.push(generateImageSchema(
            image.src,
            image.title,
            image.description,
            image.location
          ))
        })
      }
      break
  }
  
  // Add business schema for service pages
  if (pageType === 'home') {
    schemas.push(generateLocalBusinessSchema())
  }
  
  return schemas
}