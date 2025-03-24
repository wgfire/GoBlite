import { useEditor } from "./core/useEditor";
import "./style/editor.css";
import './style/syntax.css'
interface EditorProps {
  initialCode?: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
}

const Editor = ({
  initialCode,
  onChange,
  readonly = false
}: EditorProps) => {
  const { editorContainerRef } = useEditor({
    initialDoc: initialCode,
    onChange,
    readonly
  });

  return (
    <div className="editor-container">
      <div className="editor-wrapper" ref={editorContainerRef}></div>
    </div>
  );
};

export default Editor;