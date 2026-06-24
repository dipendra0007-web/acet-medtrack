const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading collection ${collection}:`, error);
    return [];
  }
}

function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing collection ${collection}:`, error);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const FileDb = {
  find: (collection, query = {}) => {
    let items = readCollection(collection);
    return items.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },

  findOne: (collection, query = {}) => {
    const items = FileDb.find(collection, query);
    return items.length > 0 ? items[0] : null;
  },

  findById: (collection, id) => {
    const items = readCollection(collection);
    return items.find(item => item._id === id || item.id === id) || null;
  },

  create: (collection, doc) => {
    const items = readCollection(collection);
    const newDoc = {
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    writeCollection(collection, items);
    return newDoc;
  },

  findByIdAndUpdate: (collection, id, update, options = {}) => {
    const items = readCollection(collection);
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    let updatedDoc = { ...items[index] };
    if (update.$set) {
      updatedDoc = { ...updatedDoc, ...update.$set };
    } else {
      updatedDoc = { ...updatedDoc, ...update };
    }
    updatedDoc.updatedAt = new Date().toISOString();
    
    items[index] = updatedDoc;
    writeCollection(collection, items);
    return updatedDoc;
  },

  deleteOne: (collection, query) => {
    const items = readCollection(collection);
    const index = items.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index === -1) return false;
    items.splice(index, 1);
    writeCollection(collection, items);
    return true;
  },

  deleteMany: (collection, query) => {
    const items = readCollection(collection);
    const beforeCount = items.length;
    const remaining = items.filter(item => {
      for (let key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    writeCollection(collection, remaining);
    return { deletedCount: beforeCount - remaining.length };
  },

  countDocuments: (collection, query = {}) => {
    return FileDb.find(collection, query).length;
  }
};

module.exports = FileDb;
