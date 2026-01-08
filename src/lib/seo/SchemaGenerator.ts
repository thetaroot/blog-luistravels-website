/**
 * Schema Generator - PHASE 5 SEO-PERFECTION-2025
 * Advanced structured data generation for maximum Google visibility
 * Implements Schema.org standards with travel-specific enhancements
 */

import { BlogPost, EntityMention } from '@/lib/blog/types'

interface SchemaConfig {
  siteName: string
  siteUrl: string
  authorName: string
  authorUrl: string
  logo: string
  socialProfiles: string[]
  organization: {
    name: string
    type: string
    address?: Address
    contactPoint?: ContactPoint
  }
}

interface Address {
  streetAddress?: string
  addressLocality: string
  addressRegion?: string
  postalCode?: string
  addressCountry: string
}

interface ContactPoint {
  telephone?: string
  email?: string
  contactType: string
  availableLanguage: string[]
}

interface TravelSchema {
  '@context': string
  '@type': string
  [key: string]: any
}

export class SchemaGenerator {
  private config: SchemaConfig
  private baseUrl: string

  constructor(config: SchemaConfig) {
    this.config = config
    this.baseUrl = config.siteUrl
  }

  /**
   * Generate comprehensive schema markup for a blog post
   */
  generateBlogPostSchema(post: BlogPost): TravelSchema[] {
    const schemas: TravelSchema[] = []

    // Article Schema (Core)
    schemas.push(this.generateArticleSchema(post))

    // Travel-specific schemas based on content
    if (this.isTravelGuide(post)) {
      schemas.push(this.generateTravelGuideSchema(post))
    }

    if (this.hasRestaurantContent(post)) {
      schemas.push(this.generateRestaurantSchema(post))
    }

    if (this.hasAccommodationContent(post)) {
      schemas.push(this.generateAccommodationSchema(post))
    }

    if (this.hasTouristAttractionContent(post)) {
      schemas.push(this.generateTouristAttractionSchema(post))
    }

    // Event schema for festivals, ceremonies, etc.
    const eventEntities = this.extractEventEntities(post)
    eventEntities.forEach(event => {
      schemas.push(this.generateEventSchema(post, event))
    })

    // Place schemas for locations mentioned
    const placeEntities = this.extractPlaceEntities(post)
    placeEntities.forEach(place => {
      schemas.push(this.generatePlaceSchema(post, place))
    })

    // Review schema if post contains reviews
    if (this.hasReviewContent(post)) {
      schemas.push(this.generateReviewSchema(post))
    }

    // FAQ schema if post has Q&A format
    const faqItems = this.extractFAQItems(post)
    if (faqItems.length > 0) {
      schemas.push(this.generateFAQSchema(faqItems))
    }

    // How-to schema for guide posts
    const howToSteps = this.extractHowToSteps(post)
    if (howToSteps.length > 0) {
      schemas.push(this.generateHowToSchema(post, howToSteps))
    }

    return schemas
  }

