// All content from the original page
export const pageContent = {
  intro: {
    en: "20 years old with no clue about life and the world. This isn't a guide or collection of how-to articles. More like letters and pictures to myself in 20 years to laugh about what I was up to. So if you're looking for helpful advice from the web, this is definitely the wrong place. But it's a real perspective on the countries I backpack through, without filters and Instagram perfectionism. Just me.",
    de: "20 Jahre alt ohne Plan vom Leben und der Welt. Das ist kein Guide und erst recht keine HowTo Blog Sammlung. Mehr Briefe und Bilder an mich in 20 Jahren um zu lachen was ich für einen Schwachsinn fabriziert habe. Wenn du also auf der Suche nach Hilfestellungen aus dem Web bist, ist das definitiv die falsche Adresse. Dafür ist es eine echte Perspektive auf die Länder durch die ich backpacke, ohne Filter und Instagram Perfektionismus. Ich eben."
  },
  travel: {
    en: "Right now my small 7kg backpack, comfortable flip-flops and an open attitude are enough for me. The world is too big and fascinating to postpone to 'later' or 'when I'm done'. Too much planning and German rationalism doesn't do me good.",
    de: "Mir reicht jetzt erst mal mein kleiner 7kg Rucksack, bequeme Latschen und eine offene Art. Die Welt ist zu groß und faszinierend um es auf 'später mal' oder 'wenn ich fertig bin' zu verschieben. Planung und zu viel deutscher Rationalismus tut nicht gut."
  },
  learning: {
    en: "",
    de: ""
  },
  blogTitle: {
    en: "I'm trying my hand at writing",
    de: "Ich probiere mich am Schreiben"
  },
  blogDescription: {
    en: "Short and hopefully interesting insights into how I perceive countries and cultures, what I learn, and what happens when you take a few crooked detours instead of the straight path.",
    de: "Kurze und hoffentlich interessante Einblicke wie ich Länder und Kulturen wahrnehme, was ich als Learning mitnehme und was passiert, wenn man statt dem geraden Weg ein paar krumme Umwege in Kauf nimmt."
  },
  galleryTitle: {
    en: "Memories",
    de: "Erinnerungen"
  },
  galleryDescription: {
    en: "Random stuff I found cool enough to take a pic of. No fancy editing, just what caught my eye.",
    de: "Random Zeug das ich cool genug fand um's zu knipsen. Keine fancy Bearbeitung, einfach was mir aufgefallen ist."
  },
  contactTitle: {
    en: "Fancy a coffee?",
    de: "Lust auf einen Kaffee?"
  },
  contactPopupTitle: {
    en: "Bring positive vibes...",
    de: "Bring positive Vibes..."
  },
  contactDescription1: {
    en: "Let's keep it simple, just write something nice and the topic doesn't matter. Happy to chat via Insta DM or classic email.",
    de: "Lass es uns nicht kompliziert machen, schreib einfach was nettes und das Thema ist egal. Gerne als Insta DM oder ganz klassisch per Mail."
  },
  contactDescription1Strong: {
    en: "",
    de: ""
  },
  polaroidCaption: {
    en: "Luis, somewhere on the road",
    de: "Luis, irgendwo unterwegs"
  },
  getCurrentLocation: {
    en: "🇩🇪 Deutschland",
    de: "🇩🇪 Deutschland"
  },
  blogComingSoon: {
    en: "Coming soon...",
    de: "Coming soon..."
  },
  blogFirstPosts: {
    en: "First posts coming while traveling",
    de: "Erste Posts folgen unterwegs"
  },
  getLatestBlogPosts: () => {
    // Return empty array - this is handled by build-time generation
    return []
  },
  readAllPosts: {
    en: "Read all posts →",
    de: "Alle Posts lesen →"
  },
  toGallery: {
    en: "To gallery →",
    de: "Zur Galerie →"
  },
}

// Sections for the animated sequence - LARGER LOGICAL GROUPS
export const animationSections = [
  {
    id: 'hero',
    type: 'hero' as const,
    duration: 0, // No auto-progression
    title: { en: "Travel. Discover. Share.", de: "Reisen. Entdecken. Teilen." },
    content: ['intro'],
    showExploreButton: true
  },
  {
    id: 'world-map',
    type: 'worldmap' as const,
    duration: 15000,
  },
  {
    id: 'blog',
    type: 'blog' as const,
    duration: 15000,
    title: 'blogTitle',
    content: ['blogDescription'],
    showBlogPosts: true
  },
  {
    id: 'intro',
    type: 'about' as const,
    duration: 15000,
    title: { en: "Hey, I'm Luis", de: "Moin, ich bin Luis" },
    content: ['intro'],
    showPolaroid: true,
    polaroidImage: '/images/portrait.jpg'
  },
  {
    id: 'journey',
    type: 'about' as const,
    duration: 15000,
    content: ['travel', 'learning'],
    showPolaroid: true,
    polaroidImage: '/images/backpacking_street.jpg'
  },
  {
    id: 'gallery',
    type: 'content' as const,
    duration: 15000,
    title: 'galleryTitle',
    content: ['galleryDescription'],
    showGalleryPreview: true
  },
  {
    id: 'contact',
    type: 'content' as const,
    duration: 15000,
    title: 'contactTitle',
    content: ['contactDescription1', 'contactDescription1Strong'],
    showContactButtons: true
  }
]