const { app } = require("electron");
const path = require("path");
const Datastore = require("nedb");
const fs = require("fs");
const logger = require("./logger");

const userDataDir = path.join(app.getPath("userData"), "Noot_save");

if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir);
}

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

const timestamp = new Date().toISOString();

// Funktioner för kategorier

function getCategories() {
  return new Promise((resolve, reject) => {
    categoriesDB.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

function addCategory(cat) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString();
    const categoryWithTimestamps = {
      ...cat,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    categoriesDB.insert(categoryWithTimestamps, (err, newDoc) => {
      if (err) reject(err);
      else resolve(newDoc);
    });
  });
}


function updateCategory(id, update) {
  return new Promise((resolve, reject) => {
    const updateWithTimestamp = {
      ...update,
      updatedAt: new Date().toISOString(),
    };

    categoriesDB.update(
      { _id: id },
      { $set: updateWithTimestamp },
      {},
      (err, numUpdated) => {
        if (err) reject(err);
        else resolve(numUpdated);
      }
    );
  });
}


function deleteCategory(id) {
  logger.info(`Deleting category with id: ${id}`);
  return new Promise((resolve, reject) => {
    categoriesDB.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        logger.error(`Error deleting category: ${err}`);
        reject(err);
      } else {
        logger.info(`Deleted categories: ${numRemoved}`);
        tasksDB.remove({ categoryId: id }, { multi: true }, (err2) => {
          if (err2) {
            logger.error(`Error deleting related tasks: ${err2}`);
            reject(err2);
          } else {
            logger.info(`Deleted related tasks`);
            resolve(numRemoved);
          }
        });
      }
    });
  });
}

function setSelectedCategory(categoryId) {
  return new Promise((resolve, reject) => {
    selectedCategoryDB.update(
      { _id: "selectedCategory" },
      { _id: "selectedCategory", categoryId },
      { upsert: true },
      (err, numUpdated) => {
        if (err) reject(err);
        else resolve(numUpdated);
      }
    );
  });
}

function getSelectedCategory() {
  return new Promise((resolve, reject) => {
    selectedCategoryDB.findOne({ _id: "selectedCategory" }, (err, doc) => {
      if (err) reject(err);
      else resolve(doc?.categoryId || null);
    });
  });
}

function clearSelectedCategory() {
  return new Promise((resolve, reject) => {
    selectedCategoryDB.remove({ _id: "selectedCategory" }, {}, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved);
    });
  });
}

// Funktioner för tasks

function getTasks() {
  return new Promise((resolve, reject) => {
    tasksDB.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

function addTask(task) {
  return new Promise((resolve, reject) => {
    tasksDB
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .exec((err, docs) => {
        if (err) return reject(err);

        // Defensive: treat null order as -1 so it doesn't break maxOrder calculation
        const maxOrder =
          docs.length > 0 && typeof docs[0].order === "number" && docs[0].order >= 0
            ? docs[0].order
            : -1;

        const timestamp = new Date().toISOString();
        const taskWithTimestampsAndOrder = {
          ...task,
          createdAt: timestamp,
          updatedAt: timestamp,
          order: maxOrder + 1,
        };

        tasksDB.insert(taskWithTimestampsAndOrder, (err2, newDoc) => {
          if (err2) return reject(err2);

          if (newDoc.categoryId) {
            categoriesDB.update(
              { _id: newDoc.categoryId },
              { $set: { updatedAt: new Date().toISOString() } },
              {},
              (catErr) => {
                if (catErr) return reject(catErr);
                resolve(newDoc);
              }
            );
          } else {
            resolve(newDoc);
          }
        });
      });
  });
}


function updateMultipleTasksOrder(tasks) {
  if (!Array.isArray(tasks)) {
    console.error("Expected an array of tasks but got:", tasks);
    throw new TypeError("Expected an array of tasks");
  }

  return Promise.all(
    tasks.map((task) => updateTask(task._id, { order: task.order }))
  );
}



function updateTask(id, update) {
  return new Promise((resolve, reject) => {
    const updateWithTimestamp = {
      ...update,
      updatedAt: new Date().toISOString(),
    };

    tasksDB.update({ _id: id }, { $set: updateWithTimestamp }, {}, (err, numUpdated) => {
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
    });
  });
}


function deleteTask(id) {
  return new Promise((resolve, reject) => {
    tasksDB.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved);
    });
  });
}

// Darkmode toggle

function setColorMode(mode) {
  return new Promise((resolve, reject) => {
    colorModeDB.update(
      { _id: "colorMode" },
      { _id: "colorMode", mode },
      { upsert: true },
      (err, numUpdated) => {
        if (err) reject(err);
        else resolve(numUpdated);
      }
    );
  });
}

function getColorMode() {
  return new Promise((resolve, reject) => {
    colorModeDB.findOne({ _id: "colorMode" }, (err, doc) => {
      if (err) reject(err);
      else resolve(doc?.mode || "light");
    });
  });
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getColorMode,
  setColorMode,
  getSelectedCategory,
  setSelectedCategory,
  clearSelectedCategory,
  updateMultipleTasksOrder
};
