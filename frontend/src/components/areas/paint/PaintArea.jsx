import { Eraser, Paintbrush, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ConfirmClearModal } from "../../shared/ConfirmClearModal";

export default function PaintArea({
  setSelectedPainting,
  selectedPainting,
  updatePainting,
}) {
  const canvasRef = useRef(null);
  const [isErasing, setIsErasing] = useState(false);
  const colorInputRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const autosaveTimeoutRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadStrokes = async () => {
      if (!canvasRef.current) return;
      await canvasRef.current.clearCanvas();
      if (selectedPainting?.strokes) {
        try {
          const parsedStrokes = JSON.parse(selectedPainting.strokes);
          await canvasRef.current.loadPaths(parsedStrokes);
        } catch (error) {
          console.error("Kunde inte ladda strokes:", error);
        }
      }
    };
    loadStrokes();
  }, [selectedPainting]);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.eraseMode(isErasing);
  }, [isErasing]);

  const showTemporaryToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setTimeout(() => setToastMessage(""), 300);
    }, 3000);
  };

  const saveDrawing = async () => {
    if (!canvasRef.current) return;
    const paths = await canvasRef.current.exportPaths();
    const strokes = JSON.stringify(paths);
    updatePainting(selectedPainting._id, selectedPainting.name, strokes);
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

  const handleStroke = () => {
    setHasUnsavedChanges(true);

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDrawing();
        setHasUnsavedChanges(false);
        showTemporaryToast("Autosparad!");
      }
    }, 5000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen relative">
      {selectedPainting && (
        <>
          <div className="sticky top-0 z-10 h-[80px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <div className="px-8 py-4">
              <div className="flex items-center gap-4 ms-6 lg:ms-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Paintbrush className="text-white" size={24} />
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
                <div className="bg-slate-50 dark:bg-slate-900 h-full">
                  <ReactSketchCanvas
                    key={selectedPainting?._id}
                    ref={canvasRef}
                    strokeWidth={4}
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
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform duration-200 hover:scale-110"
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
              <div className="flex items-center gap-3">
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
                    saveDrawing();
                    showTemporaryToast(
                      <div className="flex gap-2 items-center">
                        <Save /> Sparad
                      </div>
                    );
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center gap-2"
                  title="Spara målning"
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
