const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

async function generateContentStats() {
  console.log('🚀 Generating content statistics...');
  
  try {
    // Scan blog posts
    const blogStats = await scanBlogPosts();
    
    // Scan gallery images
    const galleryStats = await scanGalleryImages();
    
    // Combine statistics by country
    const countryStats = combineStats(blogStats, galleryStats);
    
    // Generate enhanced data files
    await generateDataFiles(countryStats, blogStats, galleryStats);
    
    // Generate additional automation files
    await generateAutomationFiles(countryStats, blogStats, galleryStats);
    
    console.log('✅ Content statistics generated successfully!');
  } catch (error) {
    console.error('❌ Error generating content statistics:', error);
    process.exit(1);
  }
}

async function scanBlogPosts() {
  console.log('📝 Scanning blog posts...');
  
  const blogFiles = glob.sync('content/blog/**/*.md');
  const blogStats = {};
  const allPosts = [];
  
  for (const file of blogFiles) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const { data: frontmatter } = matter(content);
      
      if (frontmatter.country) {
        const country = frontmatter.country;
        
        if (!blogStats[country]) {
          blogStats[country] = {
            posts: 0,
            cities: new Set(),
            latestPost: null
          };
        }
        
        blogStats[country].posts += 1;
        
        if (frontmatter.city) {
          blogStats[country].cities.add(frontmatter.city);
        }
        
        if (frontmatter.date) {
          const postDate = new Date(frontmatter.date);
          if (!blogStats[country].latestPost || postDate > new Date(blogStats[country].latestPost)) {
            blogStats[country].latestPost = frontmatter.date;
          }
        }
        
        allPosts.push({
          ...frontmatter,
          file: file.replace('content/blog/', '').replace('.md', ''),
          slug: path.basename(file, '.md')
        });
      }
    } catch (error) {
      console.warn(`Warning: Could not process ${file}:`, error.message);
    }
  }
  
  // Convert Sets to arrays
  Object.keys(blogStats).forEach(country => {
    blogStats[country].cities = Array.from(blogStats[country].cities);
  });
  
  console.log(`Found ${allPosts.length} blog posts across ${Object.keys(blogStats).length} countries`);
  
  return { stats: blogStats, posts: allPosts };
}

