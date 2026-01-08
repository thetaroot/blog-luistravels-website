export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Luis Travels',
  description: 'Digital nomad and travel storyteller sharing authentic adventures from around the world. Follow Luis as he explores new cultures, hidden gems, and the nomadic lifestyle.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://luistravels.com',
  kofi: 'luistravels',
  patreon: 'luistravels',
  instagram: 'luistravels',
  pinterest: 'luistravels',
  youtube: '@luistravels',
  github: 'thetacmd',
}

export const CONTACT_CONFIG = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@luistravels.com',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'luistravels',
  github: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'thetacmd',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_HANDLE || '@luistravels',
  pinterest: process.env.NEXT_PUBLIC_PINTEREST_USERNAME || 'luistravels',
  
  // Social Media URLs
  instagramUrl: 'https://instagram.com/luistravels',
  instagramDmUrl: 'https://instagram.com/luistravels',
  githubUrl: 'https://github.com/thetacmd',
  youtubeUrl: 'https://youtube.com/@luistravels',
  pinterestUrl: 'https://www.pinterest.com/luistravels/',
  coffeeUrl: 'https://ko-fi.com/luistravels',
  
  // Contact Form Settings
  maxMessageLength: 2000,
  enableContactForm: process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === 'true',
}