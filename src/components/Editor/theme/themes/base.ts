import { EditorView } from "@codemirror/view";

export const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: "14px",
    fontFamily: '"Fira Code", monospace',
    backgroundColor: "#ffffff",
    color: "#24292f",
  },
  "&.cm-focused": {
    outline: "none !important",
  },
  ".cm-scroller": {
    fontFamily: '"Fira Code", monospace',
    lineHeight: "1.6",
    height: "100%",
    overflow: "auto",
  },
  ".cm-gutters": {
    backgroundColor: "#f6f8fa",
    border: "none",
    borderRight: "1px solid #d0d7de",
  },
  ".cm-gutter": {
    minWidth: "40px",
    color: "#57606a",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#f6f8fa",
  },
  ".cm-activeLine": {
    backgroundColor: "#f6f8fa",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#b4d6fc50",
  },
  ".cm-cursor": {
    borderLeft: "2px solid #0969da",
  },
  ".cm-line": {
    padding: "0 4px",
  },
  ".cm-content": {
    padding: "4px 0",
    caretColor: "#0969da",
  },
  ".cm-matchingBracket": {
    backgroundColor: "#34d05840",
    outline: "1px solid #34d05840",
  },
  ".cm-comment": { 
    color: "#953800", 
  },
  ".cm-string": {
    color: "#cf222e", 
  },
  ".cm-keyword": {
    color: "#0550ae", 
  },
  ".cm-type": {
    color: "#0550ae", 
  },
  ".cm-function": {
    color: "#8250df", 
  },
  ".cm-variable": {
    color: "#0550ae", 
  },
  ".cm-property": {
    color: "#0550ae", 
  },
  ".cm-tooltip": {
    backgroundColor: "#ffffff",
    border: "1px solid #d0d7de",
    borderRadius: "6px",
    padding: "8px 0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    animation: "cm-appear 0.1s ease-out",
  },
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      backgroundColor: "#ffffff",
      padding: "0",
      margin: 0,
    },
  },
  ".cm-tooltip-autocomplete ul li": {
    lineHeight: "1.5",
    padding: "6px 12px 6px 16px",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.1s ease",
    color: "#24292f",
  },
  ".cm-tooltip-autocomplete ul li:hover": {
    backgroundColor: "#f6f8fa",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "#0969da",
    color: "#ffffff",
  },
  ".cm-completionMatchedText": {
    color: "#0969da",
    textDecoration: "none",
    fontWeight: "600",
  },
  ".cm-completionIcon": {
    marginRight: "10px",
    color: "#57606a",
    display: "inline-block",
    opacity: "0.85",
  },
  ".cm-completionIcon-function": {
    color: "#8250df",
    "&:after": { content: "'λ'" },
  },
  ".cm-completionIcon-variable": {
    color: "#0550ae",
    "&:after": { content: "'𝑥'" },
  },
  ".cm-completionIcon-type": {
    color: "#0550ae",
    "&:after": { content: "'T'" },
  },
  ".cm-completionIcon-class": {
    color: "#0550ae",
    "&:after": { content: "'C'" },
  },
  ".cm-completionIcon-interface": {
    color: "#0550ae",
    "&:after": { content: "'I'" },
  },
  ".cm-completionIcon-keyword": {
    color: "#cf222e",
    "&:after": { content: "'K'" },
  },
  ".cm-completionIcon-property": {
    color: "#953800",
    "&:after": { content: "'P'" },
  },
  ".cm-tooltip.cm-completionInfo": {
    backgroundColor: "#ffffff",
    border: "1px solid #d0d7de",
    padding: "12px",
    maxWidth: "400px",
    maxHeight: "300px",
    overflow: "auto",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    lineHeight: "1.6",
  },
  ".cm-completionInfo.cm-completionInfo-right": {
    "& p": {
      margin: "0 0 8px 0",
      color: "#24292f",
    },
    "& ul, & ol": {
      margin: "0 0 8px 0",
      paddingLeft: "20px",
    },
    "& code": {
      backgroundColor: "#f6f8fa",
      padding: "2px 4px",
      borderRadius: "3px",
      fontSize: "12px",
    },
  },
  ".cm-tooltip.cm-tooltip-signature": {
    backgroundColor: "#ffffff",
    border: "1px solid #d0d7de",
    padding: "8px 12px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    fontSize: "13px",
    color: "#24292f",
  },
  ".cm-tooltip-signature .cm-signature-activeParameter": {
    color: "#0969da",
    fontWeight: "600",
    textDecorationLine: "underline",
    textUnderlineOffset: "2px",
  },
  ".cm-tooltip-autocomplete ul::-webkit-scrollbar": {
    width: "6px",
  },
  ".cm-tooltip-autocomplete ul::-webkit-scrollbar-track": {
    backgroundColor: "#f6f8fa",
  },
  ".cm-tooltip-autocomplete ul::-webkit-scrollbar-thumb": {
    backgroundColor: "#d0d7de",
    borderRadius: "3px",
  },
  ".cm-tooltip-autocomplete ul::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#afb8c1",
  },
  "@keyframes cm-appear": {
    from: {
      opacity: 0,
      transform: "translateY(-2px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
});
