// sanity/schemas/documents/galleryItem.ts
import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryItem",
  title: "Gallery Item",
  icon: ImageIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "A title for this gallery item (for admin purposes)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
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
              if ((context.document?.image as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
    }),
    defineField({
      name: "videoEmbed",
      title: "Video Embed",
      type: "object",
      description: "Add a video instead of an image",
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
          description: "Hide player controls for a cleaner look",
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
      name: "article",
      title: "Linked Article",
      type: "reference",
      to: [{ type: "post" }],
      description: "The article this gallery item links to",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Used for manual ordering (optional)",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Featured items will be displayed more prominently",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      articleTitle: "article.title",
    },
    prepare({ title, media, articleTitle }) {
      return {
        title: title,
        subtitle: articleTitle ? `Links to: ${articleTitle}` : 'No article linked',
        media: media,
      };
    },
  },
});