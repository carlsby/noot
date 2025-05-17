const path = require('path')
const Datastore = require('nedb')
const logger = require('./logger');

// Skapa data-mappen om den inte finns (lägg till fs)
const fs = require('fs')
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

const categoriesDB = new Datastore({ filename: path.join(dataDir, 'categories.db'), autoload: true })
const tasksDB = new Datastore({ filename: path.join(dataDir, 'tasks.db'), autoload: true })

// Funktioner för kategorier

function getCategories() {
  return new Promise((resolve, reject) => {
    categoriesDB.find({}, (err, docs) => {
      if (err) reject(err)
      else resolve(docs)
    })
  })
}

function addCategory(cat) {
  return new Promise((resolve, reject) => {
    categoriesDB.insert(cat, (err, newDoc) => {
      if (err) reject(err)
      else resolve(newDoc)
    })
  })
}

function updateCategory(id, update) {
  return new Promise((resolve, reject) => {
    categoriesDB.update({ _id: id }, { $set: update }, {}, (err, numUpdated) => {
      if (err) reject(err)
      else resolve(numUpdated)
    })
  })
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


// Funktioner för tasks

function getTasks() {
  return new Promise((resolve, reject) => {
    tasksDB.find({}, (err, docs) => {
      if (err) reject(err)
      else resolve(docs)
    })
  })
}

function addTask(task) {
  return new Promise((resolve, reject) => {
    tasksDB.insert(task, (err, newDoc) => {
      if (err) reject(err)
      else resolve(newDoc)
    })
  })
}

function updateTask(id, update) {
  return new Promise((resolve, reject) => {
    tasksDB.update({ _id: id }, { $set: update }, {}, (err, numUpdated) => {
      if (err) reject(err)
      else resolve(numUpdated)
    })
  })
}

function deleteTask(id) {
  return new Promise((resolve, reject) => {
    tasksDB.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) reject(err)
      else resolve(numRemoved)
    })
  })
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
}
