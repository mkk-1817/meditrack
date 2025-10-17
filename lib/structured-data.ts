/**
 * Structured Data Generation for Health Content
 * Implements FHIR-inspired schema markup for better SEO and health data structure
 */

export interface HealthSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * Generate structured data for the main application
 */
export function generateWebApplicationSchema(): HealthSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Medi Track',
    description: 'Luxury medical tracking and wellness analytics application',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web Browser',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://meditrack.vercel.app',
    author: {
      '@type': 'Organization',
      name: 'Medi Track Team',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Vital Signs Monitoring',
      'AI Health Insights',
      'Medical Records Management',
      'Appointment Scheduling',
      'Wellness Analytics',
      'Health Trend Analysis'
    ],
    screenshot: `${process.env.NEXT_PUBLIC_APP_URL}/screenshots/dashboard.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '150'
    }
  };
}

/**
 * Generate structured data for health articles/insights
 */
export function generateHealthArticleSchema(article: {
  title: string;
  description: string;
  category: string;
  datePublished: string;
  dateModified?: string;
}): HealthSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: article.title,
    description: article.description,
    about: {
      '@type': 'MedicalCondition',
      name: article.category
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: 'Medi Track Medical Team'
    },
    medicalAudience: {
      '@type': 'MedicalAudience',
      audienceType: 'Patient'
    },
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: 'main'
    }
  };
}

/**
 * Generate structured data for health services
 */
export function generateMedicalServiceSchema(): HealthSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Medi Track Health Platform',
    description: 'Digital health tracking and wellness analytics service',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English'
    },
    medicalSpecialty: [
      'Preventive Medicine',
      'Digital Health',
      'Wellness Medicine'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Health Tracking Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Vital Signs Monitoring',
            description: 'Track and analyze vital signs with AI insights'
          }
        },
        {
          '@type': 'Offer', 
          itemOffered: {
            '@type': 'Service',
            name: 'Health Analytics',
            description: 'Comprehensive health data analysis and reporting'
          }
        }
      ]
    }
  };
}

/**
 * Generate FAQ schema for health-related questions
 */
export function generateHealthFAQSchema(): HealthSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Medi Track HIPAA compliant?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Medi Track follows HIPAA compliance standards to protect your health information privacy and security.'
        }
      },
      {
        '@type': 'Question',
        name: 'How accurate are the AI health insights?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI insights are based on established medical guidelines and research, but should not replace professional medical advice.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I share my health data with my doctor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can export your health data in standard formats to share with your healthcare providers.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of vital signs can I track?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can track blood pressure, heart rate, temperature, glucose levels, sleep patterns, exercise data, and more.'
        }
      }
    ]
  };
}

/**
 * Generate breadcrumb schema for navigation
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{
  name: string;
  url: string;
}>): HealthSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate review schema for testimonials
 */
export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  text: string;
  date: string;
}>): HealthSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Medi Track Health Platform',
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.text,
      datePublished: review.date
    }))
  };
}

/**
 * Generate local business schema (if applicable)
 */
export function generateLocalBusinessSchema(): HealthSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'Medi Track Health Platform',
    description: 'Digital health tracking and wellness analytics platform',
    url: process.env.NEXT_PUBLIC_APP_URL,
    image: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    telephone: '+1-555-MEDITRACK',
    email: 'hello@meditrack.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'CA',
      addressLocality: 'San Francisco'
    },
    openingHours: '24/7',
    priceRange: 'Free',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Health Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Health Data Analytics',
            description: 'AI-powered health insights and trend analysis'
          }
        }
      ]
    }
  };
}

/**
 * Helper function to inject structured data into pages
 */
export function injectStructuredData(schema: HealthSchema | HealthSchema[]): string {
  const schemaArray = Array.isArray(schema) ? schema : [schema];
  return JSON.stringify(schemaArray.length === 1 ? schemaArray[0] : schemaArray);
}

/**
 * Common structured data for all pages
 */
export function getCommonStructuredData(): HealthSchema[] {
  return [
    generateWebApplicationSchema(),
    generateMedicalServiceSchema(),
    generateHealthFAQSchema()
  ];
}