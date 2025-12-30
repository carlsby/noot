const { app } = require("electron");
const path = require("path");
const Datastore = require("@seald-io/nedb");
const fs = require("fs");
const logger = require("./logger");

// where the database data will be saved (in this case in %appdata%)
const userDataDir = path.join(app.getPath("userData"), "Noot_save");
if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir);

const foldersDB = new Datastore({
  filename: path.join(userDataDir, "folders.db"),
  autoload: true,
});
const categoriesDB = new Datastore({
  filename: path.join(userDataDir, "categories.db"),
  autoload: true,
});
const tasksDB = new Datastore({
  filename: path.join(userDataDir, "tasks.db"),
  autoload: true,
});
const colorModeDB = new Datastore({
  filename: path.join(userDataDir, "color.db"),
  autoload: true,
});
const selectedCategoryDB = new Datastore({
  filename: path.join(userDataDir, "selectedCategory.db"),
  autoload: true,
});
const fontDB = new Datastore({
  filename: path.join(userDataDir, "fonts.db"),
  autoload: true,
});

// array of fonts (more can be added in index.html)
const fonts = [
  {
    _id: "font1",
    name: "Lexend",
    css: "'Lexend', sans-serif",
    isDefault: true,
  },
  { _id: "font2", name: "Inter", css: "'Inter', sans-serif", isDefault: false },
  {
    _id: "font3",
    name: "Manrope",
    css: "'Manrope', sans-serif",
    isDefault: false,
  },
  {
    _id: "font4",
    name: "Urbanist",
    css: "'Urbanist', sans-serif",
    isDefault: false,
  },
  { _id: "font5", name: "Rubik", css: "'Rubik', sans-serif", isDefault: false },
  {
    _id: "font6",
    name: "Space Grotesk",
    css: "'Space Grotesk', sans-serif",
    isDefault: false,
  },
  {
    _id: "font7",
    name: "DM Sans",
    css: "'DM Sans', sans-serif",
    isDefault: false,
  },
  {
    _id: "font8",
    name: "Outfit",
    css: "'Outfit', sans-serif",
    isDefault: false,
  },
  { _id: "font9", name: "Sora", css: "'Sora', sans-serif", isDefault: false },
  {
    _id: "font10",
    name: "Cabinet Grotesk",
    css: "'Cabinet Grotesk', sans-serif",
    isDefault: false,
  },
];

// initialize fonts on startup
function initializeFonts() {
  fontDB.count({}, (err, count) => {
    if (err) return console.error("Error initializing fonts:", err);
    if (count === 0)
      fontDB.insert(
        fonts,
        (insertErr) => insertErr && console.error(insertErr)
      );
  });
}

// gets all categories
function getCategories() {
  return new Promise((resolve, reject) => {
    categoriesDB.find({}, (err, docs) => (err ? reject(err) : resolve(docs)));
  });
}

// adds new category
function addCategory(cat) {
  const timestamp = new Date().toISOString();

  if (!cat.folderId) {
    return new Promise((resolve, reject) => {
      categoriesDB.insert(
        {
          ...cat,
          folderId: null,
          order: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        (err, doc) => (err ? reject(err) : resolve(doc))
      );
    });
  }

  return new Promise((resolve, reject) => {
    categoriesDB
      .find({ folderId: cat.folderId })
      .sort({ order: -1 })
      .limit(1)
      .exec((err, docs) => {
        if (err) return reject(err);

        const maxOrder =
          docs.length && typeof docs[0].order === "number" ? docs[0].order : -1;

        categoriesDB.insert(
          {
            ...cat,
            folderId: cat.folderId,
            order: maxOrder + 1,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          (err2, doc) => (err2 ? reject(err2) : resolve(doc))
        );
      });
  });
}

// add category to specific folder
function addCategoryToFolder(cat, folderId) {
  const timestamp = new Date().toISOString();

  return new Promise((resolve, reject) => {
    categoriesDB
      .find({ folderId })
      .sort({ order: -1 })
      .limit(1)
      .exec((err, docs) => {
        if (err) return reject(err);

        const maxOrder =
          docs.length && typeof docs[0].order === "number"
            ? docs[0].order
            : -1;

        categoriesDB.insert(
          {
            name: cat.name,
            folderId,
            order: maxOrder + 1,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          (err2, doc) => (err2 ? reject(err2) : resolve(doc))
        );
      });
  });
}

// updates selected category
function updateCategory(id, update) {
  const updateWithTimestamp = {
    ...update,
    updatedAt: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    categoriesDB.update(
      { _id: id },
      { $set: updateWithTimestamp },
      {},
      (err, numUpdated) => (err ? reject(err) : resolve(numUpdated))
    );
  });
}

// updates order of multiple categories
function updateMultipleCategoriesOrder(categories) {
  if (!Array.isArray(categories))
    throw new TypeError("Expected array of categories");

  return Promise.all(
    categories.map((c) => updateCategory(c._id, { order: c.order }))
  );
}

// deletes selected category
function deleteCategory(id) {
  logger.info(`Deleting category: ${id}`);
  return new Promise((resolve, reject) => {
    categoriesDB.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) return reject(err);
      tasksDB.remove({ categoryId: id }, { multi: true }, (err2) =>
        err2 ? reject(err2) : resolve(numRemoved)
      );
    });
  });
}

