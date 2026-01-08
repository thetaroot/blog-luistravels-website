/**
 * Local SEO Optimizer - PHASE 5 SEO-PERFECTION-2025
 * Advanced local business optimization with geo-targeting and location-based schema
 */

import { BlogPost, EntityMention } from '@/lib/blog/types'

interface LocalBusinessData {
  name: string
  type: 'Restaurant' | 'TouristAttraction' | 'LodgingBusiness' | 'LocalBusiness'
  address: {
    streetAddress?: string
    addressLocality: string
    addressRegion?: string
    postalCode?: string
    addressCountry: string
  }
  geo: {
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  telephone?: string
  priceRange?: string
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
  images?: string[]
  amenities?: string[]
}

interface GeoTargeting {
  country: string
  region?: string
  city: string
  coordinates: {
    lat: number
    lng: number
  }
  timezone: string
  language: string
  currency: string
}

interface LocalSEOData {
  businesses: LocalBusinessData[]
  geoTargeting: GeoTargeting[]
  localKeywords: string[]
  nearbyAttractions: string[]
  culturalInsights: string[]
  localEvents: Array<{
    name: string
    date: string
    location: string
    type: string
  }>
}

export class LocalSEOOptimizer {
  private businessDatabase: Map<string, LocalBusinessData[]> = new Map()
  private geoData: Map<string, GeoTargeting> = new Map()
  private localKeywords: Map<string, string[]> = new Map()

  constructor() {
    this.initializeLocationData()
  }

  /**
   * Generate local business schema for a blog post
   */
  async generateLocalBusinessSchema(post: BlogPost): Promise<object[]> {
    const schemas: object[] = []
    
    if (!post.location) return schemas

    // Extract local businesses from content and entities
    const businesses = await this.extractLocalBusinesses(post)
    
    for (const business of businesses) {
      schemas.push(this.createBusinessSchema(business))
    }

    return schemas
  }

  /**
   * Optimize post for local SEO
   */
  async optimizeForLocalSEO(post: BlogPost): Promise<{
    optimizedContent: string
    localKeywords: string[]
    geoTags: string[]
    businessEntities: LocalBusinessData[]
    recommendations: string[]
  }> {
    if (!post.location) {
      return {
        optimizedContent: post.content,
        localKeywords: [],
        geoTags: [],
        businessEntities: [],
        recommendations: ['Add location information to improve local SEO']
      }
    }

    console.log(`🌍 Optimizing local SEO for: ${post.location}`)

    const geoTargeting = this.getGeoTargeting(post.location)
    const localKeywords = this.generateLocalKeywords(post)
    const businessEntities = await this.extractLocalBusinesses(post)
    const geoTags = this.generateGeoTags(post)
    
    // Optimize content with local context
    const optimizedContent = await this.enhanceContentWithLocalContext(post, {
      geoTargeting,
      localKeywords,
      businessEntities
    })

    const recommendations = this.generateSEORecommendations(post, {
      geoTargeting,
      localKeywords,
      businessEntities
    })

    return {
      optimizedContent,
      localKeywords,
      geoTags,
      businessEntities,
      recommendations
    }
  }

