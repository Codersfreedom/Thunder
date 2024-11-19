import { axiosInstance } from "@/lib/axios";
import { Playlist, Room, User } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface UserStore {
  fetchJoinedRooms: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  getCurrentUser:()=>Promise<void>;
  addToFavorite:(artist:string,imageUrl:string,songId:string,playlistName:string)=>Promise<void>;
  rooms: Room[];
  currentUser:User | null;
  playlists: Playlist[];
  isLoading: boolean;
}

const useUserStore = create<UserStore>((set, get) => ({
  isLoading: true,
  rooms: [],
  playlists: [],
  currentUser:null,
  fetchJoinedRooms: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/user/getJoinedRooms");
      set({ rooms: response.data.rooms });
    } catch (error: any) {
      console.log(error.response.data.messages);
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPlaylists: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/user/getPlaylists");
      set({ playlists: response.data.playlists });
    } catch (error: any) {
      console.log(error.response.data.messages);
    } finally {
      set({ isLoading: false });
    }
  },
  getCurrentUser:async ()=>{
    set({isLoading:true});
    try {
      const response = await axiosInstance.get("/user/getCurrentUser");
      set({currentUser:response.data.user});
    } catch (error:any) {
      console.log(error.response.data.message)
    }finally{
      set({isLoading:false})
    }
  },
  addToFavorite:async(artist:string,imageUrl:string,songId:string,playListName:string)=>{
    if(!get().currentUser) return;
    try {
      const response = await axiosInstance.post("/user/addToFavorite",{
        artist,imageUrl,songId,playListName
      });

      if(response.data.status){
        set((state)=>({
          playlists:state.playlists.map((playlist)=>
          playlist.playListName ===playListName ? 
          {...playlist,
            songs:[...playlist.songs,songId]
          }:playlist
          ),
        }))
        toast.success(response.data.message);
      }
    

    } catch (error:any) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message);
    }
  }
}));

export default useUserStore;
