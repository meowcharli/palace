import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  title,
  domainTitles
}`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  videoEmbed,
  featured,
  featuredTextColor,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

export const featuredPostsQuery = defineQuery(`
  *[_type == "post" && featured == true && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const recentPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0...6] {
    ${postFields}
  }
`);

export const galleryItemsQuery = defineQuery(`
  *[_type == "galleryItem" && defined(article) && defined(article->slug.current)] | order(order asc) {
    _id,
    title,
    image,
    videoEmbed,
    "articleSlug": article->slug.current,
    "articleTitle": article->title,
    order,
    featured
  }
`);

export const showcaseQuery = defineQuery(`
  *[_type == "showcaseItem" && defined(article) && defined(article->slug.current)] | order(order asc) {
    _id,
    title,
    image,
    videoEmbed,
    "articleSlug": article->slug.current,
    "articleTitle": article->title,
    order,
    featured
  }
`);