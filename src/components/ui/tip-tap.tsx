"use client";
import React, { useMemo, useEffect, useState, forwardRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Palette,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Undo,
  Redo,
  Loader2,
} from "lucide-react";

// Predefined toolbar configurations
export const TOOLBAR_CONFIGS = {
  basic: [
    "heading",
    "bold",
    "italic",
    "underline",
    "bulletList",
    "orderedList",
  ],
  standard: [
    "heading",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "bulletList",
    "orderedList",
    "textAlign",
    "link",
    "image",
  ],
  advanced: [
    "heading",
    "bold",
    "italic",
    "underline",
    "strike",
    "subscript",
    "superscript",
    "color",
    "bulletList",
    "orderedList",
    "textAlign",
    "link",
    "image",
    "blockquote",
    "codeBlock",
    "undo",
    "redo",
  ],
  minimal: ["bold", "italic", "underline", "bulletList", "orderedList", "link"],
};

export interface ReusableQuillProps {
  value?: string | null | undefined;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string | number;
  minHeight?: string | number;
  toolbar?: keyof typeof TOOLBAR_CONFIGS | "none";
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
  // Image upload handler - optional, if not provided, only URL input will be available
  onImageUpload?: (file: File) => Promise<string>;
  // Max file size in MB (default: 5MB)
  maxImageSize?: number;
  // Accepted image types (default: common image formats)
  acceptedImageTypes?: string[];
}

export interface ReusableQuillRef {
  editor: Editor | null;
  focus: () => void;
  blur: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
}

