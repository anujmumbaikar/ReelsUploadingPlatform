import { Video } from '@imagekit/next';

interface VideoPlayerProps {
  src: string;
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transition-all transform hover:scale-105">
      <Video
        urlEndpoint={`https://ik.imagekit.io/${process.env.IMAGEKIT_ID}`}
        src={src}
        controls
        width={1080}
        height={1920}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default VideoPlayer;
