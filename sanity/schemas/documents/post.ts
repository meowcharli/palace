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
      type: "url",
      description: "Vimeo URL to display as featured video (will be shown as a thumbnail)",
      validation: (rule) => 
        rule.uri({
          allowRelative: false,
          scheme: ["http", "https"]
        })
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
