import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    serviceName: z.string(),
    category: z.enum(['AI & Search Visibility', 'Paid Ad Management', 'Web Services']),
    order: z.number().default(99),
    metaDescription: z.string(),
    hero: z.object({ title: z.string(), titleMobile: z.string().optional(), lead: z.string(), leadMobile: z.string().optional() }),
    problem: z.object({ heading: z.string(), paragraphs: z.array(z.string()), paragraphsMobile: z.array(z.string()).optional(), pull: z.string() }),
    included: z.object({ intro: z.string(), items: z.array(z.object({ title: z.string(), text: z.string() })) }),
    steps: z.object({ heading: z.string(), items: z.array(z.object({ when: z.string(), title: z.string(), text: z.string() })) }),
    results: z.object({
      label: z.string(), stat: z.string(), statText: z.string(), statTextMobile: z.string().optional(),
      quote: z.string(), quoteMobile: z.string().optional(), attribution: z.string(),
    }),
    cta: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(['AI & Search Visibility', 'Paid Ad Management', 'Web Services']),
    date: z.coerce.date(),
    readTime: z.string(),
    author: z.string().default('Kyle Sabraw'),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

export const collections = { services, blog };
