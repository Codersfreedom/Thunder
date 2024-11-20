import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { useUser } from "@clerk/clerk-react";
import {
  Heart,
  ListMusic,
  ListPlus,
  Mic2,
  Pause,
  Play,
  Plus,
  PlusCircle,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } =
    usePlayerStore();

  const { addToFavorite, playlists, addSongToPlaylist } = useUserStore();
  const { user } = useUser();

  const [volume, setVolume] = useState(20);
  const [isMute,setMute] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlistName, setPlaylistName] = useState("");
  const [artist, setArtist] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  let isAlreadyFavorite;
  const favoriteSongs = playlists.find(
    (playlist) => playlist.playListName === "Favorites"
  );

  if (favoriteSongs && currentSong) {
    isAlreadyFavorite = favoriteSongs.songs.includes(currentSong._id);
  }

  const handleAddToFavorite = () => {
    if (currentSong) {
      const currUserName = user?.firstName || "You";

      addToFavorite(
        currUserName,
        currentSong.imageUrl,
        currentSong._id,
        "Favorites"
      );
    }
  };

  const handleAddToPlaylist = () => {
    if (!currentSong) return toast.error("Play a song first");

    if (!playlistName || !artist)
      return toast.error("Please provide all details");

    addSongToPlaylist(
      null,
      currentSong._id,
      playlistName,
      artist,
      currentSong.imageUrl
    );
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* currently playing song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/album/${currentSong.albumId}`}
                  className="font-medium truncate hover:underline cursor-pointer"
                >
                  {currentSong.title}
                </Link>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls*/}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
              
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>
        {/* volume controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          {user && (
            <Button
              onClick={handleAddToFavorite}
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
            >
              <Heart
                className="h-4 w-4"
                fill={isAlreadyFavorite ? "green" : ""}
                color={isAlreadyFavorite ? "green" : "gray"}
              />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <ListMusic className="h-4 w-4" />
          </Button>

          <Dialog open={isOpen} onOpenChange={closeModal}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <ListPlus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={openModal}>
                  <PlusCircle /> Create playlist
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Plus />
                    <span>Add to playlist</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Playlist</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent
              className="sm:max-w-[425px]"
              onEscapeKeyDown={closeModal}
            >
              <DialogHeader>
                <DialogTitle>Create Playlist</DialogTitle>
                <DialogDescription>
                  Playlist will appeare on leftside
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    onChange={(e) => setPlaylistName(e.target.value)}
                    id="name"
                    placeholder="Party songs"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Artist name
                  </Label>
                  <Input
                    onChange={(e) => setArtist(e.target.value)}
                    id="username"
                    placeholder="Arijit"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddToPlaylist}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <Button
            onClick={()=>{
              if(audioRef.current){
                
                audioRef.current.volume = isMute ? volume/100 :0
                setMute(!isMute)

              }

            }}
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
            >
              {isMute ?<VolumeX className="size-4" /> :volume <= 20 ? (
                
                <Volume className="h-4 w-4"  />
                
                ):
                (volume >20 && volume <=50) ?(<Volume1 className="size-4" />): volume >50 && (<Volume2 className="size-4" />)
                }
            </Button>

            <Slider
              value={[volume]}
              
              onWheel={(event) => {
                const delta = event.deltaY; // Detect scroll direction
                setVolume((prevVolume) => {
                  // Adjust the volume and clamp between 0 and 100
                  const newVolume = Math.min(100, Math.max(0, prevVolume - delta / 20)); 
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume / 100; // Update audio volume
                  }
                  return newVolume;
                });
              }}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