  /**
   * Generate organization schema for the site
   */
  generateOrganizationSchema(): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': this.config.organization.type,
      '@id': `${this.baseUrl}/#organization`,
      name: this.config.organization.name,
      url: this.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: this.config.logo,
        width: 512,
        height: 512
      },
      sameAs: this.config.socialProfiles,
      ...(this.config.organization.address && {
        address: {
          '@type': 'PostalAddress',
          ...this.config.organization.address
        }
      }),
      ...(this.config.organization.contactPoint && {
        contactPoint: {
          '@type': 'ContactPoint',
          ...this.config.organization.contactPoint
        }
      })
    }
  }

  /**
   * Generate website schema
   */
  generateWebsiteSchema(): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.baseUrl}/#website`,
      url: this.baseUrl,
      name: this.config.siteName,
      description: 'Travel blog with cultural insights, food experiences, and adventure stories from Southeast Asia and Latin America',
      publisher: {
        '@id': `${this.baseUrl}/#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      inLanguage: ['en', 'de']
    }
  }

  /**
   * Generate breadcrumb schema
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    }
  }

  // Private methods for specific schema types

  private generateArticleSchema(post: BlogPost): TravelSchema {
    const schema: TravelSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${this.baseUrl}/blog/${post.slug}`,
      headline: post.title,
      description: post.excerpt,
      url: `${this.baseUrl}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.modifiedDate || post.date,
      author: {
        '@type': 'Person',
        name: this.config.authorName,
        url: this.config.authorUrl
      },
      publisher: {
        '@id': `${this.baseUrl}/#organization`
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/blog/${post.slug}`
      },
      inLanguage: post.language,
      keywords: post.tags.join(', ')
    }

    // Add images if available
    if (post.gallery && post.gallery.length > 0) {
      schema.image = post.gallery.map(image => ({
        '@type': 'ImageObject',
        url: image,
        width: 1200,
        height: 800
      }))
    }

    // Add location if available
    if (post.location) {
      schema.contentLocation = {
        '@type': 'Place',
        name: post.location,
        ...(post.coordinates && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: post.coordinates.split(',')[0],
            longitude: post.coordinates.split(',')[1]
          }
        })
      }
    }

    // Add reading time
    if (post.readingTime) {
      schema.timeRequired = `PT${post.readingTime}M`
    }

    return schema
  }

  private generateTravelGuideSchema(post: BlogPost): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'TravelGuide',
      name: post.title,
      description: post.excerpt,
      url: `${this.baseUrl}/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: this.config.authorName
      },
      ...(post.location && {
        about: {
          '@type': 'Place',
          name: post.location
        }
      }),
      inLanguage: post.language
    }
  }

  private generateRestaurantSchema(post: BlogPost): TravelSchema {
    const restaurants = this.extractRestaurantEntities(post)
    
    if (restaurants.length === 0) return {} as TravelSchema

    const restaurant = restaurants[0] // Use first restaurant found
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: restaurant.name,
      description: restaurant.context || 'Restaurant mentioned in travel blog',
      ...(post.location && {
        address: {
          '@type': 'PostalAddress',
          addressLocality: post.location,
          ...(post.countryCode && { addressCountry: post.countryCode })
        }
      }),
      servesCuisine: this.extractCuisineTypes(post),
      priceRange: this.extractPriceRange(post) || '$$'
    }
  }

  private generateAccommodationSchema(post: BlogPost): TravelSchema {
    const accommodations = this.extractAccommodationEntities(post)
    
    if (accommodations.length === 0) return {} as TravelSchema

    const accommodation = accommodations[0]
    
    return {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: accommodation.name,
      description: accommodation.context || 'Accommodation mentioned in travel blog',
      ...(post.location && {
        address: {
          '@type': 'PostalAddress',
          addressLocality: post.location,
          ...(post.countryCode && { addressCountry: post.countryCode })
        }
      })
    }
  }

  private generateTouristAttractionSchema(post: BlogPost): TravelSchema {
    const attractions = this.extractAttractionEntities(post)
    
    if (attractions.length === 0) return {} as TravelSchema

    const attraction = attractions[0]
    
    return {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: attraction.name,
      description: attraction.context || 'Tourist attraction mentioned in travel blog',
      ...(post.location && {
        address: {
          '@type': 'PostalAddress',
          addressLocality: post.location,
          ...(post.countryCode && { addressCountry: post.countryCode })
        }
      }),
      touristType: this.extractTouristTypes(post)
    }
  }

  private generateEventSchema(post: BlogPost, event: EntityMention): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: event.context || 'Event mentioned in travel blog',
      ...(post.location && {
        location: {
          '@type': 'Place',
          name: post.location,
          ...(post.coordinates && {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: post.coordinates.split(',')[0],
              longitude: post.coordinates.split(',')[1]
            }
          })
        }
      }),
      eventStatus: 'https://schema.org/EventScheduled'
    }
  }

  private generatePlaceSchema(post: BlogPost, place: EntityMention): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: place.name,
      description: place.context || 'Place mentioned in travel blog',
      ...(place.name === post.location && post.coordinates && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: post.coordinates.split(',')[0],
          longitude: post.coordinates.split(',')[1]
        }
      })
    }
  }

  private generateReviewSchema(post: BlogPost): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Place',
        name: post.location || 'Travel Destination'
      },
      author: {
        '@type': 'Person',
        name: this.config.authorName
      },
      datePublished: post.date,
      description: post.excerpt,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: this.extractRating(post) || 4,
        bestRating: 5
      }
    }
  }

  private generateFAQSchema(faqItems: Array<{ question: string; answer: string }>): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    }
  }

  private generateHowToSchema(post: BlogPost, steps: Array<{ name: string; text: string }>): TravelSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: post.title,
      description: post.excerpt,
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text
      }))
    }
  }

  // Helper methods for content analysis

  private isTravelGuide(post: BlogPost): boolean {
    const guideKeywords = ['guide', 'how to', 'tips', 'complete guide', 'ultimate guide']
    const title = post.title.toLowerCase()
    const content = post.content.toLowerCase()
    
    return guideKeywords.some(keyword => title.includes(keyword) || content.includes(keyword))
  }

  private hasRestaurantContent(post: BlogPost): boolean {
    const restaurantKeywords = ['restaurant', 'food', 'eat', 'dining', 'cuisine', 'meal']
    const content = (post.content + ' ' + post.title).toLowerCase()
    
    return restaurantKeywords.some(keyword => content.includes(keyword))
  }

  private hasAccommodationContent(post: BlogPost): boolean {
    const accommodationKeywords = ['hotel', 'hostel', 'accommodation', 'stay', 'guesthouse', 'airbnb']
    const content = (post.content + ' ' + post.title).toLowerCase()
    
    return accommodationKeywords.some(keyword => content.includes(keyword))
  }

  private hasTouristAttractionContent(post: BlogPost): boolean {
    const attractionKeywords = ['temple', 'museum', 'park', 'attraction', 'landmark', 'monument']
    const content = (post.content + ' ' + post.title).toLowerCase()
    
    return attractionKeywords.some(keyword => content.includes(keyword))
  }

  private hasReviewContent(post: BlogPost): boolean {
    const reviewKeywords = ['review', 'recommend', 'opinion', 'experience', 'worth it']
    const content = (post.content + ' ' + post.title).toLowerCase()
    
    return reviewKeywords.some(keyword => content.includes(keyword))
  }

  private extractEventEntities(post: BlogPost): EntityMention[] {
    return (post.entities || []).filter(entity => entity.type === 'Event')
  }

  private extractPlaceEntities(post: BlogPost): EntityMention[] {
    return (post.entities || []).filter(entity => entity.type === 'Place')
  }

  private extractRestaurantEntities(post: BlogPost): EntityMention[] {
    return (post.entities || []).filter(entity => 
      entity.type === 'Organization' && 
      entity.category?.toLowerCase().includes('restaurant')
    )
  }

  private extractAccommodationEntities(post: BlogPost): EntityMention[] {
    return (post.entities || []).filter(entity => 
      entity.type === 'Organization' && 
      (entity.category?.toLowerCase().includes('accommodation') ||
       entity.category?.toLowerCase().includes('hotel'))
    )
  }

  private extractAttractionEntities(post: BlogPost): EntityMention[] {
    return (post.entities || []).filter(entity => 
      entity.type === 'Cultural' || 
      (entity.type === 'Place' && entity.category !== 'Country' && entity.category !== 'City')
    )
  }

  private extractFAQItems(post: BlogPost): Array<{ question: string; answer: string }> {
    // Simple extraction based on common FAQ patterns
    const content = post.content
    const faqPattern = /(?:Q:|Question:)\s*(.+?)\n(?:A:|Answer:)\s*(.+?)(?=\n(?:Q:|Question:)|$)/gs
    const faqItems: Array<{ question: string; answer: string }> = []
    
    let match
    while ((match = faqPattern.exec(content)) !== null) {
      faqItems.push({
        question: match[1].trim(),
        answer: match[2].trim()
      })
    }
    
    return faqItems
  }

  private extractHowToSteps(post: BlogPost): Array<{ name: string; text: string }> {
    // Extract numbered steps or bullet points
    const content = post.content
    const stepPattern = /(?:Step\s+\d+:|^\d+\.)\s*(.+?)(?=\n(?:Step\s+\d+:|^\d+\.)|$)/gm
    const steps: Array<{ name: string; text: string }> = []
    
    let match
    while ((match = stepPattern.exec(content)) !== null) {
      const stepText = match[1].trim()
      const firstSentence = stepText.split('.')[0]
      
      steps.push({
        name: firstSentence,
        text: stepText
      })
    }
    
    return steps
  }

  private extractCuisineTypes(post: BlogPost): string[] {
    const cuisineTypes = ['Thai', 'Colombian', 'Vietnamese', 'Indonesian', 'Indian', 'Nepali', 'Asian', 'Latin American']
    const content = (post.content + ' ' + post.title).toLowerCase()
    
    return cuisineTypes.filter(cuisine => content.includes(cuisine.toLowerCase()))
  }

  private extractPriceRange(post: BlogPost): string | null {
    const content = post.content.toLowerCase()
    
    if (content.includes('expensive') || content.includes('luxury')) return '$$$'
    if (content.includes('budget') || content.includes('cheap')) return '$'
    if (content.includes('moderate') || content.includes('mid-range')) return '$$'
    
    return null
  }

  private extractTouristTypes(post: BlogPost): string[] {
    const types = []
    const content = (post.content + ' ' + post.title).toLowerCase()
    
    if (content.includes('backpack')) types.push('Backpacker')
    if (content.includes('family')) types.push('Family')
    if (content.includes('luxury')) types.push('Luxury')
    if (content.includes('adventure')) types.push('Adventure')
    if (content.includes('culture')) types.push('Cultural')
    
    return types
  }

  private extractRating(post: BlogPost): number | null {
    const content = post.content
    const ratingPattern = /(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*5|(\d+(?:\.\d+)?)\s*stars?/gi
    
    const match = ratingPattern.exec(content)
    if (match) {
      return parseFloat(match[1] || match[2])
    }
    
    return null
  }

  /**
   * Generate JSON-LD script tag
   */
  generateJsonLd(schemas: TravelSchema[]): string {
    return `<script type="application/ld+json">
${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2)}
</script>`
  }
}