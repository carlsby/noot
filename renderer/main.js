const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db.js");

function randomColor() {
  const colors = [
    "#FF9F40",
    "#5E9EFF",
    "#66D4CF",
    "#FF6B6B",
    "#B39DDB",
    "#FFCC80",
    "#81C784",
    "#4FC3F7",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function setupIpcHandlers() {
  ipcMain.handle("get-categories", async () => {
    return await db.getCategories();
  });

  ipcMain.handle("add-category", async (_, name) => {
    const newCategory = { name, color: randomColor() };
    return await db.addCategory(newCategory);
  });

  ipcMain.handle("update-category", async (_, { id, name }) => {
    await db.updateCategory(id, { name });
    return await db.getCategories();
  });

  ipcMain.handle("delete-category", async (_, id) => {
    await db.deleteCategory(id);
    return true;
  });

  ipcMain.handle("get-tasks", async () => {
    return await db.getTasks();
  });

  ipcMain.handle("add-task", async (_, { categoryId, text }) => {
    const newTask = { categoryId, text, completed: false };
    return await db.addTask(newTask);
  });

  ipcMain.handle("update-task", async (_, { id, text }) => {
    await db.updateTask(id, { text });
    return await db.getTasks();
  });

  ipcMain.handle("toggle-task-completion", async (_, id) => {
    const tasks = await db.getTasks();
    const task = tasks.find((t) => t._id === id);
    if (task) {
      await db.updateTask(id, { completed: !task.completed });
    }
    return await db.getTasks();
  });

  ipcMain.handle("delete-task", async (_, id) => {
    await db.deleteTask(id);
    return true;
  });

  ipcMain.handle("get-color-mode", async () => {
    return await db.getColorMode();
  });

  ipcMain.handle("set-color-mode", async (event, mode) => {
    return await db.setColorMode(mode);
  });

  ipcMain.handle("set-selected-category", async (event, categoryId) => {
    return await db.setSelectedCategory(categoryId);
  });

  ipcMain.handle("get-selected-category", async () => {
    return await db.getSelectedCategory();
  });

  ipcMain.handle("clear-selected-category", async () => {
    return await db.clearSelectedCategory();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  if (app.isPackaged) {
    win.loadFile(
      path.resolve(__dirname, "..", "frontend", "dist", "index.html")
    );
  } else {
    win.loadURL("http://localhost:5173");
  }
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
