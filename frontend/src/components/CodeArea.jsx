import { Code } from "lucide-react";
import { useState, useRef } from "react";

export default function CodeArea() {
  const [code, setCode] = useState("");
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textareaRef.current.selectionStart = start + 2;
        textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col transition-colors duration-300 dark:bg-gray-900 bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b transition-colors duration-300 dark:border-gray-700 border-gray-200">
        <Code />
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {code.length} tecken
        </p>
      </div>

      {/* Code editor area */}
      <div className="flex-1 overflow-y-auto">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          data-gramm="false"
          placeholder="Skriv din kod här..."
          className="w-full h-full resize-none border-none bg-transparent p-6 font-mono text-sm leading-relaxed text-gray-800 outline-none focus:ring-0 dark:text-gray-200"
        />
      </div>
    </div>
  );
}
