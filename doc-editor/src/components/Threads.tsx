import { useThreads } from "@liveblocks/react";
import { Thread } from "@liveblocks/react-ui";
import { MessageSquare, Sparkles } from "lucide-react";

function Threads() {
  const { threads, isLoading } = useThreads();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[30rem] w-[20rem] border-r border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <MessageSquare className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-500 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[30rem] w-[20rem] border-r border-gray-100 bg-gradient-to-b from-white to-gray-50/50 sm:hidden lg:flex">
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <Sparkles className="w-3 h-3 text-blue-400 absolute -top-1 -right-1" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
        </div>
        {threads && threads.length > 0 && (
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {threads.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {threads && threads.length > 0 ? (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-3">
              {threads.map((thread, index) => (
                <div
                  key={thread.id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -m-2"></div>
                  <div className="relative p-4 bg-white rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all duration-300 hover:-translate-y-0.5">
                    <Thread thread={thread} />
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 p-4 bg-gradient-to-t from-white to-transparent">
              <p className="text-xs text-center text-gray-400">
                Select text to start a new conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-blue-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              Start a conversation by selecting text in the document
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Click on highlighted text to begin</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Threads;
