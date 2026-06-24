const mongoose = require('mongoose');
const FileDb = require('../database/fileDb');

let useMongo = false;

function setUseMongo(val) {
  useMongo = val;
  console.log(`[Database] Mode updated: ${useMongo ? 'MongoDB (Mongoose)' : 'Local File Storage (JSON)'}`);
}

function getUseMongo() {
  return useMongo;
}

function createModel(modelName, mongooseSchema) {
  let MongoModel;
  try {
    MongoModel = mongoose.model(modelName);
  } catch (e) {
    MongoModel = mongoose.model(modelName, mongooseSchema);
  }

  const collectionName = modelName.toLowerCase() + 's';

  return {
    find: async (query = {}) => {
      if (useMongo) {
        return await MongoModel.find(query);
      } else {
        return FileDb.find(collectionName, query);
      }
    },
    findOne: async (query = {}) => {
      if (useMongo) {
        return await MongoModel.findOne(query);
      } else {
        return FileDb.findOne(collectionName, query);
      }
    },
    findById: async (id) => {
      if (useMongo) {
        try {
          return await MongoModel.findById(id);
        } catch (e) {
          return null; // Return null on invalid ObjectIds
        }
      } else {
        return FileDb.findById(collectionName, id);
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongoModel.create(data);
      } else {
        return FileDb.create(collectionName, data);
      }
    },
    findByIdAndUpdate: async (id, update, options = { new: true }) => {
      if (useMongo) {
        try {
          return await MongoModel.findByIdAndUpdate(id, update, options);
        } catch (e) {
          return null;
        }
      } else {
        return FileDb.findByIdAndUpdate(collectionName, id, update, options);
      }
    },
    deleteOne: async (query) => {
      if (useMongo) {
        return await MongoModel.deleteOne(query);
      } else {
        const success = FileDb.deleteOne(collectionName, query);
        return { deletedCount: success ? 1 : 0 };
      }
    },
    deleteMany: async (query) => {
      if (useMongo) {
        return await MongoModel.deleteMany(query);
      } else {
        return FileDb.deleteMany(collectionName, query);
      }
    },
    countDocuments: async (query = {}) => {
      if (useMongo) {
        return await MongoModel.countDocuments(query);
      } else {
        return FileDb.countDocuments(collectionName, query);
      }
    },
    getMongoModel: () => MongoModel
  };
}

module.exports = {
  createModel,
  setUseMongo,
  getUseMongo
};
