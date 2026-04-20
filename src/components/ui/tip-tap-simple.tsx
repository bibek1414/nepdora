"use client";
import React, { useMemo, useEffect, useState, forwardRef, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

export interface TipTapSimpleProps {
  value?: string | null | undefined;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string | number;
  readOnly?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface TipTapSimpleRef {
  editor: Editor | null;
  focus: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
}

const TipTapSimple = forwardRef<TipTapSimpleRef, TipTapSimpleProps>(
  (
    {
      value,
      onChange,
      placeholder = "Start writing...",
      minHeight = "120px",
      readOnly = false,
      className = "",
      disabled = false,
    },
    ref
  ) => {
    const [isClient, setIsClient] = useState(false);
    const initialValueSet = useRef(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const extensions = useMemo(
      () => [
        StarterKit.configure({
          heading: false,
          codeBlock: false,
          blockquote: false,
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-500 underline",
          },
        }),
      ],
      []
    );

    const editor = useEditor({
      extensions,
      content: value || "",
      editable: !readOnly && !disabled,
      editorProps: {
        attributes: {
          class: "tiptap focus:outline-none p-4",
          style: `min-height: ${minHeight}`,
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

    React.useImperativeHandle(
      ref,
      () => ({
        editor,
        focus: () => editor?.commands.focus(),
        getContent: () => editor?.getHTML() || "",
        setContent: (content: string) => editor?.commands.setContent(content),
      }),
      [editor]
    );

    useEffect(() => {
      if (editor && !initialValueSet.current && value !== undefined) {
        editor.commands.setContent(value || "");
        initialValueSet.current = true;
      }
    }, [value, editor]);

    if (!isClient) return null;

    const ToolbarButton = ({
      onClick,
      isActive = false,
      disabled = false,
      children,
      title,
    }: {
      onClick: () => void;
      isActive?: boolean;
      disabled?: boolean;
      children: React.ReactNode;
      title: string;
    }) => (
      <Button
        type="button"
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`h-8 w-8 p-0 ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"}`}
      >
        {children}
      </Button>
    );

    return (
      <div className={`flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white ${className}`}>
        {!readOnly && editor && (
          <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50/50 p-1.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
            
            <div className="w-px h-4 bg-slate-200 mx-1 self-center" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            
            <div className="w-px h-4 bg-slate-200 mx-1 self-center" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {
                const url = window.prompt("Enter URL");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              isActive={editor.isActive("link")}
              title="Link"
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
          </div>
        )}
        <EditorContent editor={editor} className="outline-none" />
      </div>
    );
  }
);

TipTapSimple.displayName = "TipTapSimple";

export default TipTapSimple;
