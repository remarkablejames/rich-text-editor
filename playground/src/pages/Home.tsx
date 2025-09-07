import { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
import { PaywallSeparator } from "@remarkablejames/rich-text-editor/paywallseparator";
import { Iframe } from "@remarkablejames/rich-text-editor/iframe";
import { Image } from "@remarkablejames/rich-text-editor/image";
import { ImageGif } from "@remarkablejames/rich-text-editor/imagegif";
import { ImportWord } from "@remarkablejames/rich-text-editor/importword";
import { Indent } from "@remarkablejames/rich-text-editor/indent";
import { Italic } from "@remarkablejames/rich-text-editor/italic";
import { LineHeight } from "@remarkablejames/rich-text-editor/lineheight";
import { Link as LinkExtension } from "@remarkablejames/rich-text-editor/link";
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
  LinkExtension,
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
  PaywallSeparator,
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

const DEFAULT = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        id: null,
        textAlign: "center",
        indent: 0,
        lineHeight: "1",
        dir: "auto",
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Rich Text Editor",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
      content: [
        {
          type: "text",
          text: "A modern WYSIWYG rich text editor based on ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://github.com/scrumpy/tiptap",
                target: "_blank",
                rel: "noopener noreferrer nofollow",
                class: "link",
              },
            },
          ],
          text: "tiptap",
        },
        {
          type: "text",
          text: " and ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://ui.shadcn.com/",
                target: "_blank",
                rel: "noopener noreferrer nofollow",
                class: "link",
              },
            },
          ],
          text: "shadcn ui",
        },
        {
          type: "text",
          text: " for Reactjs",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "center",
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: null,
        dir: "auto",
      },
      content: [
        {
          type: "image",
          attrs: {
            src: "https://picsum.photos/1920/1080.webp?t=1",
            alt: null,
            title: null,
            flipX: false,
            flipY: false,
            width: 500,
            align: "center",
            inline: false,
          },
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
    },
    {
      type: "horizontalRule",
    },
    {
      type: "heading",
      attrs: {
        id: null,
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Demo",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
      content: [
        {
          type: "text",
          text: "👉",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://reactjs-tiptap-editor.vercel.app/",
                target: "_blank",
                rel: "noopener noreferrer nofollow",
                class: "link",
              },
            },
          ],
          text: "Demo",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        id: null,
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Features",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "Use ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "link",
                      attrs: {
                        href: "https://ui.shadcn.com/",
                        target: "_blank",
                        rel: "noopener noreferrer nofollow",
                        class: "link",
                      },
                    },
                  ],
                  text: "shadcn ui",
                },
                {
                  type: "text",
                  text: " components",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "Markdown support",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "TypeScript support",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "I18n support (vi, en, zh, pt)",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "React support",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "Slash Commands",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "Multi Column",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "TailwindCss",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "Support emoji",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "Support iframe",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
                indent: 0,
                lineHeight: "1",
                dir: "auto",
              },
              content: [
                {
                  type: "text",
                  text: "Support mermaid",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        id: null,
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Installation",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        code: "pnpm install reactjs-tiptap-editor",
        language: "bash",
        lineNumbers: true,
        wordWrap: false,
        tabSize: 2,
        shouldFocus: false,
      },
      content: [
        {
          type: "text",
          marks: [
            {
              type: "code",
            },
          ],
          text: "pnpm install reactjs-tiptap-editor",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: "1",
        dir: "auto",
      },
    },
  ],
};

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function Home() {
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
          alignItems: "center",
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

        <div style={{ marginLeft: "auto" }}>
          <Link
            to="/preview"
            style={{
              padding: "8px 16px",
              backgroundColor: "#10b981",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#059669")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#10b981")
            }
          >
            Go to Preview →
          </Link>
        </div>
      </div>

      <RichTextEditor
        output="json"
        content={content}
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

      {content && (
        <textarea
          style={{
            marginTop: 20,
            height: 500,
          }}
          readOnly
          value={
            typeof content === "string" ? content : JSON.stringify(content)
          }
        />
      )}
    </div>
  );
}

export default Home;