  /**
   * Generate location-specific schema markup
   */
  generateLocationSchema(post: BlogPost): object[] {
    const schemas: object[] = []
    
    if (!post.location || !post.coordinates) return schemas

    const [lat, lng] = post.coordinates.split(',').map(Number)

    // Place schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: post.location,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: lat,
        longitude: lng
      },
      ...(post.countryCode && {
        address: {
          '@type': 'PostalAddress',
          addressCountry: post.countryCode
        }
      })
    })

    // TravelAction schema if it's a travel guide
    if (this.isTravelGuide(post)) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'TravelAction',
        agent: {
          '@type': 'Person',
          name: 'Luis'
        },
        location: {
          '@type': 'Place',
          name: post.location,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: lat,
            longitude: lng
          }
        },
        result: {
          '@type': 'TravelGuide',
          name: post.title,
          url: `/blog/${post.slug}`
        }
      })
    }

    return schemas
  }

  /**
   * Generate geo-specific meta tags
   */
  generateGeoMetaTags(post: BlogPost): { [key: string]: string } {
    const metaTags: { [key: string]: string } = {}

    if (post.location) {
      metaTags['geo.region'] = this.getRegionCode(post.location)
      metaTags['geo.placename'] = post.location
      
      if (post.coordinates) {
        const [lat, lng] = post.coordinates.split(',')
        metaTags['geo.position'] = `${lat};${lng}`
        metaTags['ICBM'] = `${lat}, ${lng}`
      }
    }

    return metaTags
  }

  /**
   * Generate local keyword variations
   */
  generateLocalKeywords(post: BlogPost): string[] {
    if (!post.location) return []

    const baseKeywords = post.tags
    const locationKeywords: string[] = []
    const location = post.location.toLowerCase()

    // Add location-specific variations
    baseKeywords.forEach(keyword => {
      locationKeywords.push(`${keyword} in ${post.location}`)
      locationKeywords.push(`${post.location} ${keyword}`)
      locationKeywords.push(`best ${keyword} ${post.location}`)
      
      // Add "near me" variations for local search
      if (this.isLocalService(keyword)) {
        locationKeywords.push(`${keyword} near me`)
        locationKeywords.push(`${keyword} nearby`)
      }
    })

    // Add location-specific keywords from database
    const storedKeywords = this.localKeywords.get(location) || []
    locationKeywords.push(...storedKeywords)

    // Add cultural and activity keywords
    const culturalKeywords = this.generateCulturalKeywords(post.location)
    locationKeywords.push(...culturalKeywords)

    return [...new Set(locationKeywords)] // Remove duplicates
  }

  /**
   * Extract and structure local businesses from post content
   */
  private async extractLocalBusinesses(post: BlogPost): Promise<LocalBusinessData[]> {
    const businesses: LocalBusinessData[] = []
    
    if (!post.entities || !post.location) return businesses

    // Extract business entities
    const businessEntities = post.entities.filter(entity => 
      entity.type === 'Organization' || 
      (entity.type === 'Place' && this.isBusinessPlace(entity))
    )

    for (const entity of businessEntities) {
      const businessType = this.determineBusinessType(entity, post)
      const businessData = await this.enrichBusinessData(entity, post, businessType)
      
      if (businessData) {
        businesses.push(businessData)
      }
    }

    return businesses
  }

  private async enrichBusinessData(
    entity: EntityMention, 
    post: BlogPost, 
    type: LocalBusinessData['type']
  ): Promise<LocalBusinessData | null> {
    try {
      const coordinates = this.extractCoordinatesFromContext(entity.context || '', post.coordinates)
      
      if (!coordinates) return null

      const businessData: LocalBusinessData = {
        name: entity.name,
        type,
        address: {
          addressLocality: post.location!,
          addressCountry: post.countryCode || this.getCountryCode(post.location!)
        },
        geo: coordinates,
        priceRange: this.extractPriceRange(entity.context || ''),
        images: this.extractImages(entity.context || '', post.gallery),
        amenities: this.extractAmenities(entity.context || '')
      }

      // Add specific data based on business type
      if (type === 'Restaurant') {
        businessData.openingHours = this.extractOpeningHours(entity.context || '')
      }

      return businessData
    } catch (error) {
      console.warn(`Failed to enrich business data for ${entity.name}:`, error)
      return null
    }
  }

  private createBusinessSchema(business: LocalBusinessData): object {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': business.type,
      name: business.name,
      address: {
        '@type': 'PostalAddress',
        ...business.address
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude
      }
    }

    if (business.telephone) schema.telephone = business.telephone
    if (business.priceRange) schema.priceRange = business.priceRange
    if (business.openingHours) schema.openingHours = business.openingHours
    if (business.images) schema.image = business.images
    if (business.amenities) schema.amenityFeature = business.amenities

    if (business.aggregateRating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: business.aggregateRating.ratingValue,
        reviewCount: business.aggregateRating.reviewCount
      }
    }

    return schema
  }

  private async enhanceContentWithLocalContext(
    post: BlogPost, 
    context: {
      geoTargeting?: GeoTargeting
      localKeywords: string[]
      businessEntities: LocalBusinessData[]
    }
  ): Promise<string> {
    let enhancedContent = post.content

    // Add local context where appropriate
    if (context.geoTargeting) {
      // Add currency information for budget mentions
      enhancedContent = this.addCurrencyContext(enhancedContent, context.geoTargeting.currency)
      
      // Add timezone context for time mentions
      enhancedContent = this.addTimezoneContext(enhancedContent, context.geoTargeting.timezone)
    }

    // Add structured local information
    if (context.businessEntities.length > 0) {
      enhancedContent = this.addBusinessContext(enhancedContent, context.businessEntities)
    }

    return enhancedContent
  }

  private generateSEORecommendations(
    post: BlogPost, 
    context: {
      geoTargeting?: GeoTargeting
      localKeywords: string[]
      businessEntities: LocalBusinessData[]
    }
  ): string[] {
    const recommendations: string[] = []

    // Check for missing local elements
    if (!post.coordinates) {
      recommendations.push('Add GPS coordinates for better local search visibility')
    }

    if (!post.countryCode) {
      recommendations.push('Add country code for improved geo-targeting')
    }

    if (context.localKeywords.length < 5) {
      recommendations.push('Add more location-specific keywords to improve local relevance')
    }

    if (context.businessEntities.length === 0 && this.hasBusinessMentions(post.content)) {
      recommendations.push('Structure business mentions with proper schema markup')
    }

    if (!this.hasLocalOpeningHours(post.content)) {
      recommendations.push('Consider adding opening hours for mentioned businesses')
    }

    if (!this.hasPriceInformation(post.content)) {
      recommendations.push('Add price ranges for better search result visibility')
    }

    return recommendations
  }

  private initializeLocationData(): void {
    // Thailand
    this.geoData.set('thailand', {
      country: 'Thailand',
      city: 'Bangkok',
      coordinates: { lat: 13.7563, lng: 100.5018 },
      timezone: 'Asia/Bangkok',
      language: 'th',
      currency: 'THB'
    })

    this.localKeywords.set('thailand', [
      'thai food', 'street food', 'tuk tuk', 'wat', 'temple', 'massage', 
      'floating market', 'longtail boat', 'som tam', 'pad thai', 'songkran'
    ])

    // Colombia
    this.geoData.set('colombia', {
      country: 'Colombia',
      city: 'Bogotá',
      coordinates: { lat: 4.7110, lng: -74.0721 },
      timezone: 'America/Bogota',
      language: 'es',
      currency: 'COP'
    })

    this.localKeywords.set('colombia', [
      'coffee', 'arepa', 'salsa', 'vallenato', 'emerald', 'paisa',
      'bandeja paisa', 'aguardiente', 'cumbia', 'colonial architecture'
    ])

    // Vietnam
    this.geoData.set('vietnam', {
      country: 'Vietnam',
      city: 'Ho Chi Minh City',
      coordinates: { lat: 10.8231, lng: 106.6297 },
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      currency: 'VND'
    })

    this.localKeywords.set('vietnam', [
      'pho', 'banh mi', 'ao dai', 'motorbike', 'dong', 'cyclo',
      'spring rolls', 'fish sauce', 'bun cha', 'coffee culture'
    ])

    // Add more countries as needed...
  }

  // Helper methods

  private getGeoTargeting(location: string): GeoTargeting | undefined {
    const locationKey = location.toLowerCase()
    
    // Try exact match first
    if (this.geoData.has(locationKey)) {
      return this.geoData.get(locationKey)
    }

    // Try partial matches
    for (const [key, data] of this.geoData.entries()) {
      if (locationKey.includes(key) || key.includes(locationKey)) {
        return data
      }
    }

    return undefined
  }

  private generateGeoTags(post: BlogPost): string[] {
    const tags: string[] = []
    
    if (post.location) {
      tags.push(`location:${post.location}`)
      
      if (post.countryCode) {
        tags.push(`country:${post.countryCode}`)
      }
      
      if (post.coordinates) {
        const [lat, lng] = post.coordinates.split(',')
        tags.push(`coords:${lat},${lng}`)
      }
    }

    return tags
  }

  private generateCulturalKeywords(location: string): string[] {
    const culturalMap: { [key: string]: string[] } = {
      thailand: ['buddhist culture', 'royal palace', 'thai boxing', 'elephant sanctuary'],
      colombia: ['coffee culture', 'colonial heritage', 'caribbean coast', 'andean mountains'],
      vietnam: ['communist history', 'french colonial', 'mekong delta', 'ha long bay'],
      indonesia: ['islamic culture', 'hindu temples', 'volcanic islands', 'batik art'],
      india: ['hindu culture', 'bollywood', 'curry spices', 'yoga tradition'],
      nepal: ['himalayan culture', 'sherpa people', 'buddhist monasteries', 'mountain trekking']
    }

    const locationKey = location.toLowerCase()
    return culturalMap[locationKey] || []
  }

  private isBusinessPlace(entity: EntityMention): boolean {
    const businessCategories = ['restaurant', 'hotel', 'market', 'shop', 'cafe', 'bar']
    return businessCategories.some(category => 
      entity.category?.toLowerCase().includes(category) ||
      entity.context?.toLowerCase().includes(category)
    )
  }

  private determineBusinessType(entity: EntityMention, post: BlogPost): LocalBusinessData['type'] {
    const context = (entity.context || '').toLowerCase()
    const content = post.content.toLowerCase()
    
    if (context.includes('restaurant') || context.includes('food') || context.includes('eat')) {
      return 'Restaurant'
    }
    
    if (context.includes('hotel') || context.includes('accommodation') || context.includes('stay')) {
      return 'LodgingBusiness'
    }
    
    if (context.includes('temple') || context.includes('museum') || context.includes('attraction')) {
      return 'TouristAttraction'
    }
    
    return 'LocalBusiness'
  }

  private extractCoordinatesFromContext(context: string, fallbackCoords?: string): { latitude: number; longitude: number } | null {
    // In a real implementation, this would use geocoding APIs
    // For now, use fallback coordinates with small random offset
    if (fallbackCoords) {
      const [lat, lng] = fallbackCoords.split(',').map(Number)
      return {
        latitude: lat + (Math.random() - 0.5) * 0.01, // Small offset
        longitude: lng + (Math.random() - 0.5) * 0.01
      }
    }
    
    return null
  }

  private extractPriceRange(context: string): string {
    if (context.includes('expensive') || context.includes('luxury')) return '$$$'
    if (context.includes('budget') || context.includes('cheap')) return '$'
    return '$$'
  }

  private extractImages(context: string, gallery?: string[]): string[] {
    // In a real implementation, this would extract relevant images
    return gallery?.slice(0, 3) || []
  }

  private extractAmenities(context: string): string[] {
    const amenities: string[] = []
    
    if (context.includes('wifi')) amenities.push('Free WiFi')
    if (context.includes('parking')) amenities.push('Parking')
    if (context.includes('pool')) amenities.push('Swimming Pool')
    if (context.includes('gym')) amenities.push('Fitness Center')
    if (context.includes('spa')) amenities.push('Spa')
    
    return amenities
  }

  private extractOpeningHours(context: string): string[] {
    // Simple extraction - in production, use more sophisticated parsing
    const hours = []
    
    if (context.includes('24 hours') || context.includes('24/7')) {
      hours.push('Mo-Su 00:00-24:00')
    } else if (context.includes('daily')) {
      hours.push('Mo-Su 09:00-22:00') // Default assumption
    }
    
    return hours
  }

  private isTravelGuide(post: BlogPost): boolean {
    const title = post.title.toLowerCase()
    const guideKeywords = ['guide', 'how to', 'tips', 'complete', 'ultimate']
    
    return guideKeywords.some(keyword => title.includes(keyword))
  }

  private getRegionCode(location: string): string {
    const regionMap: { [key: string]: string } = {
      thailand: 'TH',
      colombia: 'CO', 
      vietnam: 'VN',
      indonesia: 'ID',
      india: 'IN',
      nepal: 'NP'
    }
    
    const locationKey = location.toLowerCase()
    return regionMap[locationKey] || 'XX'
  }

  private getCountryCode(location: string): string {
    return this.getRegionCode(location)
  }

  private isLocalService(keyword: string): boolean {
    const localServices = ['restaurant', 'hotel', 'taxi', 'tour', 'guide', 'massage', 'market']
    return localServices.some(service => keyword.toLowerCase().includes(service))
  }

  private addCurrencyContext(content: string, currency: string): string {
    // Add currency context to price mentions
    return content.replace(/(\$\d+)/g, `$1 (${currency})`)
  }

  private addTimezoneContext(content: string, timezone: string): string {
    // Add timezone context to time mentions
    return content.replace(/(\d{1,2}:\d{2})/g, `$1 ${timezone}`)
  }

  private addBusinessContext(content: string, businesses: LocalBusinessData[]): string {
    // This would add structured business information
    return content
  }

  private hasBusinessMentions(content: string): boolean {
    const businessKeywords = ['restaurant', 'hotel', 'cafe', 'shop', 'market', 'bar']
    return businessKeywords.some(keyword => content.toLowerCase().includes(keyword))
  }

  private hasLocalOpeningHours(content: string): boolean {
    return /\d{1,2}:\d{2}|\d{1,2}\s?(am|pm)|open|closed|hours/gi.test(content)
  }

  private hasPriceInformation(content: string): boolean {
    return /\$\d+|price|cost|budget|expensive|cheap/gi.test(content)
  }
}