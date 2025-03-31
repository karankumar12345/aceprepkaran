export default function sitemap() {
  return [
    {
      url: 'https://aceprepkaran-lucx.vercel.app/', // Replace with your actual domain
      lastModified: new Date(),
      changeFrequency: 'yearly', // Since portfolio content doesn't change frequently
      priority: 1.0, // Highest priority because it's the only page
    },
    {
        url: 'https://aceprepkaran-lucx.vercel.app/dashboard',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
    },
  ];
}