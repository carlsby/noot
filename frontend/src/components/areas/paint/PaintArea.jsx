import { Eraser, Paintbrush, Redo, Save, Undo } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ReactSketchCanvas } from "react-sketch-canvas"
import { ConfirmClearModal } from "../../shared/ConfirmClearModal"

export default function PaintArea({ setSelectedPainting, selectedPainting, updatePainting }) {
  const canvasRef = useRef(null)
  const undoRef = useRef(null)
  const redoRef = useRef(null)
  const toastTimeoutRef = useRef(null)
  const saveDrawingRef = useRef(null)
  const colorInputRef = useRef(null)
  const autosaveTimeoutRef = useRef(null)

  const [strokeWidth, setStrokeWidth] = useState(8)
  const [isErasing, setIsErasing] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])

  useEffect(() => {
    const loadStrokes = async () => {
      if (!canvasRef.current) return
      await canvasRef.current.clearCanvas()
      if (selectedPainting?.strokes) {
        try {
          const parsedStrokes = JSON.parse(selectedPainting.strokes)
          await canvasRef.current.loadPaths(parsedStrokes)
          setUndoStack([parsedStrokes])
          setRedoStack([])
        } catch (error) {
          console.error("Kunde inte ladda strokes:", error)
          setUndoStack([])
          setRedoStack([])
        }
      } else {
        setUndoStack([])
        setRedoStack([])
      }
    }

    loadStrokes()
  }, [selectedPainting?._id])

  const showTemporaryToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    setToastMessage(message)
    setShowToast(true)
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false)
      setToastMessage("")
      toastTimeoutRef.current = null
    }, 3000)
  }

  const saveDrawing = async (paintingId = selectedPainting._id) => {
    if (!canvasRef.current) return
    const paths = await canvasRef.current.exportPaths()
    const strokes = JSON.stringify(paths)
    updatePainting(paintingId, selectedPainting.name, strokes)
  }

  const clearCanvas = () => {
    if (!canvasRef.current) return
    canvasRef.current.clearCanvas()
    showTemporaryToast("Målningen rensad!")
  }

  const handleColorChange = (newColor) => {
    setSelectedPainting((prev) => {
      if (prev.color === newColor) return prev
      return {
        ...prev,
        color: newColor,
      }
    })
  }

  const toggleEraser = () => {
    if (!canvasRef.current) return
    const newErasing = !isErasing
    setIsErasing(newErasing)
    canvasRef.current.eraseMode(newErasing)
    showTemporaryToast(
      newErasing ? (
        <div className="flex items-center gap-2">
          <Eraser /> Suddgummi aktiverat!
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Paintbrush /> Pensel aktiverad!
        </div>
      ),
    )
  }

  const handleStroke = async () => {
    if (!canvasRef.current) return
    const paths = await canvasRef.current.exportPaths()
    setUndoStack((prev) => [...prev, paths])
    setRedoStack([])
    setHasUnsavedChanges(true)

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }

    const currentPaintingId = selectedPainting._id
    autosaveTimeoutRef.current = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDrawing(currentPaintingId)
        setHasUnsavedChanges(false)
        showTemporaryToast("Autosparad!")
      }
    }, 5000)
  }

  const undo = async () => {
    if (undoStack.length === 0 || !canvasRef.current) return
    const newUndoStack = [...undoStack]
    const lastPaths = newUndoStack.pop()
    const currentPaths = await canvasRef.current.exportPaths()
    setRedoStack((prev) => [...prev, currentPaths])
    setUndoStack(newUndoStack)

    const previousPaths = newUndoStack.length > 0 ? newUndoStack[newUndoStack.length - 1] : []
    await canvasRef.current.clearCanvas()
    if (previousPaths.length) {
      await canvasRef.current.loadPaths(previousPaths)
    }
    showTemporaryToast("Ångra")
  }

  const redo = async () => {
    if (redoStack.length === 0 || !canvasRef.current) return
    const newRedoStack = [...redoStack]
    const nextPaths = newRedoStack.pop()
    const currentPaths = await canvasRef.current.exportPaths()
    setUndoStack((prev) => [...prev, currentPaths])
    setRedoStack(newRedoStack)

    await canvasRef.current.clearCanvas()
    if (nextPaths.length) {
      await canvasRef.current.loadPaths(nextPaths)
    }
    showTemporaryToast("Gör om")
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault()
        undoRef.current()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault()
        redoRef.current()
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        saveDrawingRef.current()
        showTemporaryToast(
          <div className="flex gap-2 items-center">
            <Save /> Sparad
          </div>,
        )
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    undoRef.current = undo
    redoRef.current = redo
    saveDrawingRef.current = saveDrawing
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-neutral-950 min-h-screen relative">
      {selectedPainting && (
        <>
          <div className="sticky top-0 z-10 h-[80px] bg-neutral/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 ms-6 lg:ms-0">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Paintbrush className="text-black dark:text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {selectedPainting.name}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex relative">
            <div className="flex-1 md:mr-0 mr-16 overflow-hidden relative">
              <div className="h-full">
                <div className="bg-neutral-100 dark:bg-neutral-800 h-full">
                  <div className="bg-neutral-100 dark:bg-neutral-950 h-full relative">
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

            <div
              className={`md:hidden fixed right-0 top-[80px] bottom-0 w-16 bg-neutral-100/95 dark:bg-neutral-950/95 backdrop-blur-sm border-l border-neutral-200 dark:border-neutral-700 z-20`}
            >
              <div className="flex flex-col items-center gap-4 p-3 h-full">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm cursor-pointer transition-transform duration-200 hover:scale-110"
                    style={{ backgroundColor: selectedPainting.color }}
                    onClick={() => colorInputRef.current.click()}
                    title="Välj färg"
                  />
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={selectedPainting.color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="absolute -top-20 -left-64 w-8 h-8 opacity-0 cursor-pointer"
                    title="Välj färg"
                  />

                <div className="flex flex-col items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-12 h-8 text-center text-xs bg-neutral-200 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-600 rounded focus:outline-none focus:ring-1 focus:ring-neutral-500"
                    title="Ange penselstorlek (1-30)"
                  />
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={undo}
                    disabled={undoStack.length <= 1}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      undoStack.length <= 1
                        ? "opacity-40 cursor-not-allowed text-neutral-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                    title="Ångra"
                  >
                    <Undo size={20} />
                  </button>

                  <button
                    onClick={redo}
                    disabled={redoStack.length === 0}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      redoStack.length === 0
                        ? "opacity-40 cursor-not-allowed text-neutral-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                    title="Gör om"
                  >
                    <Redo size={20} />
                  </button>

                  <button
                    onClick={toggleEraser}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isErasing
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                    title="Suddgummi"
                  >
                    <Eraser size={20} />
                  </button>

                  <button
                    onClick={() => setShowConfirm(true)}
                    className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                    title="Rensa"
                  >
                    <Paintbrush size={20} />
                  </button>

                  <button
                    onClick={() => {
                      const currentPaintingId = selectedPainting._id
                      saveDrawing(currentPaintingId)
                      showTemporaryToast(
                        <div className="flex gap-2 items-center">
                          <Save /> Sparad
                        </div>,
                      )
                    }}
                    className="p-2 bg-gradient-to-r from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 text-black rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    title="Spara"
                  >
                    <Save size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block sticky bottom-0 bg-neutral-100/95 dark:bg-neutral-950/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-700 px-8 py-6 h-[95px]">
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
                  title="Välj färg"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Färg</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label
                  htmlFor="strokeWidth"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
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
                  className="w-full h-2 bg-gray-300 rounded cursor-pointer appearance-none neutral-range"
                  title="Penselstorlek"
                />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{strokeWidth}px</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={undo}
                  disabled={undoStack.length <= 1}
                  className={`text-neutral-600 p-1 rounded-lg transition-colors duration-200 font-medium
                    ${
                      undoStack.length <= 1
                        ? "opacity-40 cursor-not-allowed dark:text-neutral-600"
                        : "dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  title="Ångra (Ctrl + Z)"
                >
                  <Undo />
                </button>

                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className={`text-neutral-600 p-1 rounded-lg transition-colors duration-200 font-medium
                    ${
                      redoStack.length === 0
                        ? "opacity-40 cursor-not-allowed dark:text-neutral-600"
                        : "dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  title="Gör om (Ctrl + Y)"
                >
                  <Redo />
                </button>

                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors duration-200 font-medium"
                  title="Rensa målning"
                >
                  Rensa
                </button>

                <button
                  onClick={toggleEraser}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isErasing
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                  title="Aktivera suddgummi"
                >
                  <Eraser />
                </button>

                <button
                  onClick={() => {
                    const currentPaintingId = selectedPainting._id
                    saveDrawing(currentPaintingId)
                    showTemporaryToast(
                      <div className="flex gap-2 items-center">
                        <Save /> Sparad
                      </div>,
                    )
                  }}
                  className="px-6 py-2 bg-neutral-300 hover:bg-neutral-300/80 text-black rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center gap-2"
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
        className={`fixed top-24 right-24 md:right-4 bg-neutral-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold
          transition-opacity duration-300 ${
            showToast ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
            clearCanvas()
            setShowConfirm(false)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