const ReusableQuill = forwardRef<ReusableQuillRef, ReusableQuillProps>(
  (
    {
      value,
      onChange,
      placeholder = "Start writing...",
      height,
      minHeight = "120px",
      toolbar = "standard",
      readOnly = false,
      className = "",
      style = {},
      onBlur,
      disabled = false,
      onImageUpload,
      maxImageSize = 5,
      acceptedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
    },
    ref
  ) => {
    const [isClient, setIsClient] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isLinkOpen, setIsLinkOpen] = useState(false);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState<string | null>(
      null
    );

    useEffect(() => {
      setIsClient(true);
    }, []);

    const extensions = useMemo(
      () => [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        Underline,
        Strike,
        Subscript,
        Superscript,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-500 underline",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "max-w-full h-auto rounded-lg",
          },
        }),
      ],
      []
    );

    const editor = useEditor({
      extensions,
      content: value || "",
      editable: !readOnly && !disabled,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      onBlur: () => {
        onBlur?.();
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
          style: `min-height: ${typeof minHeight === "string" ? minHeight : `${minHeight}px`}; ${height ? `height: ${typeof height === "string" ? height : `${height}px`};` : ""}`,
        },
      },
    });

    React.useImperativeHandle(
      ref,
      () => ({
        editor,
        focus: () => editor?.commands.focus(),
        blur: () => editor?.commands.blur(),
        getContent: () => editor?.getHTML() || "",
        setContent: (content: string) => editor?.commands.setContent(content),
      }),
      [editor]
    );

    useEffect(() => {
      if (editor && (value || "") !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    }, [value, editor]);

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
        className="h-8 w-8 p-0"
      >
        {children}
      </Button>
    );

    const addLink = () => {
      if (linkUrl) {
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl })
          .run();
        setLinkUrl("");
        setIsLinkOpen(false);
      }
    };

    const addImageFromUrl = () => {
      if (imageUrl) {
        editor?.chain().focus().setImage({ src: imageUrl }).run();
        setImageUrl("");
        setIsImageOpen(false);
      }
    };

    const handleImageUpload = async (file: File) => {
      setImageUploadError(null);

      // Validate file type
      if (!acceptedImageTypes.includes(file.type)) {
        setImageUploadError(
          `Invalid file type. Please upload: ${acceptedImageTypes.join(", ")}`
        );
        return;
      }

      // Validate file size
      if (file.size > maxImageSize * 1024 * 1024) {
        setImageUploadError(`File size must be less than ${maxImageSize}MB`);
        return;
      }

      setIsImageUploading(true);

      try {
        let imageUrl: string;

        if (onImageUpload) {
          // Use custom upload handler
          imageUrl = await onImageUpload(file);
        } else {
          // Convert to base64 as fallback
          imageUrl = await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        }

        editor?.chain().focus().setImage({ src: imageUrl }).run();
        setIsImageOpen(false);
      } catch (error) {
        setImageUploadError(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      } finally {
        setIsImageUploading(false);
      }
    };

    const renderToolbar = () => {
      if (!editor || toolbar === "none") return null;

      const toolbarItems = TOOLBAR_CONFIGS[toolbar];

      return (
        <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
          {toolbarItems.includes("undo") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("redo") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          )}

          {toolbarItems.includes("heading") && (
            <>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                isActive={editor.isActive("heading", { level: 1 })}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                isActive={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
            </>
          )}

          {toolbarItems.includes("bold") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("italic") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("underline") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("strike") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("subscript") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              isActive={editor.isActive("subscript")}
              title="Subscript"
            >
              <SubscriptIcon className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("superscript") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              isActive={editor.isActive("superscript")}
              title="Superscript"
            >
              <SuperscriptIcon className="h-4 w-4" />
            </ToolbarButton>
          )}

          {toolbarItems.includes("color") && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Text Color"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid grid-cols-6 gap-1">
                  {[
                    "#000000",
                    "#FF0000",
                    "#00FF00",
                    "#0000FF",
                    "#FFFF00",
                    "#FF00FF",
                    "#00FFFF",
                    "#FFA500",
                    "#800080",
                    "#008000",
                    "#000080",
                    "#808080",
                  ].map(color => (
                    <button
                      key={color}
                      className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        editor.chain().focus().setColor(color).run()
                      }
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {toolbarItems.includes("bulletList") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("orderedList") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
          )}

          {toolbarItems.includes("textAlign") && (
            <>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                isActive={editor.isActive({ textAlign: "left" })}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                isActive={editor.isActive({ textAlign: "center" })}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                isActive={editor.isActive({ textAlign: "right" })}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                isActive={editor.isActive({ textAlign: "justify" })}
                title="Justify"
              >
                <AlignJustify className="h-4 w-4" />
              </ToolbarButton>
            </>
          )}

          {toolbarItems.includes("link") && (
            <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={editor.isActive("link") ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter URL"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        addLink();
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addLink}>
                      Add Link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setIsLinkOpen(false);
                      }}
                    >
                      Remove Link
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {toolbarItems.includes("image") && (
            <Popover open={isImageOpen} onOpenChange={setIsImageOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Upload an image file (max {maxImageSize}MB)
                    </div>

                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400">
                      <input
                        type="file"
                        accept={acceptedImageTypes.join(",")}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={isImageUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex cursor-pointer flex-col items-center gap-2 ${isImageUploading ? "opacity-50" : ""}`}
                      >
                        {isImageUploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">
                          {isImageUploading
                            ? "Uploading..."
                            : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {acceptedImageTypes
                            .map(type => type.split("/")[1])
                            .join(", ")}
                        </span>
                      </label>
                    </div>

                    {imageUploadError && (
                      <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                        {imageUploadError}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="url" className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Enter the URL of an image
                    </div>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          addImageFromUrl();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={addImageFromUrl}
                      disabled={!imageUrl}
                    >
                      Add Image
                    </Button>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          )}

          {toolbarItems.includes("blockquote") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          )}
          {toolbarItems.includes("codeBlock") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          )}
        </div>
      );
    };

    if (!isClient) {
      return (
        <div className="h-32 animate-pulse rounded-md border bg-gray-50" />
      );
    }

    const combinedStyle = {
      minHeight,
      height,
      ...style,
    };

    return (
      <div
        className={`border-input overflow-hidden rounded-md border bg-white ${className}`}
        style={combinedStyle}
      >
        {renderToolbar()}
        <div className="relative">
          <EditorContent
            editor={editor}
            className="p-3 focus-within:outline-none"
            style={{
              minHeight:
                typeof minHeight === "string" ? minHeight : `${minHeight}px`,
            }}
          />
          {editor && editor.isEmpty && (
            <div className="pointer-events-none absolute top-3 left-3 text-gray-400">
              {placeholder}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReusableQuill.displayName = "ReusableQuill";

export default ReusableQuill;
