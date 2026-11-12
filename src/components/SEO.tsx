import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

const DEFAULT_OG_IMAGE = "https://my-3d-portfolio-90.vercel.app/og-image.jpg";

export default function SEO({ title, description, keywords, ogImage = DEFAULT_OG_IMAGE }: SEOProps) {
  const fullTitle = `${title} | Umer Khan - Full-Stack Developer`;
  const defaultKeywords = 'Full-Stack Developer, React, Next.js, Node.js, AI, Machine Learning, Web Development, Portfolio, Umer Khan';
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
