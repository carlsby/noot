import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import TaskArea from "./components/TaskArea"
import { initializeDarkMode, toggleDarkMode as toggleDarkModeUtil } from "./utils/darkMode"

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const isDark = initializeDarkMode()
    setDarkMode(isDark)

    // Hämta initial data från backend (Electron/Lowdb)
    async function fetchData() {
      const cats = await window.electronAPI.invoke("get-categories")
      const tks = await window.electronAPI.invoke("get-tasks")

      setCategories(cats)
      setTasks(tks)

      if (cats.length > 0) setSelectedCategory(cats[0].id)
    }
    fetchData()
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    toggleDarkModeUtil(newDarkMode)
  }

  // Lägg till kategori via ipc
  const addCategory = async (name) => {
    const newCat = await window.electronAPI.invoke("add-category", name)
    setCategories(prev => [...prev, newCat])
  }

  // Uppdatera kategori via ipc
  const updateCategory = async (id, name) => {
    const updatedCat = await window.electronAPI.invoke("update-category", { id, name })
    if (updatedCat) {
      setCategories(prev => prev.map(c => (c.id === id ? updatedCat : c)))
    }
  }

  // Radera kategori via ipc
  const deleteCategory = async (id) => {
            console.log(id)
    await window.electronAPI.invoke("delete-category", id)

    setCategories(prev => prev.filter(c => c._id !== id))
    setTasks(prev => prev.filter(t => t.categoryId !== id))
    if (selectedCategory === id) {
      setSelectedCategory(categories[0]?._id || null)
    }
  }

  // Lägg till uppgift via ipc
  const addTask = async (text) => {
    if (!selectedCategory) return
    const newTask = await window.electronAPI.invoke("add-task", { categoryId: selectedCategory, text })
    setTasks(prev => [...prev, newTask])
  }

  // Uppdatera uppgift via ipc
  const updateTask = async (id, text) => {
    const updatedTask = await window.electronAPI.invoke("update-task", { id, text })
    if (updatedTask) {
      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)))
    }
  }

  // Toggla uppgiftsstatus via ipc
  const toggleTaskCompletion = async (id) => {
    const toggledTask = await window.electronAPI.invoke("toggle-task-completion", id)
    if (toggledTask) {
      setTasks(prev => prev.map(t => (t.id === id ? toggledTask : t)))
    }
  }

  // Radera uppgift via ipc
  const deleteTask = async (id) => {
    await window.electronAPI.invoke("delete-task", id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const getTaskCount = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId && !task.completed).length
  }

  const getFilteredTasks = () => {
    return tasks.filter(
      task =>
        task.categoryId === selectedCategory &&
        (searchQuery === "" || task.text.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const getCurrentCategory = () => {
    return categories.find(c => c.id === selectedCategory) || { name: "Uppgifter", color: "#000000" }
  }

  return (
    <div className="flex h-screen transition-colors duration-300 dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-900">
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        addCategory={addCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        getTaskCount={getTaskCount}
      />
      <TaskArea
        currentCategory={getCurrentCategory()}
        filteredTasks={getFilteredTasks()}
        addTask={addTask}
        updateTask={updateTask}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
      />
    </div>
  )
}
