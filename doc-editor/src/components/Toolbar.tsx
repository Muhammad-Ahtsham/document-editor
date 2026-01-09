import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline
} from "lucide-react";

type ToolbarButton = {
  name: string;
  command: (editor: Editor) => void;
  icon?: React.ReactNode;
  active?: (editor: Editor) => boolean;
};

export const buttons: ToolbarButton[] = [
  {
    name: "Bold",
    command: (editor) => editor.chain().focus().toggleBold().run(),
    icon: <Bold size={16} />,
    active: (editor) => editor.isActive("bold"),
  },
  {
    name: "Italic",
    command: (editor) => editor.chain().focus().toggleItalic().run(),
    icon: <Italic size={16} />,
    active: (editor) => editor.isActive("italic"),
  },
  {
    name: "Underline",
    command: (editor) => editor.chain().focus().toggleUnderline().run(),
    icon: <Underline size={16} />,
    active: (editor) => editor.isActive("underline"),
  },

  {
    name: "Strike",
    command: (editor) => editor.chain().focus().toggleStrike().run(),
    icon: <Strikethrough size={16} />,
    active: (editor) => editor.isActive("strike"),
  },
  {
    name: "Highlight",
    command: (editor) => editor.chain().focus().toggleHighlight().run(),
    icon: <Highlighter size={16} />,
    active: (editor) => editor.isActive("highlight"),
  },
  {
    name: "Bullet List",
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
    icon: <List size={16} />,
    active: (editor) => editor.isActive("bulletList"),
  },
  {
    name: "Ordered List",
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    icon: <ListOrdered size={16} />,
    active: (editor) => editor.isActive("orderedList"),
  },
  {
    name: "Blockquote",
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    icon: <Quote size={16} />,
    active: (editor) => editor.isActive("blockquote"),
  },
  {

    name:"Heading",
    command:(editor)=>editor.chain().focus().toggleHeading({ level:3 }).run(),
    icon:<Heading/>,
  },
  {
    name: "Code",
    command: (editor) => editor.chain().focus().toggleCode().run(),
    icon: <Code size={16} />,
    active: (editor) => editor.isActive("code"),
  },
];
