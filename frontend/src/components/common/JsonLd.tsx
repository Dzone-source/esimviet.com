interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'eSIM Global',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://esimglobal.com',
        description: 'Buy eSIM online for 100+ countries. Affordable data plans for travelers.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esimglobal.com'}/countries?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  price,
  currency = 'USD',
}: {
  name: string;
  description: string;
  price: number;
  currency?: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        offers: {
          '@type': 'Offer',
          price: price.toFixed(2),
          priceCurrency: currency,
          availability: 'https://schema.org/InStock',
        },
      }}
    />
  );
}
