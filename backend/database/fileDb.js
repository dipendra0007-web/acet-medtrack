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

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}

function setNestedValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined || typeof current[part] !== 'object') {
      current[part] = {};
    }
    // Deep copy current[part] if it's an object to ensure we don't accidentally mutate shared references
    current[part] = { ...current[part] };
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

const FileDb = {
  find: (collection, query = {}) => {
    let items = readCollection(collection);
    return items.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined) {
          const value = getNestedValue(item, key);
          if (value !== query[key]) {
            return false;
          }
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
    
    // Deep clone to prevent any object reference mutation side effects
    let updatedDoc = JSON.parse(JSON.stringify(items[index]));
    
    const setObj = update.$set || update;
    for (let key in setObj) {
      if (key === '$set') continue;
      setNestedValue(updatedDoc, key, setObj[key]);
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
        const value = getNestedValue(item, key);
        if (value !== query[key]) return false;
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
        const value = getNestedValue(item, key);
        if (value === query[key]) return false;
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
