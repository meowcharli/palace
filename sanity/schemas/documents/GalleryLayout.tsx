export default {
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  fields: [
    {
      name: 'url',
      title: 'Vimeo URL',
      type: 'url',
      description: 'The URL of the Vimeo video to embed',
    },
    {
      name: 'embedCode',
      title: 'Embed Code (Optional)',
      type: 'text',
      description: 'Custom embed code if available (will override URL if provided)',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption for the video',
    },
    {
      name: 'showThumbnail',
      title: 'Show Thumbnail',
      type: 'boolean',
      description: 'Show thumbnail instead of video initially',
      initialValue: false,
    },
    {
      name: 'hideControls',
      title: 'Hide Controls',
      type: 'boolean',
      description: 'Hide video controls',
      initialValue: false,
    },
    {
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      description: 'Autoplay video on load (must be muted)',
      initialValue: false,
    },
    {
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      description: 'Loop video',
      initialValue: false,
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Widescreen (16:9)', value: '16:9' },
          { title: 'Square (1:1)', value: '1:1' },
        ],
        layout: 'radio',
      },
      initialValue: '16:9',
      description: 'Choose the aspect ratio for the video',
    },
  ],
};