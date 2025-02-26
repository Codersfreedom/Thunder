import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import { PlaybackControls } from "./components/PlaybackControls";
import AudioPlayer from "./components/AudioPlayer";
import { useState } from "react";

const MainLayout = () => {
  const [isMobile] = useState(window.innerWidth < 768);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2"
      >
        <AudioPlayer />
        {/* Leftsidebar */}
        <ResizablePanel
          defaultSize={isMobile ? 0 : 15}
          minSize={isMobile ? 0 : 10}
          maxSize={20}
        >
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
        </ResizablePanel>
        {/* Right side */}

        <ResizableHandle
          withHandle
          className="w-2 bg-black rounded-lg transition-colors"
        />
        <ResizablePanel
          defaultSize={isMobile ? 0 : 18}
          minSize={0}
          maxSize={isMobile ? 25 : 18}
          collapsedSize={0}
        >
          <RightSidebar />
        </ResizablePanel>
      </ResizablePanelGroup>
      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
