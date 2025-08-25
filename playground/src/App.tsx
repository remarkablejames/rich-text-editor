import { useCallback, useState, useEffect } from "react";

import RichTextEditor, { BaseKit } from "@remarkablejames/rich-text-editor";
import { locale } from "@remarkablejames/rich-text-editor/locale-bundle";

import {
  BubbleMenuTwitter,
  BubbleMenuKatex,
  BubbleMenuExcalidraw,
  BubbleMenuMermaid,
  BubbleMenuDrawer,
} from "@remarkablejames/rich-text-editor/bubble-extra";

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

import "@remarkablejames/rich-text-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "@excalidraw/excalidraw/index.css";

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
    GIPHY_API_KEY: import.meta.env.VITE_GIPHY_API_KEY as string,
  }),
  Blockquote,
  SlashCommand,
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

const DEFAULT = `<h1 dir="auto" style="text-align: center">Rich Text Editor</h1><p dir="auto">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> for Reactjs</p><p dir="auto"></p><p dir="auto" style="text-align: center"></p><p dir="auto"><div style="text-align: center;" class="image"><img height="auto" style="" src="https://picsum.photos/1920/1080.webp?t=1" flipx="false" flipy="false" width="500" align="center" inline="false"></div></p><p dir="auto"></p><div data-type="horizontalRule"><hr></div><h2 dir="auto">Demo</h2><p dir="auto">👉<a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://reactjs-tiptap-editor.vercel.app/">Demo</a></p><h2 dir="auto">Features</h2><ul><li><p dir="auto">Use <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn ui</a> components</p></li><li><p dir="auto">Markdown support</p></li><li><p dir="auto">TypeScript support</p></li><li><p dir="auto">I18n support (vi, en, zh, pt)</p></li><li><p dir="auto">React support</p></li><li><p dir="auto">Slash Commands</p></li><li><p dir="auto">Multi Column</p></li><li><p dir="auto">TailwindCss</p></li><li><p dir="auto">Support emoji</p></li><li><p dir="auto">Support iframe</p></li><li><p dir="auto">Support mermaid</p></li></ul><h2 dir="auto">Installation</h2><pre code="pnpm install reactjs-tiptap-editor" language="bash" linenumbers="true" wordwrap="false" tabsize="2" shouldfocus="false"><code>pnpm install reactjs-tiptap-editor</code></pre><p dir="auto"></p>`;

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function App() {
  const [content, setContent] = useState(DEFAULT);
  const [theme, setTheme] = useState("light");
  const [disable, setDisable] = useState(false);

  // Initialize English as default language
  useEffect(() => {
    locale.setLang("en");
  }, []);

  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value);
    }, 300),
    []
  );

  return (
    <div
      className="p-[24px] flex flex-col w-full max-w-screen-lg gap-[24px] mx-[auto] my-0"
      style={{
        maxWidth: 1024,
        margin: "40px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "100px",
          marginBottom: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <button type="button" onClick={() => setDisable(!disable)}>
          {disable ? "Editable" : "Readonly"}
        </button>
      </div>

      {/* @ts-expect-error React 19 compatibility issue - component works correctly at runtime */}
      <RichTextEditor
        output="html"
        content={content as any}
        onChangeContent={onValueChange}
        extensions={extensions}
        dark={theme === "dark"}
        disabled={disable}
        bubbleMenu={{
          render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
            return (
              <>
                {bubbleDefaultDom}

                {extensionsNames.includes("twitter") ? (
                  <BubbleMenuTwitter
                    disabled={disabled}
                    editor={editor}
                    key="twitter"
                  />
                ) : null}
                {extensionsNames.includes("katex") ? (
                  <BubbleMenuKatex
                    disabled={disabled}
                    editor={editor}
                    key="katex"
                  />
                ) : null}
                {extensionsNames.includes("excalidraw") ? (
                  <BubbleMenuExcalidraw
                    disabled={disabled}
                    editor={editor}
                    key="excalidraw"
                  />
                ) : null}
                {extensionsNames.includes("mermaid") ? (
                  <BubbleMenuMermaid
                    disabled={disabled}
                    editor={editor}
                    key="mermaid"
                  />
                ) : null}
                {extensionsNames.includes("drawer") ? (
                  <BubbleMenuDrawer
                    disabled={disabled}
                    editor={editor}
                    key="drawer"
                  />
                ) : null}
              </>
            );
          },
        }}
      />

      {typeof content === "string" && (
        <textarea
          style={{
            marginTop: 20,
            height: 500,
          }}
          readOnly
          value={content}
        />
      )}
    </div>
  );
}

export default App;