// sets selected category
function setSelectedCategory(categoryId) {
  return new Promise((resolve, reject) => {
    selectedCategoryDB.update(
      { _id: "selectedCategory" },
      { _id: "selectedCategory", categoryId },
      { upsert: true },
      (err, numUpdated) => (err ? reject(err) : resolve(numUpdated))
    );
  });
}

// gets last selected category on startup (remembers users last viewed category)
function getSelectedCategory() {
  return new Promise((resolve, reject) => {
    selectedCategoryDB.findOne({ _id: "selectedCategory" }, (err, doc) =>
      err ? reject(err) : resolve(doc?.categoryId || null)
    );
  });
}

// clears selected category
function clearSelectedCategory() {
  return new Promise((resolve, reject) => {
    selectedCategoryDB.remove(
      { _id: "selectedCategory" },
      {},
      (err, numRemoved) => (err ? reject(err) : resolve(numRemoved))
    );
  });
}

// add a folder
function addFolder(folder) {
  const timestamp = new Date().toISOString();

  return new Promise((resolve, reject) => {
    foldersDB
      .find({ parentId: folder.parentId ?? null })
      .sort({ order: -1 })
      .limit(1)
      .exec((err, docs) => {
        if (err) return reject(err);

        const maxOrder =
          docs.length && typeof docs[0].order === "number"
            ? docs[0].order
            : -1;

        foldersDB.insert(
          {
            name: folder.name,
            parentId: folder.parentId ?? null,
            order: maxOrder + 1,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          (err2, doc) => (err2 ? reject(err2) : resolve(doc))
        );
      });
  });
}

// updates selected folder
function updateFolder(id, update) {
  const updateWithTimestamp = {
    ...update,
    updatedAt: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    foldersDB.update(
      { _id: id },
      { $set: updateWithTimestamp },
      {},
      (err, numUpdated) => (err ? reject(err) : resolve(numUpdated))
    );
  });
}

