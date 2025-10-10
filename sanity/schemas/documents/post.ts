import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import authorType from "./author";

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
              validation: (rule) => rule.required(),
            },
          ],
        },
        {
          type: "object",
          name: "video",
          title: "Vimeo Embed",
          fields: [
            {
              name: "url",
              type: "url",
              title: "Vimeo URL",
              description: "Enter the Vimeo video URL (e.g., https://vimeo.com/123456789)",
              validation: (rule) => rule.uri({
                allowRelative: false,
                scheme: ["http", "https"]
              }).required()
            },
            {
              name: "embedCode",
              type: "text",
              title: "Custom Embed Code",
              description: "Optional: Paste custom Vimeo embed code for advanced options"
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption for the video"
            },
            {
              name: "showThumbnail",
              type: "boolean",
              title: "Show as Thumbnail",
              description: "Display as a clickable thumbnail instead of embedded player",
              initialValue: false
            },
            {
              name: "hideControls",
              type: "boolean",
              title: "Hide Controls",
              description: "Hide player controls (uses Vimeo's background mode)",
              initialValue: false
            },
            {
              name: "autoplay",
              type: "boolean",
              title: "Autoplay",
              description: "Automatically play video when page loads (requires muting)",
              initialValue: false
            },
            {
              name: "loop",
              type: "boolean",
              title: "Loop",
              description: "Loop the video",
              initialValue: false
            }
          ],
          preview: {
            select: {
              url: 'url',
              caption: 'caption'
            },
            prepare({ url, caption }) {
              return {
                title: caption || 'Vimeo Embed',
                subtitle: url
              }
            }
          }
        },
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "videoEmbed",
      title: "Featured Video",
      type: "object",
      description: "Add a featured video (shown in place of the cover image)",
      fields: [
        {
          name: "url",
          type: "url",
          title: "Vimeo URL",
          description: "Enter the Vimeo video URL",
          validation: (rule) => 
            rule.uri({
              allowRelative: false,
              scheme: ["http", "https"]
            })
        },
        {
          name: "embedCode",
          type: "text",
          title: "Custom Embed Code",
          description: "Optional: Paste custom Vimeo embed code instead of URL for more control"
        },
        {
          name: "hideControls",
          type: "boolean",
          title: "Hide Controls",
          description: "Hide player controls for a cleaner look (will use Vimeo's background parameter)",
          initialValue: false
        },
        {
          name: "autoplay",
          type: "boolean",
          title: "Autoplay",
          description: "Automatically play video when in view (will be muted)",
          initialValue: false
        },
        {
          name: "loop",
          type: "boolean",
          title: "Loop",
          description: "Loop the video",
          initialValue: true
        }
      ]
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Mark this post as featured to display it on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "featuredTextColor",
      title: "Featured Text Color",
      type: "string",
      description: "Enter any valid CSS color (e.g. #fff, #000, white, black, rgb(0,0,0)) for the text on the featured post.",
      placeholder: "#fff or #000 or any CSS color",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
