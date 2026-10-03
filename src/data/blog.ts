import { getCollection, type CollectionEntry } from 'astro:content';
import { categories } from './site';

export type Post = CollectionEntry<'blog'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Card fields the design's archive / related-post blocks expect. */
export const card = (p: Post) => ({
  href: `/blog/${p.id}/`,
  slot: `blog-${p.id}`,
  cat: p.data.category,
  short: categories[p.data.category].short,
  accent: categories[p.data.category].accent,
  title: p.data.title,
  excerpt: p.data.excerpt,
  date: formatDate(p.data.date),
  read: p.data.readTime,
});

export const filters = [
  { key: 'All', label: 'All posts', short: 'All posts', accent: 'rgba(15,15,18,0.25)' },
  ...Object.entries(categories).map(([k, v]) => ({ key: k, label: k, short: v.short, accent: v.accent })),
];
