import { useState, useEffect } from "react";

import {
  BaseKit,
  RichTextRenderEngine,
} from "@remarkablejames/rich-text-editor";
import { locale } from "@remarkablejames/rich-text-editor/locale-bundle";

import { Attachment } from "@remarkablejames/rich-text-editor/attachment";
import { Blockquote } from "@remarkablejames/rich-text-editor/blockquote";
import { Bold } from "@remarkablejames/rich-text-editor/bold";
import { BulletList } from "@remarkablejames/rich-text-editor/bulletlist";
import { Clear } from "@remarkablejames/rich-text-editor/clear";
import { Code } from "@remarkablejames/rich-text-editor/code";
import { CodeBlock } from "@remarkablejames/rich-text-editor/codeblock";
import { Color } from "@remarkablejames/rich-text-editor/color";
import { ColumnActionButton } from "@remarkablejames/rich-text-editor/multicolumn";
import { Emoji } from "@remarkablejames/rich-text-editor/emoji";
import { FontFamily } from "@remarkablejames/rich-text-editor/fontfamily";
import { FontSize } from "@remarkablejames/rich-text-editor/fontsize";
import { FormatPainter } from "@remarkablejames/rich-text-editor/formatpainter";
import { Heading } from "@remarkablejames/rich-text-editor/heading";
import { Highlight } from "@remarkablejames/rich-text-editor/highlight";
import { History } from "@remarkablejames/rich-text-editor/history";
import { HorizontalRule } from "@remarkablejames/rich-text-editor/horizontalrule";
import { Iframe } from "@remarkablejames/rich-text-editor/iframe";
import { Image } from "@remarkablejames/rich-text-editor/image";
import { ImageGif } from "@remarkablejames/rich-text-editor/imagegif";
import { ImportWord } from "@remarkablejames/rich-text-editor/importword";
import { Indent } from "@remarkablejames/rich-text-editor/indent";
import { Italic } from "@remarkablejames/rich-text-editor/italic";
import { LineHeight } from "@remarkablejames/rich-text-editor/lineheight";
import { Link } from "@remarkablejames/rich-text-editor/link";
import { Mention } from "@remarkablejames/rich-text-editor/mention";
import { MoreMark } from "@remarkablejames/rich-text-editor/moremark";
import { OrderedList } from "@remarkablejames/rich-text-editor/orderedlist";
import { SearchAndReplace } from "@remarkablejames/rich-text-editor/searchandreplace";
import { SlashCommand } from "@remarkablejames/rich-text-editor/slashcommand";
import { Strike } from "@remarkablejames/rich-text-editor/strike";
import { Table } from "@remarkablejames/rich-text-editor/table";
import { TableOfContents } from "@remarkablejames/rich-text-editor/tableofcontent";
import { TaskList } from "@remarkablejames/rich-text-editor/tasklist";
import { TextAlign } from "@remarkablejames/rich-text-editor/textalign";
import { TextUnderline } from "@remarkablejames/rich-text-editor/textunderline";
import { Video } from "@remarkablejames/rich-text-editor/video";
import { TextDirection } from "@remarkablejames/rich-text-editor/textdirection";
import { Katex } from "@remarkablejames/rich-text-editor/katex";
import { Drawer } from "@remarkablejames/rich-text-editor/drawer";
import { Excalidraw } from "@remarkablejames/rich-text-editor/excalidraw";
import { Twitter } from "@remarkablejames/rich-text-editor/twitter";
import { Mermaid } from "@remarkablejames/rich-text-editor/mermaid";
import { PaywallSeparator } from "@remarkablejames/rich-text-editor/paywallseparator";

import "@remarkablejames/rich-text-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "@excalidraw/excalidraw/index.css";
import processPaywallContent from "@/components/paywallProcessor";

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  History,
  SearchAndReplace,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 500);
      });
    },
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 500);
      });
    },
  }),
  ImageGif.configure({
    GIPHY_API_KEY: "import.meta.env.VITE_GIPHY_API_KEY as string", // TODO: fix this later
  }),
  Blockquote,
  SlashCommand,
  PaywallSeparator,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock,
  ColumnActionButton,
  Table,
  Iframe,
  TextDirection,
  Mention,
  Attachment.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),

  Katex,
  Excalidraw,
  Mermaid.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Drawer.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Twitter,
];

function Preview() {
  const [content, setContent] = useState(null);
  const [hasContent, setHasContent] = useState(false);

  // Initialize English as default language
  useEffect(() => {
    locale.setLang("en");
  }, []);

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem(
      "rich-text-editor-preview-content"
    );
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setContent(parsedContent);
        setHasContent(true);
      } catch (error) {
        console.error("Failed to parse saved content:", error);
        setHasContent(false);
      }
    } else {
      setHasContent(false);
    }
  }, []);

  const clearSavedContent = () => {
    localStorage.removeItem("rich-text-editor-preview-content");
    setContent(null);
    setHasContent(false);
    alert("Preview content cleared!");
  };

  return (
    <div
      className=" flex flex-col w-full max-w-screen-lg my-0"
      style={{
        maxWidth: 1024,
        margin: "40px auto",
        padding: "0 24px",
      }}
    >
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div style={{ marginBottom: "10px" }}>
          <span
            style={{
              padding: "4px 8px",
              backgroundColor: hasContent ? "#10b981" : "#f59e0b",
              color: "white",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {hasContent ? "📄 Content from Editor" : "⚠️ No Content Saved"}
          </span>
        </div>
        {hasContent && (
          <button
            type="button"
            onClick={clearSavedContent}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#dc2626")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ef4444")
            }
          >
            Clear Content
          </button>
        )}
      </div>

      {hasContent && content ? (
        <RichTextRenderEngine
          content={processPaywallContent(content)}
          extensions={extensions}
          dark={false}
          minHeight="200px"
          contentClass="w-full"
        />
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#f9fafb",
            border: "2px dashed #d1d5db",
            borderRadius: "8px",
            color: "#6b7280",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
          <h2
            style={{ fontSize: "24px", marginBottom: "8px", color: "#374151" }}
          >
            No Content to Preview
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "24px" }}>
            Go to the editor and click "Save to Preview" to see your content
            here.
          </p>
          <a
            href="/"
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
              transition: "background-color 0.3s",
              fontWeight: "500",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3b82f6")
            }
          >
            ← Go to Editor
          </a>
        </div>
      )}
    </div>
  );
}

export default Preview;
