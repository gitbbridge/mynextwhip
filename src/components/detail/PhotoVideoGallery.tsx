import React, { useState } from 'react';
import { MediaItem } from '../../types';
import { Video, Flame, Image as ImageIcon, Volume2, Play, Eye } from 'lucide-react';

interface PhotoVideoGalleryProps {
  photos: MediaItem[];
  coldStartVideo?: MediaItem;
  walkaroundVideo?: MediaItem;
  vehicleTitle: string;
}

export const PhotoVideoGallery: React.FC<PhotoVideoGalleryProps> = ({
  photos,
  coldStartVideo,
  walkaroundVideo,
  vehicleTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'coldStart' | 'walkaround'>('photos');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const activePhoto = photos[activePhotoIndex] || {
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    label: 'Vehicle Overview',
  };

  return (
    <div className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
      {/* Media Type Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('photos');
              setIsVideoPlaying(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span>Photos ({photos.length})</span>
          </button>

          {coldStartVideo && (
            <button
              onClick={() => {
                setActiveTab('coldStart');
                setIsVideoPlaying(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'coldStart'
                  ? 'bg-orange-950/80 text-orange-400 border border-orange-800 shadow-xs'
                  : 'text-zinc-400 hover:text-orange-400 hover:bg-zinc-800/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
              <span>Cold-Start Video</span>
            </button>
          )}

          {walkaroundVideo && (
            <button
              onClick={() => {
                setActiveTab('walkaround');
                setIsVideoPlaying(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'walkaround'
                  ? 'bg-blue-950/80 text-blue-400 border border-blue-800 shadow-xs'
                : 'text-zinc-400 hover:text-blue-400 hover:bg-zinc-800/50'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-blue-500" />
              <span>Walkaround Video</span>
            </button>
          )}
        </div>

        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          {activeTab === 'photos' ? `${activePhotoIndex + 1} of ${photos.length}` : 'High-Def Video Stream'}
        </span>
      </div>

      {/* Main Screen Container */}
      <div className="relative aspect-16/10 sm:aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
        {activeTab === 'photos' && (
          <>
            <img
              src={activePhoto.url}
              alt={`${vehicleTitle} - ${activePhoto.label || 'Photo'}`}
              className="w-full h-full object-contain"
            />
            {activePhoto.label && (
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium border border-white/10">
                {activePhoto.label}
              </div>
            )}
          </>
        )}

        {activeTab === 'coldStart' && coldStartVideo && (
          <div className="w-full h-full relative bg-zinc-950 flex flex-col items-center justify-center">
            {isVideoPlaying ? (
              <video
                src={coldStartVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={coldStartVideo.thumbnailUrl}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={coldStartVideo.thumbnailUrl || photos[0]?.url}
                  alt="Cold start thumbnail"
                  className="w-full h-full object-cover opacity-60"
                />
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute w-16 h-16 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center shadow-2xl shadow-orange-950 transition transform hover:scale-105 cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
              </div>
            )}

            {/* Cold Start Sound Quality Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/85 backdrop-blur-xs text-orange-400 text-xs px-2.5 py-1 rounded-lg border border-orange-500/40">
              <Volume2 className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-bold">Turn Volume Up: Genuine Cold Crank Audio</span>
            </div>
          </div>
        )}

        {activeTab === 'walkaround' && walkaroundVideo && (
          <div className="w-full h-full relative bg-zinc-950 flex flex-col items-center justify-center">
            {isVideoPlaying ? (
              <video
                src={walkaroundVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={walkaroundVideo.thumbnailUrl}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={walkaroundVideo.thumbnailUrl || photos[0]?.url}
                  alt="Walkaround thumbnail"
                  className="w-full h-full object-cover opacity-60"
                />
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-105 cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/85 backdrop-blur-xs text-blue-400 text-xs px-2.5 py-1 rounded-lg border border-blue-500/40">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold">Walkaround & Undercarriage Footage</span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {photos.map((ph, idx) => (
          <button
            key={ph.id || idx}
            onClick={() => {
              setActiveTab('photos');
              setActivePhotoIndex(idx);
              setIsVideoPlaying(false);
            }}
            className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
              activeTab === 'photos' && activePhotoIndex === idx
                ? 'border-[#EA580C] ring-2 ring-orange-500/30'
                : 'border-zinc-700 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={ph.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}

        {coldStartVideo && (
          <button
            onClick={() => {
              setActiveTab('coldStart');
              setIsVideoPlaying(true);
            }}
            className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 bg-orange-950/60 flex items-center justify-center transition cursor-pointer ${
              activeTab === 'coldStart'
                ? 'border-orange-500 ring-2 ring-orange-500/30'
                : 'border-orange-800/80 opacity-70 hover:opacity-100'
            }`}
            title="Cold Start Video"
          >
            <Flame className="w-5 h-5 text-orange-400" />
          </button>
        )}

        {walkaroundVideo && (
          <button
            onClick={() => {
              setActiveTab('walkaround');
              setIsVideoPlaying(true);
            }}
            className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 bg-blue-950/60 flex items-center justify-center transition cursor-pointer ${
              activeTab === 'walkaround'
                ? 'border-blue-500 ring-2 ring-blue-500/30'
                : 'border-blue-800/80 opacity-70 hover:opacity-100'
            }`}
            title="Walkaround Video"
          >
            <Video className="w-5 h-5 text-blue-400" />
          </button>
        )}
      </div>
    </div>
  );
};
