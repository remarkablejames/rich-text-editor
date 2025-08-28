import { useCallback, useState, useEffect } from "react";

import RichTextEditor, {
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
    GIPHY_API_KEY: "import.meta.env.VITE_GIPHY_API_KEY as string", // TODO: fix this later
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

const DEFAULT_DOC = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        id: null,
        textAlign: null,
        indent: 0,
        lineHeight: null,
        dir: "auto",
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "The quick brown fox jumped over a lazy dog",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: null,
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
          type: "text",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: null,
        dir: "auto",
      },
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                backgroundColor: null,
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                    indent: 0,
                    lineHeight: null,
                    dir: "auto",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
        indent: 0,
        lineHeight: null,
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
            src: "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=12%2C96%2C2671%2C1335&q=45&auto=format&w=668&h=324&fit=crop",
            alt: "Dog",
            title: null,
            flipX: false,
            flipY: false,
            width: 466,
            align: "center",
            inline: false,
          },
        },
      ],
    },
  ],
};

function Preview() {
  // Initialize English as default language
  useEffect(() => {
    locale.setLang("en");
  }, []);

  return (
    <div
      className=" flex flex-col w-full max-w-screen-lg my-0"
      style={{
        maxWidth: 1024,
        margin: "40px auto",
      }}
    >
      <RichTextRenderEngine
        content={DEFAULT_DOC}
        extensions={extensions}
        dark={false}
        minHeight="200px"
        contentClass="w-full"
      />
    </div>
  );
}

export default Preview;
