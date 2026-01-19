import { AuthContext } from "@/components/Auth";
import {
  useExportDocumentMutation,
  useGetDocContentQuery,
  useUpdateDocContentMutation,
} from "@/store/api/docContentApi";
import {
  useGetDocumentQuery,
  useUpdateIsPrivateMutation,
} from "@/store/api/documentApi";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider
} from "@liveblocks/react";

import Header from "@/components/Header";
import Threads from "@/components/Threads";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocEditor from "../components/DocEditor";

const Document = () => {
  const { id } = useParams();
  const { data: documentinfo, isLoading: isLoadingDocument } =
    useGetDocumentQuery(id!);
  const { data: documentContent, isLoading: isLoadingContent } =
    useGetDocContentQuery({ documentId: id! });
  const [docContent, setDocContent] = useState<string | null>(null);
  const [Text, setText] = useState<string>("");
  const [updateDocContent, { isLoading: isUpdating }] =
    useUpdateDocContentMutation();
  const [updateIsPrivate, { isLoading: isUpdatingPrivate }] =
    useUpdateIsPrivateMutation();
  const [exportDocument] = useExportDocumentMutation();
  const navigate = useNavigate();
  const getUser = useContext(AuthContext);


  useEffect(() => {
    if (documentContent?.docContent?.content && docContent === null) {
      setDocContent(documentContent.docContent.content);
    }
  }, [documentContent, docContent]);

  useEffect(() => {
    if (
      !docContent ||
      !id ||
      docContent === documentContent?.docContent?.content
    )
      return;

    const saveTimeout = setTimeout(() => {
      updateDocContent({ documentId: id, content: docContent })
        .unwrap()
        .catch((error) => {
          console.error("Failed to save content:", error);
        });
    }, 1500);

    return () => clearTimeout(saveTimeout);
  }, [docContent, id, updateDocContent, documentContent]);

  useEffect(() => {
    if (!documentinfo?.document || !getUser) return;
    const loadDocumentInfo = async () => {
      const isMember = await documentinfo?.document?.member
        .map((user) => user._id)
        .includes(getUser.id);
      const isOwner = (await documentinfo?.document?.ownerId) === getUser.id;

      if (
        (!isMember && !isOwner) ||
        (documentinfo?.document?.isPrivate && !isOwner)
      ) {
        navigate("/");
      }
    };
    loadDocumentInfo();
  }, [documentinfo, getUser, navigate]);

  const handleDocContentSave = useCallback(async () => {
    if (!docContent || !id) return;
    try {
      const title = documentinfo?.document.name as string;
      const response = await exportDocument({ html: Text, title }).unwrap();
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.docx`;
      a.click();
    } catch (error) {
      console.error(error);
    }
  }, [docContent, id, updateDocContent]);

  const handleIsPrivate = useCallback(
    async (value: boolean, setIsPrivate: Dispatch<SetStateAction<boolean>>) => {
      if (!document || !getUser || !id) return;

      const isMember = documentinfo?.document?.member
        ?.map((user) => user._id)
        .includes(getUser.id);
      const isOwner = documentinfo?.document?.ownerId === getUser.id;

      if (!isMember && !isOwner) return;

      setIsPrivate(value);
      try {
        await updateIsPrivate({ id: id }).unwrap();
      } catch (error) {
        console.error("Failed to update privacy:", error);
        setIsPrivate(!value);
      }
    },
    [documentinfo, getUser, id, updateIsPrivate],
  );
  const initialIsPrivate = useMemo(() => {
    return documentinfo?.document?.isPrivate || false;
  }, [documentinfo?.document?.isPrivate]);

  if (isLoadingContent || isLoadingDocument) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!documentContent || !documentinfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Document not found or access denied</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center overflow-x-hidden ">
      {(isUpdating || isUpdatingPrivate) && (
        <div className="fixed z-50 top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow">
          Saving...
        </div>
      )}
      <LiveblocksProvider
        authEndpoint="/api/liveblocks/liveblocks-auth"
        resolveUsers={async ({ userIds }) => {
          const searchParams = new URLSearchParams(
            userIds.map((userId) => ["userIds", userId]),
          );
          const response = await fetch(`/api/users?${searchParams}`);

          if (!response.ok) {
            throw new Error("Problem resolving users");
          }

          const users = await response.json();
          return users;
        }}
      >
        <RoomProvider
          id={id!}
          initialPresence={{
            cursor: null,
          }}
        >
          <ClientSideSuspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }
          >
            <div>
              {document && (
                <Header
                  handleDocContentSave={handleDocContentSave}
                  document={documentinfo}
                  initialIsPrivate={initialIsPrivate}
                  handleIsPrivate={handleIsPrivate}
                />
              )}
              <div className="flex justify-center  w-full gap-[4rem]">
                <DocEditor
                  documentContent={documentContent}
                  setDocContent={setDocContent}
                  setText={setText}
                />
              <Threads />
              </div>
            </div>
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  );
};

export default Document;
