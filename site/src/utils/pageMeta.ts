/* Keeps the title, description, and canonical URL in sync with the current route for search engines. */

const SITE_URL = 'https://dbdflashcards.com';

export interface PageMeta {
    title: string;
    description: string;
    noindex?: boolean;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
    let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
    }
    tag.content = content;
}

export function applyPageMeta(meta: PageMeta, path: string) {
    const url = SITE_URL + path;

    document.title = meta.title;
    setMetaTag('name', 'description', meta.description);
    setMetaTag('name', 'robots', meta.noindex ? 'noindex' : 'index, follow');
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:url', url);
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
        canonical.href = url;
    }
}
