"use client";
import React, { useMemo, useEffect, useState, forwardRef, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
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
  Minus,
  Plus,
} from "lucide-react";

const FontSizeExtension = TextStyle.extend({
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

const FONT_SIZES = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "30px",
  "32px",
  "36px",
  "40px",
  "48px",
];

// Custom Image extension with resize functionality
const ResizableImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute("width") || null,
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute("height") || null,
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

// Resizable Image Component with drag handles
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResizableImageComponent = ({ node, updateAttributes }: any) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startSize = useRef({ width: 0, height: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const aspectRatio = useRef(1);

  useEffect(() => {
    if (imageRef.current && !node.attrs.width) {
      const img = imageRef.current;
      if (img.complete) {
        aspectRatio.current = img.naturalWidth / img.naturalHeight;
      } else {
        img.onload = () => {
          aspectRatio.current = img.naturalWidth / img.naturalHeight;
        };
      }
    }
  }, [node.attrs.src]);
  // Handle clicks outside the image to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !isResizing
      ) {
        setIsSelected(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSelected) {
        setIsSelected(false);
      }
    };

    if (isSelected) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, isResizing]);
  const handleMouseDown = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const img = imageRef.current;
    if (!img) return;

    const currentWidth = node.attrs.width || img.offsetWidth;
    const currentHeight = node.attrs.height || img.offsetHeight;

    startSize.current = { width: currentWidth, height: currentHeight };
    startPos.current = { x: e.clientX, y: e.clientY };

    if (!node.attrs.width) {
      aspectRatio.current = currentWidth / currentHeight;
    } else {
      aspectRatio.current = currentWidth / currentHeight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      if (
        corner === "se" ||
        corner === "sw" ||
        corner === "ne" ||
        corner === "nw"
      ) {
        if (corner === "se") {
          newWidth = startSize.current.width + deltaX;
        } else if (corner === "sw") {
          newWidth = startSize.current.width - deltaX;
        } else if (corner === "ne") {
          newWidth = startSize.current.width + deltaX;
        } else if (corner === "nw") {
          newWidth = startSize.current.width - deltaX;
        }

        newHeight = newWidth / aspectRatio.current;
      } else if (corner === "e" || corner === "w") {
        if (corner === "e") {
          newWidth = startSize.current.width + deltaX;
        } else {
          newWidth = startSize.current.width - deltaX;
        }
        newHeight = newWidth / aspectRatio.current;
      }

      if (newWidth > 50 && newHeight > 50) {
        updateAttributes({
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <NodeViewWrapper
      as="div"
      className="group relative my-2 inline-block"
      ref={containerRef}
      onClick={() => setIsSelected(true)}
      onBlur={() => setIsSelected(false)}
    >
      <img
        ref={imageRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        width={node.attrs.width || undefined}
        height={node.attrs.height || undefined}
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : undefined,
          height: node.attrs.height ? `${node.attrs.height}px` : undefined,
          maxWidth: "100%",
          cursor: isResizing ? "nwse-resize" : "pointer",
        }}
        className={`rounded-lg ${isSelected || isResizing ? "ring-2 ring-blue-500" : "ring-1 ring-gray-200"}`}
        draggable={false}
      />

      {(isSelected || isResizing) && (
        <>
          <div
            className="absolute -top-1 -left-1 h-3 w-3 cursor-nw-resize rounded-full border-2 border-blue-500 bg-white"
            onMouseDown={e => handleMouseDown(e, "nw")}
          />
          <div
            className="absolute -top-1 -right-1 h-3 w-3 cursor-ne-resize rounded-full border-2 border-blue-500 bg-white"
            onMouseDown={e => handleMouseDown(e, "ne")}
          />
          <div
            className="absolute -bottom-1 -left-1 h-3 w-3 cursor-sw-resize rounded-full border-2 border-blue-500 bg-white"
            onMouseDown={e => handleMouseDown(e, "sw")}
          />
          <div
            className="absolute -right-1 -bottom-1 h-3 w-3 cursor-se-resize rounded-full border-2 border-blue-500 bg-white"
            onMouseDown={e => handleMouseDown(e, "se")}
          />
          <div
            className="absolute top-1/2 -right-1 h-6 w-3 -translate-y-1/2 cursor-e-resize rounded-full border-2 border-blue-500 bg-white"
            onMouseDown={e => handleMouseDown(e, "e")}
          />
          <div
            className="absolute top-1/2 -left-1 h-6 w-3 -translate-y-1/2 cursor-w-resize rounded-full border-2 border-blue-500 bg-white"
            onMouseDown={e => handleMouseDown(e, "w")}
          />
        </>
      )}
    </NodeViewWrapper>
  );
};

export const TOOLBAR_CONFIGS = {
  basic: [
    "heading",
    "bold",
    "italic",
    "underline",
    "bulletList",
    "orderedList",
    "fontSize",
    "color",
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
    "fontSize",
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
    "fontSize",
  ],
  minimal: [
    "bold",
    "italic",
    "underline",
    "bulletList",
    "orderedList",
    "link",
    "fontSize",
    "color",
  ],
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
  onImageUpload?: (file: File) => Promise<string>;
  maxImageSize?: number;
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
    const [customFontSize, setCustomFontSize] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initialValueSet = useRef(false);

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
        FontSizeExtension,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-500 underline",
          },
        }),
        ResizableImageExtension.configure({
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
          style: "list-style-position: inside;",
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

    // Only set initial value once when editor is created
    useEffect(() => {
      if (editor && !initialValueSet.current && value) {
        editor.commands.setContent(value);
        initialValueSet.current = true;
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

    const applyFontSize = (size?: string) => {
      if (!editor) return;
      const currentAttrs = editor.getAttributes("textStyle") ?? {};
      const nextAttrs = { ...currentAttrs };

      if (size) {
        nextAttrs.fontSize = size;
      } else {
        delete nextAttrs.fontSize;
      }

      Object.keys(nextAttrs).forEach(key => {
        if (
          nextAttrs[key as keyof typeof nextAttrs] === undefined ||
          nextAttrs[key as keyof typeof nextAttrs] === null
        ) {
          delete nextAttrs[key as keyof typeof nextAttrs];
        }
      });

      if (Object.keys(nextAttrs).length > 0) {
        editor.chain().focus().setMark("textStyle", nextAttrs).run();
      } else {
        editor.chain().focus().unsetMark("textStyle").run();
      }
    };

    const handleCustomFontSizeApply = () => {
      const sanitizedValue = parseFloat(customFontSize);
      if (Number.isNaN(sanitizedValue) || sanitizedValue <= 0) {
        return;
      }
      applyFontSize(`${sanitizedValue}px`);
      setCustomFontSize("");
    };

    const getCurrentFontSize = (): number => {
      if (!editor) return 16;
      const currentAttrs = editor.getAttributes("textStyle");
      const fontSize = currentAttrs?.fontSize;
      if (!fontSize) return 16;
      const size = parseFloat(fontSize);
      return Number.isNaN(size) ? 16 : size;
    };

    const incrementFontSize = () => {
      const currentSize = getCurrentFontSize();
      const newSize = Math.min(currentSize + 2, 96);
      applyFontSize(`${newSize}px`);
    };

    const decrementFontSize = () => {
      const currentSize = getCurrentFontSize();
      const newSize = Math.max(currentSize - 2, 8);
      applyFontSize(`${newSize}px`);
    };

    const handleImageUpload = async (file: File) => {
      setImageUploadError(null);

      if (!acceptedImageTypes.includes(file.type)) {
        setImageUploadError(
          `Invalid file type. Please upload: ${acceptedImageTypes.join(", ")}`
        );
        return;
      }

      if (file.size > maxImageSize * 1024 * 1024) {
        setImageUploadError(`File size must be less than ${maxImageSize}MB`);
        return;
      }

      setIsImageUploading(true);

      try {
        let imageUrl: string;

        if (onImageUpload) {
          imageUrl = await onImageUpload(file);
        } else {
          imageUrl = await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        }

        // Insert image at current cursor position
        editor?.chain().focus().setImage({ src: imageUrl }).run();

        // Reset file input so the same file can be uploaded again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
      const currentFontSizeAttr =
        editor?.getAttributes("textStyle")?.fontSize || null;
      const currentFontSizeValue = currentFontSizeAttr || "16px";
      const isCustomFontSize =
        !!currentFontSizeAttr && !FONT_SIZES.includes(currentFontSizeAttr);

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

          {toolbarItems.includes("fontSize") && (
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={decrementFontSize}
                title="Decrease Font Size"
              >
                <Minus className="h-4 w-4" />
              </ToolbarButton>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-16 border-gray-300 text-xs font-medium"
                    title="Font Size"
                  >
                    {currentFontSizeAttr
                      ? parseInt(currentFontSizeAttr).toString()
                      : "16"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-2">
                  <div className="space-y-1">
                    {FONT_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          applyFontSize(size);
                        }}
                        className={`w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 ${
                          currentFontSizeValue === size
                            ? "bg-gray-200 font-semibold"
                            : ""
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                    {isCustomFontSize && currentFontSizeAttr && (
                      <button
                        onClick={() => {
                          applyFontSize(currentFontSizeAttr);
                        }}
                        className={`w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 ${
                          currentFontSizeValue === currentFontSizeAttr
                            ? "bg-gray-200 font-semibold"
                            : ""
                        }`}
                      >
                        {currentFontSizeAttr}
                      </button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <ToolbarButton
                onClick={incrementFontSize}
                title="Increase Font Size"
              >
                <Plus className="h-4 w-4" />
              </ToolbarButton>
            </div>
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
                        ref={fileInputRef}
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

    return (
      <div
        className={`border-input flex flex-col overflow-hidden rounded-md border bg-white ${className}`}
        style={{
          minHeight,
          height,
          ...style,
        }}
      >
        {renderToolbar()}
        <div className="relative flex-1 overflow-y-auto">
          <EditorContent
            editor={editor}
            className="h-full p-3 focus-within:outline-none"
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
