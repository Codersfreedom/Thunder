import { Album } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Link } from "react-router-dom";

type SectionGridProps = {
  title: string;
  songs: Album[];
  isLoading: boolean;
};
const AlbumGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {songs.map((song) => (
          <Link
            to={`/album/${song.albumId}`}
            key={song._id}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 
									group-hover:scale-105"
                />
              </div>
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artists.primary.map((artist)=>artist.name).join(", ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default AlbumGrid;