async function scanGalleryImages() {
  console.log('🖼️ Scanning gallery images...');
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const galleryStats = {};
  
  try {
    const galleryPath = 'content/gallery';
    const countries = await fs.readdir(galleryPath);
    
    for (const country of countries) {
      const countryPath = path.join(galleryPath, country);
      const stat = await fs.stat(countryPath);
      
      if (stat.isDirectory()) {
        // Normalize country names (capitalize first letter)
        const normalizedCountry = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
        
        galleryStats[normalizedCountry] = {
          images: 0,
          cities: []
        };
        
        try {
          const cities = await fs.readdir(countryPath);
          
          for (const city of cities) {
            const cityPath = path.join(countryPath, city);
            const cityStat = await fs.stat(cityPath);
            
            if (cityStat.isDirectory()) {
              const files = await fs.readdir(cityPath);
              const imageCount = files.filter(file => 
                imageExtensions.includes(path.extname(file).toLowerCase())
              ).length;
              
              if (imageCount > 0) {
                galleryStats[normalizedCountry].cities.push({
                  name: city,
                  images: imageCount
                });
                galleryStats[normalizedCountry].images += imageCount;
              }
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not scan cities in ${country}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.warn('Warning: Could not scan gallery directory:', error.message);
  }
  
  const totalImages = Object.values(galleryStats).reduce((sum, country) => sum + country.images, 0);
  console.log(`Found ${totalImages} images across ${Object.keys(galleryStats).length} countries`);
  
  return galleryStats;
}

function combineStats(blogStats, galleryStats) {
  console.log('🔄 Combining statistics...');
  
  const combinedStats = {};
  const allCountries = new Set([
    ...Object.keys(blogStats.stats || {}),
    ...Object.keys(galleryStats || {})
  ]);
  
  // Default country data
  const defaultCountries = {
    'Thailand': { visited: true, current: true },
    'Colombia': { visited: true, current: false },
    'Germany': { visited: true, current: false }
  };
  
  for (const country of allCountries) {
    const blog = blogStats.stats?.[country] || { posts: 0, cities: [], latestPost: null };
    const gallery = galleryStats[country] || { images: 0, cities: [] };
    const defaults = defaultCountries[country] || { visited: true, current: false };
    
    combinedStats[country] = {
      ...defaults,
      posts: blog.posts,
      images: gallery.images,
      cities: [...new Set([...blog.cities, ...gallery.cities.map(c => c.name)])],
      latestPost: blog.latestPost,
      lastUpdated: new Date().toISOString()
    };
  }
  
  console.log(`Generated stats for ${Object.keys(combinedStats).length} countries`);
  
  return combinedStats;
}

async function generateDataFiles(countryStats, blogStats, galleryStats) {
  console.log('💾 Writing data files...');
  
  // Ensure data directory exists
  await fs.mkdir('src/data', { recursive: true });
  
  // Write country statistics
  await fs.writeFile(
    'src/data/countries.json',
    JSON.stringify(countryStats, null, 2)
  );
  
  // Write blog index
  await fs.writeFile(
    'src/data/blog-index.json',
    JSON.stringify({
      posts: blogStats.posts || [],
      lastUpdated: new Date().toISOString(),
      totalPosts: (blogStats.posts || []).length
    }, null, 2)
  );
  
  // Write gallery index
  await fs.writeFile(
    'src/data/gallery-index.json',
    JSON.stringify({
      ...galleryStats,
      lastUpdated: new Date().toISOString(),
      totalImages: Object.values(galleryStats).reduce((sum, country) => sum + country.images, 0)
    }, null, 2)
  );
  
  console.log('📊 Data files written:');
  console.log('  - src/data/countries.json');
  console.log('  - src/data/blog-index.json');  
  console.log('  - src/data/gallery-index.json');
}

async function generateAutomationFiles(countryStats, blogStats, galleryStats) {
  console.log('🤖 Generating automation files...');
  
  try {
    // Generate worldmap data
    const worldmapData = await generateWorldmapData(countryStats);
    await fs.writeFile(
      'src/data/worldmap.json',
      JSON.stringify(worldmapData, null, 2)
    );
    
    // Generate hashtag index
    const hashtagIndex = await generateHashtagIndex(blogStats.posts);
    await fs.writeFile(
      'src/data/hashtag-index.json',
      JSON.stringify(hashtagIndex, null, 2)
    );
    
    // Generate sitemap
    const sitemap = await generateSitemap(blogStats.posts);
    await fs.writeFile('public/sitemap.xml', sitemap);
    
    console.log('🤖 Automation files generated:');
    console.log('  - src/data/worldmap.json');
    console.log('  - src/data/hashtag-index.json');
    console.log('  - public/sitemap.xml');
    
  } catch (error) {
    console.error('❌ Error generating automation files:', error);
  }
}

async function generateWorldmapData(countryStats) {
  // Load current location
  let currentLocation = 'Germany';
  try {
    const locationData = JSON.parse(await fs.readFile('content/location.json', 'utf8'));
    currentLocation = locationData.current;
  } catch (error) {
    console.warn('Could not load location data, using default');
  }
  
  const countries = {};
  const visitedCountries = [];
  
  Object.entries(countryStats).forEach(([country, stats]) => {
    countries[country] = {
      visited: true,
      current: country === currentLocation,
      posts: stats.posts || 0,
      images: stats.images || 0,
      cities: stats.cities || []
    };
    visitedCountries.push(country);
  });
  
  return {
    countries,
    currentCountry: currentLocation,
    visitedCountries,
    totalCountries: visitedCountries.length,
    lastUpdated: new Date().toISOString()
  };
}

async function generateHashtagIndex(posts) {
  const tagMap = {};
  
  posts.forEach(post => {
    const tags = post.tags || [];
    tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase().trim();
      
      if (!tagMap[normalizedTag]) {
        tagMap[normalizedTag] = {
          tag: normalizedTag,
          count: 0,
          posts: [],
          locations: [],
          lastUsed: post.date
        };
      }
      
      tagMap[normalizedTag].count++;
      tagMap[normalizedTag].posts.push(post.slug);
      
      const location = post.country || 'Unknown';
      if (!tagMap[normalizedTag].locations.includes(location)) {
        tagMap[normalizedTag].locations.push(location);
      }
      
      if (post.date > tagMap[normalizedTag].lastUsed) {
        tagMap[normalizedTag].lastUsed = post.date;
      }
    });
  });
  
  const popularTags = Object.values(tagMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(tag => tag.tag);
  
  return {
    tags: tagMap,
    totalTags: Object.keys(tagMap).length,
    popularTags,
    lastUpdated: new Date().toISOString()
  };
}

async function generateSitemap(posts) {
  // Use environment variable if available, fallback to production domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prutscheln.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/gallery', changefreq: 'weekly', priority: '0.8' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' }
  ];
  
  const blogUrls = posts.map(post => ({
    url: `/blog/${post.slug}`,
    lastmod: post.date ? new Date(post.date).toISOString().split('T')[0] : currentDate,
    changefreq: 'monthly',
    priority: '0.8'
  }));
  
  const allUrls = [...staticPages, ...blogUrls];
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return sitemapXml;
}

// Run the script
generateContentStats();