// delete a folder
function deleteFolder(id) {
  return new Promise((resolve, reject) => {
    // sets folderId to null for all categories to not remove them
    categoriesDB.update(
      { folderId: id },
      { $set: { folderId: null, order: null } },
      { multi: true },
      (err) => {
        if (err) return reject(err);

        // after all folderIds for categories set to null remove folder
        foldersDB.remove({ _id: id }, {}, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      }
    );
  });
}

// moves folder
async function moveFolder(folderId, parentId, order = null) {
  if (order === null) {
    const docs = await new Promise((res, rej) => {
      foldersDB
        .find({ parentId })
        .sort({ order: -1 })
        .limit(1)
        .exec((err, docs) => (err ? rej(err) : res(docs)));
    });

    order =
      docs.length && typeof docs[0].order === "number"
        ? docs[0].order + 1
        : 0;
  }

  return updateFolder(folderId, { parentId, order });
}

// move category into a folder
async function moveCategoryToFolder(categoryId, folderId, order = null) {
  if (!folderId) {
    // moving to root, reset order
    return updateCategory(categoryId, { folderId: null, order });
  }

  if (order === null) {
    const docs = await new Promise((res, rej) => {
      categoriesDB
        .find({ folderId })
        .sort({ order: -1 })
        .limit(1)
        .exec((err, docs) => (err ? rej(err) : res(docs)));
    });
    order = docs.length && typeof docs[0].order === "number" ? docs[0].order + 1 : 0;
  }

  return updateCategory(categoryId, { folderId, order });
}

// get all folders
function getFolders() {
  return new Promise((resolve, reject) =>
    foldersDB.find({}, (err, docs) => (err ? reject(err) : resolve(docs)))
  );
}

// get all available tasks from DB
function getTasks() {
  return new Promise((resolve, reject) =>
    tasksDB.find({}, (err, docs) => (err ? reject(err) : resolve(docs)))
  );
}

// adds new task
function addTask(task) {
  return new Promise((resolve, reject) => {
    tasksDB
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .exec((err, docs) => {
        if (err) return reject(err);
        const maxOrder =
          docs.length && typeof docs[0].order === "number" ? docs[0].order : -1;
        const timestamp = new Date().toISOString();
        const taskDoc = {
          ...task,
          createdAt: timestamp,
          updatedAt: timestamp,
          order: maxOrder + 1,
        };

        tasksDB.insert(taskDoc, (err2, newDoc) => {
          if (err2) return reject(err2);

          if (newDoc.categoryId) {
            categoriesDB.update(
              { _id: newDoc.categoryId },
              { $set: { updatedAt: timestamp } },
              {},
              (catErr) => {
                if (catErr) return reject(catErr);
                resolve(newDoc);
              }
            );
          } else resolve(newDoc);
        });
      });
  });
}

// updates delected task
function updateTask(id, update) {
  return new Promise((resolve, reject) => {
    const updateWithTimestamp = {
      ...update,
      updatedAt: new Date().toISOString(),
    };

    tasksDB.update(
      { _id: id },
      { $set: updateWithTimestamp },
      {},
      (err, numUpdated) => {
        if (err) return reject(err);

        if (update.categoryId) {
          categoriesDB.update(
            { _id: update.categoryId },
            { $set: { updatedAt: new Date().toISOString() } },
            {},
            (catErr) => {
              if (catErr) return reject(catErr);
              resolve(numUpdated);
            }
          );
        } else {
          resolve(numUpdated);
        }
      }
    );
  });
}

// deletes selected task
function deleteTask(id) {
  return new Promise((resolve, reject) =>
    tasksDB.remove({ _id: id }, {}, (err, numRemoved) =>
      err ? reject(err) : resolve(numRemoved)
    )
  );
}

// updates order of multiple categories (same folder only)
function updateMultipleTasksOrder(tasks) {
  if (!Array.isArray(tasks)) throw new TypeError("Expected array of tasks");
  return Promise.all(tasks.map((t) => updateTask(t._id, { order: t.order })));
}

// colors
function setColorMode(mode) {
  return new Promise((resolve, reject) => {
    colorModeDB.update(
      { _id: "colorMode" },
      { _id: "colorMode", mode },
      { upsert: true },
      (err, numUpdated) => (err ? reject(err) : resolve(numUpdated))
    );
  });
}

function getColorMode() {
  return new Promise((resolve, reject) => {
    colorModeDB.findOne({ _id: "colorMode" }, (err, doc) =>
      err ? reject(err) : resolve(doc?.mode || "light")
    );
  });
}

// fonts
function getAllFonts() {
  return new Promise((res, rej) =>
    fontDB.find({}, (err, docs) => (err ? rej(err) : res(docs)))
  );
}
function getDefaultFont() {
  return new Promise((res, rej) =>
    fontDB.findOne({ isDefault: true }, (err, doc) =>
      err ? rej(err) : res(doc)
    )
  );
}
function setDefaultFontById(fontId) {
  return new Promise((resolve, reject) => {
    fontDB.update(
      { isDefault: true },
      { $set: { isDefault: false } },
      { multi: true },
      (err) => {
        if (err) return reject(err);
        fontDB.update(
          { _id: fontId },
          { $set: { isDefault: true } },
          {},
          (err2, numUpdated) => (err2 ? reject(err2) : resolve(numUpdated))
        );
      }
    );
  });
}

// exports to main.js
module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  updateMultipleTasksOrder,
  getColorMode,
  setColorMode,
  getSelectedCategory,
  setSelectedCategory,
  clearSelectedCategory,
  getAllFonts,
  getDefaultFont,
  setDefaultFontById,
  initializeFonts,
  addFolder,
  deleteFolder,
  moveCategoryToFolder,
  getFolders,
  updateFolder,
  updateMultipleCategoriesOrder,
  addCategoryToFolder
};
