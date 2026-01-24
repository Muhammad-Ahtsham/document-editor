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
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Heading1, HighlighterIcon } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useRef,
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
    initialContent: documentContent?.docContent?.content || undefined,
  });

  const updateMyPresence = useUpdateMyPresence();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>("");

  const editor = useEditor({
    extensions: liveblocks
      ? [
          liveblocks,
          StarterKit.configure({
            undoRedo: false,
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
        ]
      : [],
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] border rounded-md p-4 bg-white focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
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
    onSelectionUpdate: () => {
      updateMyPresence({});
    },
    onBlur: ({ editor }) => {
      const currentContent = editor.getHTML();
      if (currentContent !== lastSavedContentRef.current) {
        setDocContent(currentContent);
        lastSavedContentRef.current = currentContent;
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (documentContent?.docContent?.content) {
      lastSavedContentRef.current = documentContent.docContent.content;
    }
  }, [documentContent?.docContent?.content]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const toggleHeading = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  }, [editor]);

  const toggleHighlight = useCallback(() => {
    editor?.chain().focus().toggleHighlight().run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex flex-col items-center">
        <div className="min-h-[400px] border rounded-md p-4 bg-white w-full max-w-4xl flex items-center justify-center">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="z-10">
        <Toolbar
          className="w-30"
          style={{
            width: "30rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            borderRadius: "0.3rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "0.5rem",
          }}
          editor={editor}
        >
          <Toolbar.SectionHistory />
          <Toolbar.Toggle
            name="H1"
            icon={<Heading1 />}
            active={editor.isActive("heading", { level: 1 })}
            onClick={toggleHeading}
          />
          <Toolbar.Toggle
            name="Highlight"
            icon={<HighlighterIcon />}
            active={editor.isActive("highlight")}
            onClick={toggleHighlight}
          />
          <Toolbar.SectionInline />
        </Toolbar>
      </div>

      <div className="contents self-center w-full max-w-4xl">
        <FloatingToolbar editor={editor}>
          <Toolbar.BlockSelector />
          <Toolbar.SectionHistory />
          <Toolbar.SectionInline />
          <Toolbar.Separator />
          <Toolbar.SectionCollaboration />
        </FloatingToolbar>

        <EditorContent editor={editor} style={{ marginTop: "1rem" }} />

        <FloatingComposer
          editor={editor}
          style={{ width: "350px", zIndex: 100 }}
        />
      </div>
    </div>
  );
};

export default React.memo(DocEditor);
