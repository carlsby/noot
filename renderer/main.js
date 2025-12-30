const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db.js");

// initializes fonts on startup
db.initializeFonts();

// color generator (for random colors on categories)
function randomColor() {
  const c = () =>
    Math.floor(Math.random() * 129 + 64)
      .toString(16)
      .padStart(2, "0");
  return `#${c()}${c()}${c()}`;
}

// IPC Handlers
// everything that's being sent to the frontend

function setupIpcHandlers() {
  // categories
  ipcMain.handle("get-categories", () => db.getCategories());
  ipcMain.handle("add-category", (_, name) => {
    return db.addCategory({ name, color: randomColor() });
  });
  ipcMain.handle("add-category-to-folder", (_, { name, folderId }) => {
    return db.addCategoryToFolder({ name }, folderId);
  });
  ipcMain.handle("update-category", (_, { id, name }) => {
    return db.updateCategory(id, { name });
  });
  ipcMain.handle("delete-category", (_, id) => db.deleteCategory(id));
  ipcMain.handle("set-selected-category", (_, categoryId) =>
    db.setSelectedCategory(categoryId)
  );
  ipcMain.handle("get-selected-category", () => db.getSelectedCategory());
  ipcMain.handle("clear-selected-category", () => db.clearSelectedCategory());
  ipcMain.handle("update-categories-order", (_, categories) =>
    db.updateMultipleCategoriesOrder(categories)
  );

  // folders
  ipcMain.handle("get-folders", () => db.getFolders());
  ipcMain.handle("add-folder", (_, name) => db.addFolder({ name }));
  ipcMain.handle("update-folder", (_, { id, name }) => {
    return db.updateFolder(id, { name });
  });
  ipcMain.handle("delete-folder", (_, id) => db.deleteFolder(id));
  ipcMain.handle("move-category-to-folder", (_, { categoryId, folderId }) =>
    db.moveCategoryToFolder(categoryId, folderId)
  );
  ipcMain.handle("move-folder", (_, payload) =>
    db.moveFolder(payload.folderId, payload.parentId, payload.order)
  );

  // tasks
  ipcMain.handle("get-tasks", () => db.getTasks());
  ipcMain.handle("add-task", (_, { categoryId, text }) => {
    return db.addTask({ categoryId, text, completed: false });
  });
  ipcMain.handle("update-task", async (_, { id, text }) => {
    await db.updateTask(id, { text });
    return await db.getTasks();
  });
  ipcMain.handle("delete-task", (_, id) => db.deleteTask(id));
  ipcMain.handle("update-tasks-order", (_, tasks) =>
    db.updateMultipleTasksOrder(tasks)
  );

  ipcMain.handle("toggle-task-completion", async (_, id) => {
    const tasks = await db.getTasks();
    const task = tasks.find((t) => t._id === id);
    if (!task) return null;

    const newCompleted = !task.completed;
    const targetGroup = tasks.filter((t) => t.completed === newCompleted);
    const maxOrder = targetGroup.length
      ? Math.max(...targetGroup.map((t) => t.order))
      : -1;

    await db.updateTask(id, { completed: newCompleted, order: maxOrder + 1 });
    const updatedTask = (await db.getTasks()).find((t) => t._id === id);
    return updatedTask;
  });

  // colors
  ipcMain.handle("get-color-mode", () => db.getColorMode());
  ipcMain.handle("set-color-mode", (_, mode) => db.setColorMode(mode));

  // fonts
  ipcMain.handle("get-all-fonts", () => db.getAllFonts());
  ipcMain.handle("get-default-font", () => db.getDefaultFont());
  ipcMain.handle("set-default-font", async (_, fontId) => {
    await db.setDefaultFontById(fontId);
    return db.getDefaultFont();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  // loads correct file, depending on devmode or build
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
