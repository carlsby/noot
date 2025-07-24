import { Eraser, Paintbrush, Redo, Save, Undo } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ConfirmClearModal } from "../../shared/ConfirmClearModal";

export default function PaintArea({
  setSelectedPainting,
  selectedPainting,
  updatePainting,
}) {
  const canvasRef = useRef(null);
  const undoRef = useRef(null);
  const redoRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const saveDrawingRef = useRef(null);
  const colorInputRef = useRef(null);
  const autosaveTimeoutRef = useRef(null);
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [isErasing, setIsErasing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const loadStrokes = async () => {
      if (!canvasRef.current) return;
      await canvasRef.current.clearCanvas();
      if (selectedPainting?.strokes) {
        try {
          const parsedStrokes = JSON.parse(selectedPainting.strokes);
          await canvasRef.current.loadPaths(parsedStrokes);

          setUndoStack([parsedStrokes]);
          setRedoStack([]);
        } catch (error) {
          console.error("Kunde inte ladda strokes:", error);
          setUndoStack([]);
          setRedoStack([]);
        }
      } else {
        // Om inga strokes finns, nollställ undostacken och redostacken :D
        setUndoStack([]);
        setRedoStack([]);
      }
    };
    loadStrokes();
  }, [selectedPainting?._id]);

  const showTemporaryToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    setShowToast(true);

    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
      toastTimeoutRef.current = null;
    }, 3000);
  };

  const saveDrawing = async (paintingId = selectedPainting._id) => {
    if (!canvasRef.current) return;
    const paths = await canvasRef.current.exportPaths();
    const strokes = JSON.stringify(paths);
    updatePainting(paintingId, selectedPainting.name, strokes);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    canvasRef.current.clearCanvas();
    showTemporaryToast("Målningen rensad!");
  };

  const handleColorChange = (newColor) => {
    setSelectedPainting((prev) => {
      if (prev.color === newColor) return prev;
      return {
        ...prev,
        color: newColor,
      };
    });
  };

  const toggleEraser = () => {
    if (!canvasRef.current) return;
    const newErasing = !isErasing;
    setIsErasing(newErasing);
    canvasRef.current.eraseMode(newErasing);
    showTemporaryToast(
      newErasing ? (
        <div className="flex items-center gap-2">
          <Eraser /> Suddgummi aktiverat!
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Paintbrush /> Pensel aktiverad!
        </div>
      )
    );
  };

  const handleStroke = async () => {
    if (!canvasRef.current) return;

    // Hämta nuvarande penseldrag
    const paths = await canvasRef.current.exportPaths();

    // Lägg till i undo-stack, rensa redo-stack
    setUndoStack((prev) => [...prev, paths]);
    setRedoStack([]);

    // Markera att det finns ändringar som inte sparats
    setHasUnsavedChanges(true);

    // Om det redan finns en autosave-timer, nollställ den
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Starta autosave efter 5 sek om inget nytt händer
    const currentPaintingId = selectedPainting._id;
    autosaveTimeoutRef.current = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDrawing(currentPaintingId);
        setHasUnsavedChanges(false);
        showTemporaryToast("Autosparad!");
      }
    }, 5000);
  };

  const undo = async () => {
    if (undoStack.length === 0 || !canvasRef.current) return;

    // Ta senaste state från undoStack
    const newUndoStack = [...undoStack];
    const lastPaths = newUndoStack.pop();

    // Spara current state i redoStack för framtida redo
    const currentPaths = await canvasRef.current.exportPaths();
    setRedoStack((prev) => [...prev, currentPaths]);

    setUndoStack(newUndoStack);

    // Ladda sista "förra" state eller tom canvas
    const previousPaths =
      newUndoStack.length > 0 ? newUndoStack[newUndoStack.length - 1] : [];
    await canvasRef.current.clearCanvas();
    if (previousPaths.length) {
      await canvasRef.current.loadPaths(previousPaths);
    }
    showTemporaryToast("Ångra");
  };

  const redo = async () => {
    if (redoStack.length === 0 || !canvasRef.current) return;

    const newRedoStack = [...redoStack];
    const nextPaths = newRedoStack.pop();

    // Sparar aktuellea staten i undostack, för att kunna gå fram o tillbaka
    const currentPaths = await canvasRef.current.exportPaths();
    setUndoStack((prev) => [...prev, currentPaths]);

    setRedoStack(newRedoStack);

    await canvasRef.current.clearCanvas();
    if (nextPaths.length) {
      await canvasRef.current.loadPaths(nextPaths);
    }
    showTemporaryToast("Gör om");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undoRef.current();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key === "Z"))
      ) {
        e.preventDefault();
        redoRef.current();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDrawingRef.current();
        showTemporaryToast(
          <div className="flex gap-2 items-center">
            <Save /> Sparad
          </div>
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    undoRef.current = undo;
    redoRef.current = redo;
    saveDrawingRef.current = saveDrawing;
  }, [undo, redo, saveDrawing]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen relative">
      {selectedPainting && (
        <>
          <div className="sticky top-0 z-10 h-[80px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <div className="px-8 py-4">
              <div className="flex items-center gap-4 ms-6 lg:ms-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Paintbrush className="text-black dark:text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedPainting.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto h-full relative">
            <div className="h-full">
              <div className="bg-white dark:bg-slate-800 h-full">
                <div className="bg-slate-50 dark:bg-slate-900 h-full relative">
                  <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={strokeWidth}
                    strokeColor={selectedPainting.color}
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "transparent",
                    }}
                    canvasColor="transparent"
                    onStroke={handleStroke}
                    className="cursor-crosshair"
                    eraserWidth={strokeWidth}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 px-8 py-6 h-[100px]">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div
                className="relative flex items-center gap-3 cursor-pointer"
                onClick={() => colorInputRef.current.click()}
                title="Välj färg"
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm transition-transform duration-200 hover:scale-110"
                  style={{ backgroundColor: selectedPainting.color }}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={selectedPainting.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="absolute bottom-80 md:-left-20 w-8 h-8 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Färg
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="strokeWidth"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Penselstorlek
                </label>
                <input
                  id="strokeWidth"
                  type="range"
                  min="1"
                  max="30"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded cursor-pointer appearance-none purple-range"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {strokeWidth}px
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={undo}
                  disabled={undoStack.length <= 1}
                  className={`text-slate-600 p-1 rounded-lg transition-colors duration-200 font-medium
                    ${
                      undoStack.length <= 1
                        ? "opacity-40 cursor-not-allowed dark:text-slate-600"
                        : "dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  title="Ångra (Ctrl + Z)"
                >
                  <Undo />
                </button>

                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className={`text-slate-600 p-1 rounded-lg transition-colors duration-200 font-medium
                    ${
                      redoStack.length === 0
                        ? "opacity-40 cursor-not-allowed dark:text-slate-600"
                        : "dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  title="Gör om (Ctrl + Y)"
                >
                  <Redo />
                </button>

                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 font-medium"
                  title="Rensa målning"
                >
                  Rensa
                </button>
                <button
                  onClick={toggleEraser}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isErasing
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                  title="Aktivera suddgummi"
                >
                  <Eraser />
                </button>
                <button
                  onClick={() => {
                    const currentPaintingId = selectedPainting._id;
                    saveDrawing(currentPaintingId);
                    showTemporaryToast(
                      <div className="flex gap-2 items-center">
                        <Save /> Sparad
                      </div>
                    );
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center gap-2"
                  title="Spara målning (Ctrl + S)"
                >
                  <Save />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div
        className={`fixed top-24 right-4 bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold
          transition-opacity duration-300 ${
            showToast
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        role="alert"
        aria-live="polite"
      >
        {toastMessage}
      </div>

      {showConfirm && (
        <ConfirmClearModal
          message={`Är du säker på att du vill rensa målningen?`}
          onConfirm={() => {
            clearCanvas();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
