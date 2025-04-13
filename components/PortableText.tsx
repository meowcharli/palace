import { PortableText, PortableTextComponents } from '@portabletext/react';
import VimeoEmbed from './VimeoEmbed';

interface VideoValue {
  _type: 'video';
  url: string;
  caption?: string;
  showThumbnail?: boolean;
}

const components: PortableTextComponents = {
  types: {
    video: ({ value }: { value: VideoValue }) => {
      return (
        <VimeoEmbed 
          url={value.url}
          caption={value.caption}
          showThumbnail={value.showThumbnail} aspectRatio={''}        />
      );
    },
    // your other custom components
  },
};

interface PortableTextProps {
  content: any;
}

const MyPortableText: React.FC<PortableTextProps> = ({ content }) => {
  return <PortableText value={content} components={components} />;
};

export default MyPortableText;
