import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { sanitizeRichHtml, isRichHtmlEmpty } from "../../utils/richText";

export default function AddTaskForm({ addTask }) {
  const [newTaskHtml, setNewTaskHtml] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handleAddTask = async (html) => {
    const cleanHtml = sanitizeRichHtml(typeof html === "string" ? html : newTaskHtml);
    if (isRichHtmlEmpty(cleanHtml) || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await addTask(cleanHtml);
      setNewTaskHtml("");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <RichTextEditor
      value={newTaskHtml}
      onChange={setNewTaskHtml}
      onSubmit={handleAddTask}
      onCancel={() => setNewTaskHtml("")}
      placeholder="Skriv en anteckning..."
      className="composer-editor"
      rightAction={(submit) =>
        <button
          type="button"
          className="composer-submit"
          onClick={submit}
          disabled={isRichHtmlEmpty(newTaskHtml) || submitting}
          title="Lägg till anteckning"
          aria-label="Lägg till anteckning"
        >
          <ArrowUp size={17} />
        </button>
      }
    />
  );
}
