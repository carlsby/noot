import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { autoLinkifyRichHtml, linkifyTextToHtml, sanitizeRichHtml } from "../../utils/richText";

function selectionOffsets(root) {
  const selection = window.getSelection();
  if (!root || !selection?.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  const before = document.createRange();
  before.selectNodeContents(root);
  before.setEnd(range.startContainer, range.startOffset);
  const start = before.toString().length;
  before.setEnd(range.endContainer, range.endOffset);
  return { start, end: before.toString().length };
}

function restoreSelection(root, offsets) {
  if (!root || !offsets) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const points = [];
  let count = 0;
  let node;
  while ((node = walker.nextNode()) && points.length < 2) {
    const next = count + node.textContent.length;
    for (const offset of [offsets.start, offsets.end].slice(points.length)) {
      if (offset >= count && offset <= next) points.push([node, offset - count]);
      else break;
    }
    count = next;
  }
  if (points.length !== 2) return;
  const range = document.createRange();
  range.setStart(...points[0]);
  range.setEnd(...points[1]);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export default function RichTextEditor({ value, onChange, onSubmit, onCancel, placeholder, autoFocus = false, className = "", rightAction = null }) {
  const editorRef = useRef(null);
  const savedSelection = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const safe = sanitizeRichHtml(value || "");
    if (editorRef.current && editorRef.current.innerHTML !== safe) {
      editorRef.current.innerHTML = safe;
    }
  }, [value]);

  useEffect(() => { if (autoFocus) editorRef.current?.focus(); }, [autoFocus]);

  const rememberSelection = () => {
    const offsets = selectionOffsets(editorRef.current);
    if (offsets) savedSelection.current = offsets;
  };

  const commit = () => {
    const editor = editorRef.current;
    if (!editor) return "";
    const html = sanitizeRichHtml(autoLinkifyRichHtml(editor.innerHTML));
    if (editor.innerHTML !== html) {
      const offsets = selectionOffsets(editor);
      editor.innerHTML = html;
      restoreSelection(editor, offsets);
    }
    onChange?.(html);
    return html;
  };

  const submit = () => onSubmit?.(commit());

  const format = (command) => {
    const editor = editorRef.current;
    if (!editor) return;
    const offsets = selectionOffsets(editor) || savedSelection.current;
    editor.focus();
    restoreSelection(editor, offsets);
    document.execCommand(command, false, null);
    commit();
    restoreSelection(editor, offsets);
    savedSelection.current = offsets;
  };

  const handlePaste = (event) => {
    const html = event.clipboardData?.getData("text/html");
    const text = event.clipboardData?.getData("text/plain");
    if (!html && !text) return;
    event.preventDefault();
    document.execCommand("insertHTML", false, html ? sanitizeRichHtml(html) : linkifyTextToHtml(text));
    commit();
  };

  const handleKeyDown = (event) => {
    const modifier = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();
    if (modifier && !event.shiftKey && ["b", "i", "u"].includes(key)) {
      event.preventDefault();
      format({ b: "bold", i: "italic", u: "underline" }[key]);
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onCancel?.();
    }
  };

  return (
    <div className={`note-editor ${className}`}>
      <div className="editor-body">
        {!value && !focused && <span className="editor-placeholder">{placeholder}</span>}
        <div ref={editorRef} role="textbox" aria-label={placeholder} aria-multiline="true" contentEditable suppressContentEditableWarning
          className="editor-surface" onInput={commit} onPaste={handlePaste} onKeyDown={handleKeyDown}
          onMouseUp={rememberSelection} onKeyUp={rememberSelection}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onClick={(event) => {
            const anchor = event.target.closest?.("a");
            if (!anchor) return;
            event.preventDefault();
            if (event.metaKey || event.ctrlKey) window.electronAPI?.invoke?.("open-external-url", anchor.href);
          }} />
      </div>
      <div className="editor-toolbar">
        <div className="editor-format-actions">
          <button type="button" title="Fetstil (Ctrl+B)" aria-label="Fetstil" onMouseDown={(event) => event.preventDefault()} onClick={() => format("bold")}><Bold size={16} /></button>
          <button type="button" title="Kursiv (Ctrl+I)" aria-label="Kursiv" onMouseDown={(event) => event.preventDefault()} onClick={() => format("italic")}><Italic size={16} /></button>
          <button type="button" title="Understruken (Ctrl+U)" aria-label="Understruken" onMouseDown={(event) => event.preventDefault()} onClick={() => format("underline")}><Underline size={16} /></button>
        </div>
        {typeof rightAction === "function" ? rightAction(submit) : rightAction}
      </div>
    </div>
  );
}
