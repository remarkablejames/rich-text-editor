import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
} from "react";
import type { ComponentType } from "react";

import type { AnyExtension, Editor as CoreEditor } from "@tiptap/core";
import type { UseEditorOptions } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import { differenceBy } from "lodash-es";

import { TooltipProvider } from "@/components";
import { RESET_CSS } from "@/constants/resetCSS";
import { ProviderRichText } from "@/store/ProviderRichText";
import { themeActions } from "@/theme/theme";
import { removeCSS, updateCSS } from "@/utils/dynamicCSS";

import "../styles/index.scss";

/**
 * Interface for RichTextRenderEngine component props
 */
export interface RichTextRenderEngineProps {
  /** Content of the editor */
  content: string | object;
  /** Extensions for the editor */
  extensions: AnyExtension[];
  /** Dark mode flag */
  dark?: boolean;
  /** Maximum width */
  maxWidth?: string | number;
  /** Minimum height */
  minHeight?: string | number;
  /** Maximum height */
  maxHeight?: string | number;
  /** Content class */
  contentClass?: string | string[] | Record<string, any>;
  /** Use editor options */
  useEditorOptions?: UseEditorOptions;
  /** Use editor options */
  resetCSS?: boolean;
  /** This option gives us the control to enable the default behavior of rendering the editor immediately.*/
  immediatelyRender?: boolean;
}

function RichTextRenderEngine(
  props: RichTextRenderEngineProps,
  ref: React.ForwardedRef<{ editor: CoreEditor | null }>
) {
  const { content, extensions, useEditorOptions = {} } = props;

  const id = useId();

  const sortExtensions = useMemo(() => {
    const diff = differenceBy(extensions, extensions, "name");
    const exts = extensions.map((k: any) => {
      const find = extensions.find((ext: any) => ext.name === k.name);
      if (!find) {
        return k;
      }
      return k.configure(find.options);
    });
    return [...exts, ...diff].map((k, i) => k.configure({ sort: i }));
  }, [extensions]);

  const editor = useEditor({
    extensions: sortExtensions,
    content,
    immediatelyRender: props?.immediatelyRender || false,
    editable: false, // Make editor read-only
    ...useEditorOptions,
  }) as any;

  useImperativeHandle(ref, () => {
    return {
      editor,
    };
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", props.dark);
    themeActions.setTheme(id, props.dark ? "dark" : "light");
  }, [props.dark]);

  useEffect(() => {
    // Ensure editor stays read-only
    editor?.setEditable(false);
  }, [editor]);

  useEffect(() => {
    if (props?.resetCSS !== false) {
      updateCSS(RESET_CSS, "react-tiptap-reset");
    }

    return () => {
      removeCSS("react-tiptap-reset");
    };
  }, [props?.resetCSS]);

  useLayoutEffect(() => {
    if (editor) editor!.id = id;
  }, [id, editor]);

  useEffect(() => {
    return () => {
      editor?.destroy?.();
    };
  }, []);

  if (!editor) {
    return <></>;
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: props.maxWidth,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
  };

  return (
    <div className="reactjs-tiptap-render-engine" style={containerStyle}>
      <ProviderRichText id={id}>
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <div className="richtext-overflow-hidden richtext-w-full richtext-border richtext-rounded-md richtext-bg-background">
            <div className="richtext-flex richtext-max-h-full richtext-w-full richtext-flex-col">
              <EditorContent
                className={`richtext-relative richtext-read-only ${
                  props?.contentClass || ""
                }`}
                editor={editor}
              />
            </div>
          </div>
        </TooltipProvider>
      </ProviderRichText>
    </div>
  );
}

const RichTextRenderEngineWithRef = forwardRef(RichTextRenderEngine);

// Type assertion to fix React 19 compatibility
export default RichTextRenderEngineWithRef as ComponentType<
  RichTextRenderEngineProps & React.RefAttributes<{ editor: CoreEditor | null }>
>;
