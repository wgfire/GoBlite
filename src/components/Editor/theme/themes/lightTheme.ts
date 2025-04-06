import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Colors inspired by GitHub Light, VS Code Light+, and Atom One Light
const blue = "#0366d6";
const purple = "#6f42c1";
const green = "#22863a";
const red = "#d73a49";
const orange = "#e36209";
const darkBlue = "#005cc5";
const teal = "#032f62";
const gray = "#6a737d";
const darkGray = "#24292e";
const background = "#ffffff";
const gutterBackground = "#f5f7fa";
const lineNumberColor = "#8c96a3";
const selection = "#add6ff";
const cursor = "#044289";
const tooltipBackground = "#ffffff";
const border = "#e1e4e8";
const activeLine = "#f2f9ff";
const foldBackground = "#ebf1fb";
const matchingBracketBackground = "#c8e1ff";
const searchMatchBackground = "#ffdf5d";

/**
 * Modern Light theme for CodeMirror
 */
export const lightTheme = EditorView.theme({
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
    color: darkGray,
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
    scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0, 0, 0, 0.2)",
      borderRadius: "4px",
      border: "2px solid transparent",
      backgroundClip: "content-box",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "rgba(0, 0, 0, 0.3)",
      borderRadius: "4px",
      border: "2px solid transparent",
      backgroundClip: "content-box",
    },
  },
  ".cm-gutters": {
    backgroundColor: gutterBackground,
    border: "none",
    borderRight: `1px solid ${border}`,
    paddingRight: "8px",
  },
  ".cm-gutter": {
    minWidth: "20px",
    color: lineNumberColor,
  },
  ".cm-activeLineGutter": {
    backgroundColor: activeLine,
    color: darkGray,
  },
  ".cm-activeLine": {
    backgroundColor: activeLine,
  },
  ".cm-selectionBackground": {
    backgroundColor: selection,
    border: "none",
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
    backgroundColor: matchingBracketBackground,
    outline: "1px solid rgba(3, 102, 214, 0.3)",
    color: darkGray,
  },
  ".cm-nonmatchingBracket": {
    backgroundColor: "#ffdce0",
    outline: "1px solid #fdaeb7",
  },
  ".cm-tooltip": {
    backgroundColor: tooltipBackground,
    border: `1px solid ${border}`,
    borderRadius: "6px",
    padding: "8px 0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
          backgroundColor: activeLine,
          color: darkGray,
        },
      },
    },
  },
  ".cm-tooltip-lint": {
    backgroundColor: tooltipBackground,
    border: `1px solid ${border}`,
    borderRadius: "4px",
    padding: "4px 8px",
    "& .cm-diagnostic": {
      padding: "4px 0",
      "&:not(:last-child)": {
        borderBottom: `1px solid ${border}`,
      },
    },
    "& .cm-diagnostic-error": {
      color: red,
    },
    "& .cm-diagnostic-warning": {
      color: orange,
    },
    "& .cm-diagnostic-info": {
      color: blue,
    },
  },
  ".cm-foldPlaceholder": {
    backgroundColor: foldBackground,
    border: "none",
    color: darkGray,
    borderRadius: "4px",
    padding: "0 8px",
    margin: "0 4px",
  },
  ".cm-lineNumbers": {
    minWidth: "20px",
  },
  ".cm-foldGutter": {
    paddingRight: "4px",
    color: lineNumberColor,
    "& .cm-gutterElement": {
      cursor: "pointer",
      "&:hover": {
        color: darkGray,
      },
    },
  },
  ".cm-searchMatch": {
    backgroundColor: `${searchMatchBackground}80`,
    outline: `1px solid ${searchMatchBackground}`,
  },
  ".cm-searchMatch-selected": {
    backgroundColor: searchMatchBackground,
    outline: "1px solid #f9c513",
  },
});

/**
 * Syntax highlighting for the light theme
 */
export const lightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: purple },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: red },
  { tag: [t.function(t.variableName), t.labelName], color: darkBlue },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: orange },
  { tag: [t.definition(t.name), t.separator], color: darkGray },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: orange },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: teal },
  { tag: [t.meta, t.comment], color: gray, fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: blue, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: purple },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: blue },
  { tag: [t.processingInstruction, t.string, t.inserted], color: green },
  { tag: t.invalid, color: red, borderBottom: `1px dotted ${red}` },
]);

/**
 * Complete light theme extension for CodeMirror
 */
export const lightThemeExtension = [lightTheme, syntaxHighlighting(lightHighlightStyle)];
