import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import {
  CircleCheckBig,
  Clock,
  Pause,
  Play,
  PlusCircle,
  Shuffle,
} from "lucide-react";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import Artists from "../Single/Artists";

const PlaylistPage = () => {
  const { id } = useParams();
  const { isPlaying, currentSong, togglePlay, playAlbum, isShuffle } =
    usePlayerStore();
  const {
    currentUser,
    currentPlaylist,
    getPlaylistSongs,
    playlistLoading,
    playlists,
    addAlbumToPlaylist,
  } = useUserStore();
  const { isPlayingSong, isBroadcasting, pauseSong, playSong, roomId } =
    useSocketStore();

  const handlePlayAlbum = () => {
    if (!currentPlaylist) return;

    const iscurrentPlaylistPlaying = currentPlaylist?.songs.some(
      (song: { _id: string | undefined }) => song._id === currentSong?._id
    );
    if (currentUser && isBroadcasting) {
      if (isPlayingSong && iscurrentPlaylistPlaying && currentSong) {
        pauseSong(currentUser._id, roomId, currentSong._id);
      } else {
        playSong(currentUser._id, roomId, currentSong!._id, null);
      }
    } else if (iscurrentPlaylistPlaying) {
      togglePlay();
    } else {
      // start playing the album from the beginning
      playAlbum(currentPlaylist?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentPlaylist) return;

    playAlbum(currentPlaylist?.songs, index);
  };

  const handleShufflePlaylist = () => {
    if (!currentPlaylist) return;
    if (isShuffle) return usePlayerStore.setState({ isShuffle: false });

    usePlayerStore.setState({ isShuffle: true });
    const randomIndex = Math.floor(
      Math.random() * currentPlaylist.songs.length
    );
    playAlbum(currentPlaylist?.songs, randomIndex);
  };

  useEffect(() => {
    if (id) {
      useUserStore.setState({ currentPlaylist: null });
      getPlaylistSongs(id);
    }
  }, [id, getPlaylistSongs, playlists]);

  const handleAddAlbumToPlaylist = () => {
    if (currentPlaylist) {
      const songs: string[] = [];
      currentPlaylist.songs.map((song: { _id: string }) => {
        songs.push(song._id);
      });
      addAlbumToPlaylist(
        currentPlaylist.playlistId,
        currentPlaylist.playlistName,
        currentPlaylist.artist,
        currentPlaylist.albumId,
        currentPlaylist.imageUrl,
        songs
      );
    }
  };

  const isAddedToPlaylist = playlists.find(
    (playlist) => playlist.playlistId === currentPlaylist?.playlistId
  );

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-screen">
          {/* gradiant background */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            area-hidden="true"
          />
          {/* content */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row p-6 gap-6 pb-8">
              {!playlistLoading && (
                <img
                  src={currentPlaylist?.imageUrl}
                  alt="playlist_img"
                  className="w-[240px] h-[240px] shadow-xl rounded"
                />
              )}
              {playlistLoading && (
                <Skeleton className="h-[240px] w-[240px] rounded" />
              )}
              <div className="flex flex-col justify-end">
                {!playlistLoading && (
                  <h1 className=" text-2xl md:text-7xl font-bold my-4">
                    {currentPlaylist?.playlistName}
                  </h1>
                )}
                {playlistLoading && <Skeleton className="h-10 w-[250px]" />}
                {!playlistLoading && (
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    <span>
                      {currentPlaylist && currentPlaylist.artist.length > 3
                        ? "Various artists"
                        : currentPlaylist?.artist.map(
                            (artist, idx) => idx < 3 && artist.name
                          ).join(", ")}
                    </span>
                    <span>● {currentPlaylist?.songs.length} Songs</span>
                  </div>
                )}
                {playlistLoading && <Skeleton className="h-4 w-[250px] mt-5" />}
              </div>
            </div>
            {/* Play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentPlaylist?.songs.some(
                  (song: { _id: string | undefined }) =>
                    song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>

              {/* Add to playlist button */}
              {isAddedToPlaylist ? (
                <CircleCheckBig
                  className="size-7 cursor-pointer"
                  color="green"
                />
              ) : (
                <PlusCircle
                  onClick={handleAddAlbumToPlaylist}
                  className="size-7 cursor-pointer"
                />
              )}

              <Shuffle
                onClick={handleShufflePlaylist}
                className={`size-5 cursor-pointer ${
                  isShuffle && "text-green-500"
                } `}
              />
            </div>

            {/* Table section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Song lists */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {!playlistLoading &&
                    currentPlaylist?.songs.map(
                      (
                        song: {
                          releaseDate: ReactNode;
                          _id: Key | null | undefined;
                          imageUrl: string | undefined;
                          title:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined;
                          artists: { primary: { name: any }[] };
                          createdAt: string;
                          duration: number;
                        },
                        index: number
                      ) => {
                        const isCurrentSong = currentSong?._id === song._id;
                        return (
                          <div
                            key={song._id}
                            onClick={() => handlePlaySong(index)}
                            className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                          >
                            <div className="flex items-center justify-center">
                              {isCurrentSong && isPlaying ? (
                                <div className="size-4 text-green-500 animate-bounce">
                                  ♫
                                </div>
                              ) : (
                                <span className="group-hover:hidden">
                                  {index + 1}
                                </span>
                              )}
                              {!isCurrentSong && (
                                <Play className="h-4 w-4 hidden group-hover:block" />
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <img
                                src={song.imageUrl}
                                alt="song_img"
                                className="size-10"
                              />

                              <div>
                                <div className={`font-medium text-white`}>
                                  {song.title}
                                </div>
                                <div>
                                  {song.artists?.primary
                                    .map((artist) => artist.name)
                                    .join(", ")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {song.releaseDate}
                            </div>
                            <div className="flex items-center">
                              {formatDuration(song.duration)}
                            </div>
                          </div>
                        );
                      }
                    )}

                  <h2 className="text-xl sm:text-2xl font-bold">Artists</h2>
                  {/* Swiper for artists */}
                  <div className="flex">
                    <ScrollArea type="always" className="w-1 flex-1">
                      <div className="flex gap-2 pb-4">
                        {currentPlaylist &&
                          currentPlaylist.artist.map((artist,idx) => (
                            <Artists
                              key={idx}
                              artist={artist}
                            />
                          ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="w-full" />
                    </ScrollArea>
                  </div>

                  {playlistLoading &&
                    Array.from({ length: 10 }).map((_, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 px-10 mt-5"
                        >
                          <div className="flex gap-2">
                            <Skeleton className="h-[55px] size-10 " />
                            <div className="space-y-2">
                              <Skeleton className="h-[15px] w-20  " />
                              <Skeleton className="h-[15px] w-12  " />
                            </div>
                          </div>
                          <div>
                            <Skeleton className="h-[15px] w-20  " />
                          </div>
                          <div>
                            <Skeleton className="h-[15px] w-12  " />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistPage;

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
