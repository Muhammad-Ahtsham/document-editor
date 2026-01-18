import type { CreateDocContentResponse } from "@/types/types";
import { useUpdateMyPresence } from "@liveblocks/react";
import {
  FloatingComposer,
  FloatingToolbar,
  Toolbar,
  useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import { OrderedList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Heading1, HighlighterIcon } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
interface HeaderProps {
  documentContent: CreateDocContentResponse;
  setDocContent: Dispatch<SetStateAction<string | null>>;
  setText: Dispatch<SetStateAction<string>>;
}

const DocEditor = ({
  documentContent,
  setDocContent,
  setText,
}: HeaderProps) => {
  const liveblocks = useLiveblocksExtension({
    initialContent: documentContent?.docContent?.content || "",
  });

  const updateMyPresence = useUpdateMyPresence();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorReadyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const extensions = useMemo(() => {
    return [
      liveblocks,
      StarterKit.configure({
        undoRedo: false,
        orderedList: false,
        heading: false,
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      Heading.configure({
        levels: [1],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
    ];
  }, [liveblocks]);

  const editorConfig = useMemo(
    () => ({
      extensions,
      editorProps: {
        attributes: {
          class:
            "min-h-[400px] border rounded-md p-4 bg-white focus:outline-none",
        },
      },
      onUpdate: ({ editor }: { editor: Editor }) => {
        const currentContent = editor.getHTML();
        setText(currentContent);
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
          if (currentContent !== lastSavedContentRef.current) {
            setDocContent(currentContent);
            lastSavedContentRef.current = currentContent;
          }
        }, 1000);
      },
    }),
    [extensions, setDocContent],
  );

  const editor = useEditor(editorConfig);

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      setIsEditorReady(false);
      return;
    }

    const checkEditorReady = () => {
      if (editor.view && editor.view.dom) {
        return true;
      }
      return false;
    };

    if (checkEditorReady()) {
      editorReadyTimeoutRef.current = setTimeout(() => {
        setIsEditorReady(true);
      }, 200);
    } else {
      const intervalId = setInterval(() => {
        if (checkEditorReady()) {
          clearInterval(intervalId);
          editorReadyTimeoutRef.current = setTimeout(() => {
            setIsEditorReady(true);
          }, 200);
        }
      }, 50);

      return () => {
        clearInterval(intervalId);
        if (editorReadyTimeoutRef.current) {
          clearTimeout(editorReadyTimeoutRef.current);
        }
      };
    }

    return () => {
      if (editorReadyTimeoutRef.current) {
        clearTimeout(editorReadyTimeoutRef.current);
      }
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !isEditorReady) return;

    const handleBlur = () => {
      const currentContent = editor.getHTML();
      if (currentContent !== lastSavedContentRef.current) {
        setDocContent(currentContent);
        lastSavedContentRef.current = currentContent;
      }
    };

    editor.on("blur", handleBlur);

    return () => {
      editor.off("blur", handleBlur);
    };
  }, [editor, setDocContent, isEditorReady]);

  useEffect(() => {
    if (documentContent?.docContent?.content) {
      lastSavedContentRef.current = documentContent.docContent.content;
      if (editor && !editor.isDestroyed && isEditorReady) {
        editor.commands.setContent(documentContent.docContent.content);
      }
    }
  }, [documentContent?.docContent?.content, editor, isEditorReady]);

  useEffect(() => {
    if (!editor || editor.isDestroyed || !isEditorReady) return;

    const handleSelectionUpdate = () => {
      updateMyPresence({});
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, updateMyPresence, isEditorReady]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (editorReadyTimeoutRef.current) {
        clearTimeout(editorReadyTimeoutRef.current);
      }
    };
  }, []);

  const safeToggleHeading = useCallback(() => {
    if (editor && !editor.isDestroyed && editor.view && isEditorReady) {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    }
  }, [editor, isEditorReady]);

  const safeToggleHighlight = useCallback(() => {
    if (editor && !editor.isDestroyed && editor.view && isEditorReady) {
      editor.chain().focus().toggleHighlight().run();
    }
  }, [editor, isEditorReady]);

  const toolbar = useMemo(() => {
    if (!editor || editor.isDestroyed || !editor.view || !isEditorReady)
      return null;

    return (
      <Toolbar
        className="w-30"
        style={{
          width: "30rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          borderRadius: "0.3rem",
          boxShadow: "solid black 10px",
          padding: "0.5rem",
        }}
        editor={editor}
      >
        <Toolbar.SectionHistory />
        <Toolbar.Toggle
          name="H1"
          icon={<Heading1 />}
          active={editor.isActive("heading", { level: 1 })}
          onClick={safeToggleHeading}
        />
        <Toolbar.Toggle
          name="Highlight"
          icon={<HighlighterIcon />}
          active={editor.isActive("highlight")}
          onClick={safeToggleHighlight}
        />
        <Toolbar.SectionInline />
      </Toolbar>
    );
  }, [editor, isEditorReady, safeToggleHeading, safeToggleHighlight]);

  return (
    <>
      <div className="flex flex-col  items-center">
        <div className="fixed z-10">{toolbar}</div>
        <div className="mt-20 contents self-center w-full max-w-4xl">
          <EditorContent editor={editor} className="" />
          <FloatingComposer editor={editor} style={{ width: "350px" }} />
          <FloatingToolbar editor={editor}>
            <Toolbar.BlockSelector />
            <Toolbar.SectionHistory />
            <Toolbar.SectionInline />
            <Toolbar.Separator />
            <Toolbar.SectionCollaboration />
          </FloatingToolbar>
        </div>
      </div>
    </>
  );
};

export default React.memo(DocEditor);
