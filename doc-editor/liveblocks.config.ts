import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const client = createClient({
  authEndpoint: async (room) => {
    const response = await fetch("/api/liveblocks/liveblocks-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room }),
    });

    return await response.json();
  },
});

// Define Liveblocks types for your application
declare global {
  interface Liveblocks {
    // Each user's Presence
    Presence: {
      cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room
    Storage: {
      // Add shared state here
    };

    // Custom user info
    // FIX: Using optional types (?) here often resolves the "OpaqueClient" 
    // compatibility error with the base Liveblocks IUserInfo interface.
    UserMeta: {
      id: string;
      info: {
        name?: string;
        email?: string;
        avatar?: string;
        color?: string;
      };
    };

    RoomEvent: {};
    ThreadMetadata: {};
    RoomInfo: {};
  }
}

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useSelf,
    useMutation,
    useStorage,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMyPresence,
    useUpdateMyPresence,
  },
} = createRoomContext(client);