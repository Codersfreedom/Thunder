import Header from "@/components/Header";
import Chatheader from "./components/Chatheader";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./components/MessageInput";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import useSocketStore from "@/store/useSocketStore";
import useRoomStore from "@/store/useRoomStore";
import usePlayerStore from "@/store/usePlayerStore";
import { Bird, Loader } from "lucide-react";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const RoomPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { joinRoom, isJoined, updateTime, isPlayingSong } = useSocketStore();
  const { currentSong } = usePlayerStore();
  const { currentUser } = useUserStore();

  const { roomId } = useParams<string>();
  const { getRoomById, currentRoom, fetchingRoom } = useRoomStore();
  const audio = document.querySelector("audio");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // fetch current roomByID
  useEffect(() => {
    if (roomId) {
      getRoomById(roomId);
    }
  }, [roomId]);

  // Socket Logics

  useEffect(() => {
    if (currentUser && roomId && !isJoined) {
      joinRoom(currentUser._id, roomId);
    }
  }, [currentUser, roomId, joinRoom, isJoined]);

  // send socket event for updateTime
  useEffect(() => {
    let intervalId: any;
    if (isPlayingSong && currentUser && currentUser.role === "admin") {
      intervalId = setInterval(() => {
        updateTime(roomId, currentSong._id, audio?.currentTime);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlayingSong, currentUser, currentSong]);

  if (fetchingRoom)
    return (
      <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
        <Header />
        <div className="flex justify-center items-center  h-[calc(100vh-130px)]">
          <Loader className="size-6 text-emerald-500 animate-spin" />
        </div>
      </main>
    );

  if (!currentRoom && !fetchingRoom)
    return (
      <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
        <Header />
        <div className="grid justify-center items-center w-full text-center  grid-cols-[1fr] h-[calc(100vh-130px)]">
          <div className="flex flex-col items-center justify-center">
            <Bird className="size-10" />
            <p className="text-xl">Opps! Room not found</p>
          </div>
        </div>
      </main>
    );

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Header />
      <div className="grid  grid-cols-[1fr] h-[calc(100vh-130px)]">
        {/* chat message */}
        <div className=" flex flex-col h-full">
          <Chatheader roomId={roomId} userId={currentUser?._id} />
          <ResizablePanelGroup
            direction="vertical"
            className=" flex flex-col h-full"
          >
            <ResizablePanel
              defaultSize={isMobile ? 27 : 20}
              maxSize={isMobile ? 27 : 20}
              className="relative h-full"
            >
              <CurrentlyPlaying isMobile={isMobile} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Messages */}
            <ResizablePanel>
              <ScrollArea className="h-[calc(100vh-360px)] pb-16    ">
                <div className="p-4  space-y-4  py-5   ">
                  {currentRoom && currentRoom?.messages?.length > 0 ? (
                    currentRoom.messages.map((message: any, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 z-20 ${
                          message.senderId === currentUser?._id
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              message.senderId === currentUser?._id
                                ? currentUser?.image
                                : message.senderId?.imageUrl
                            }
                          />
                        </Avatar>

                        <div
                          className={`rounded-lg p-3 max-w-[70%] 
													${message.senderId === currentUser?._id ? "bg-green-500" : "bg-zinc-800"}
												`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-zinc-300 mt-1 block">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoConversationPlaceholder />
                  )}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <MessageInput />
          </ResizablePanelGroup>
        </div>
      </div>
    </main>
  );
};

export default RoomPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 mt-10 ">
    <img
      src="/headphones.png"
      alt="Thunder"
      className="size-16 animate-bounce"
    />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No Conversation till now
      </h3>
      <p className="text-zinc-500 text-sm">Start chatting with room members</p>
    </div>
  </div>
);
