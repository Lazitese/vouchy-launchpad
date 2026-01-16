import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    schema?: Record<string, any>;
    addSoftwareSchema?: boolean;
}

export const SEOHead = ({
    title = "Vouchy Launchpad | Collect Authentic Video Testimonials",
    description = "The all-in-one platform to collect, manage, and showcase video and text testimonials. Features AI-assisted polishing and a built-in teleprompter.",
    image = "/og-image.png",
    url = typeof window !== 'undefined' ? window.location.href : "https://vouchy.click",
    type = "website",
    schema,
    addSoftwareSchema = false
}: SEOHeadProps) => {

    const siteUrl = "https://vouchy.click";
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Vouchy Launchpad",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "description": "A platform for collecting and showcasing video testimonials.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        // Mocked aggregate rating for SEO visibility as requested
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "85",
            "bestRating": "5",
            "worstRating": "1"
        },
        "featureList": "AI-assisted text polishing, Teleprompter for video recording, Customizable widgets, Video hosting, Analytics",
        "screenshot": `${siteUrl}/screenshot.png` // Placeholder
    };

    // Merge provided schema with software schema if requested, or just use provided
    const finalSchema = schema || (addSoftwareSchema ? softwareSchema : null);

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Vouchy Launchpad" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* JSON-LD Schema */}
            {finalSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(finalSchema)}
                </script>
            )}
        </Helmet>
    );
};
