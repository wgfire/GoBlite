import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Colors inspired by popular dark themes (One Dark Pro, Tokyo Night, Dracula)
const chalky = "#e5c07b";
const coral = "#e06c75";
const cyan = "#56b6c2";
const invalid = "#ff8080";
const ivory = "#abb2bf";
const stone = "#7d8799";
const malibu = "#61afef";
const sage = "#98c379";
const whiskey = "#d19a66";
const violet = "#c678dd";
const highlightBackground = "#2c313c";
const background = "#21252b";
const tooltipBackground = "#353a42";
const selection = "#3E4451";
const cursor = "#528bff";
const gutterBackground = "#2a2e36";
const gutterForeground = "#636d83";

/**
 * Modern Dark theme for CodeMirror
 */
export const darkTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontSize: "14px",
      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
      backgroundColor: background,
      color: ivory,
      letterSpacing: "0.3px",
    },
    "&.cm-focused": {
      outline: "none !important",
    },
    ".cm-scroller": {
      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
      lineHeight: "1.6",
      height: "100%",
      overflow: "auto",
      padding: "4px 0",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "4px",
        border: "2px solid transparent",
        backgroundClip: "content-box",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "rgba(255, 255, 255, 0.3)",
        borderRadius: "4px",
        border: "2px solid transparent",
        backgroundClip: "content-box",
      },
    },
    ".cm-gutters": {
      backgroundColor: gutterBackground,
      border: "none",
      borderRight: `1px solid ${background}`,
      paddingRight: "8px",
    },
    ".cm-gutter": {
      minWidth: "20px",
      color: gutterForeground,
    },
    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground,
      color: "#bbc0c9",
    },
    ".cm-activeLine": {
      backgroundColor: highlightBackground,
    },
    ".cm-selectionBackground": {
      backgroundColor: selection,
    },
    ".cm-cursor": {
      borderLeft: `2px solid ${cursor}`,
    },
    ".cm-line": {
      padding: "0 4px 0 8px",
    },
    ".cm-content": {
      padding: "4px 0",
      caretColor: cursor,
    },
    ".cm-matchingBracket": {
      backgroundColor: "#3a404d",
      outline: "1px solid #4b525e",
      color: "#bbc0c9",
    },
    ".cm-nonmatchingBracket": {
      backgroundColor: "#bb3c3c40",
      outline: "1px solid #bb3c3c40",
    },
    ".cm-tooltip": {
      backgroundColor: tooltipBackground,
      border: "1px solid #181a1f",
      borderRadius: "6px",
      padding: "8px 0",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
      overflow: "hidden",
      animation: "cm-appear 0.1s ease-out",
    },
    ".cm-tooltip.cm-tooltip-autocomplete": {
      "& > ul": {
        backgroundColor: tooltipBackground,
        border: "none",
        borderRadius: "4px",
        maxHeight: "200px",
        overflow: "auto",
        fontFamily: '"Fira Code", "JetBrains Mono", monospace',
        fontSize: "13px",
        "& > li": {
          padding: "4px 8px",
          borderRadius: "0",
          "&[aria-selected]": {
            backgroundColor: "#3a404d",
            color: "#ffffff",
          },
        },
      },
    },
    ".cm-tooltip-lint": {
      backgroundColor: tooltipBackground,
      border: "1px solid #181a1f",
      borderRadius: "4px",
      padding: "4px 8px",
      "& .cm-diagnostic": {
        padding: "4px 0",
        "&:not(:last-child)": {
          borderBottom: "1px solid #3a404d",
        },
      },
      "& .cm-diagnostic-error": {
        color: coral,
      },
      "& .cm-diagnostic-warning": {
        color: chalky,
      },
      "& .cm-diagnostic-info": {
        color: malibu,
      },
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#3a404d",
      border: "none",
      color: "#ddd",
      borderRadius: "4px",
      padding: "0 8px",
      margin: "0 4px",
    },
    ".cm-lineNumbers": {
      minWidth: "20px",
    },
    ".cm-foldGutter": {
      paddingRight: "4px",
      color: gutterForeground,
      "& .cm-gutterElement": {
        cursor: "pointer",
        "&:hover": {
          color: "#bbc0c9",
        },
      },
    },
    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch-selected": {
      backgroundColor: "#6199ff59",
      outline: "2px solid #457dff",
    },
  },
  { dark: true }
);

/**
 * Syntax highlighting for the dark theme
 */
export const darkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: violet },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: coral },
  { tag: [t.function(t.variableName), t.labelName], color: malibu },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
  { tag: [t.definition(t.name), t.separator], color: ivory },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: chalky },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: cyan },
  { tag: [t.meta, t.comment], color: stone, fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: stone, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: coral },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
  { tag: [t.processingInstruction, t.string, t.inserted], color: sage },
  { tag: t.invalid, color: invalid },
]);

/**
 * Complete dark theme extension for CodeMirror
 */
export const darkThemeExtension = [darkTheme, syntaxHighlighting(darkHighlightStyle)];
