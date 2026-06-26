/**
 * MongoDB Seed Script - Syncs JSON local data to MongoDB
 * Run with: node seedMongo.js
 */
const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('./backend/node_modules/dotenv');
dotenv.config({ path: './backend/.env' });

const DATA_DIR = './backend/data';

// Generic schema that accepts any fields
const genericSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const COLLECTIONS = ['users', 'appointments', 'prescriptions', 'medicinereminders', 'orders', 'shopitems', 'systemlogs', 'notifications', 'reviews', 'galleries', 'teammembers', 'slides', 'appreleases', 'contacts'];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  for (const collection of COLLECTIONS) {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    if (!fs.existsSync(filePath)) continue;

    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    } catch (e) {
      console.log(`⚠️  Skipping ${collection} - parse error`);
      continue;
    }

    if (!data.length) { console.log(`⚪ ${collection}: empty, skipping`); continue; }

    const modelName = collection.charAt(0).toUpperCase() + collection.slice(1);
    let Model;
    try { Model = mongoose.model(modelName); }
    catch (e) { Model = mongoose.model(modelName, genericSchema); }

    // For users: re-hash passwords if they are plain text (bcrypt hashes start with $2)
    if (collection === 'users') {
      for (const item of data) {
        if (item.password && !item.password.startsWith('$2')) {
          item.password = await bcrypt.hash(item.password, 10);
        }
      }
    }

    // Upsert each item by _id to avoid duplicates
    let inserted = 0, updated = 0;
    for (const item of data) {
      const { _id, ...rest } = item;
      const result = await Model.findOneAndUpdate(
        { $or: [{ _id: _id }, { email: item.email }].filter(Boolean) },
        { ...rest },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).catch(() => null);
      if (result) { result.isNew ? inserted++ : updated++; }
    }
    console.log(`✅ ${collection}: ${data.length} records processed`);
  }

  console.log('\n🎉 Seed complete!');
  await mongoose.disconnect();
}

main().catch(e => { console.error('❌ Seed failed:', e.message); process.exit(1); });
