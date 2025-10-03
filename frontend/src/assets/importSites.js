// A script to insert heritage site data into a MongoDB collection.

// 1. Configure your database and collection names.
const dbName = 'heritageSites';
const collectionName = 'sites';

// 2. Select the database.
use(dbName);

// 3. The data to be inserted.
const sitesData = [
    // ... Paste the complete JSON array from above here ...
];

// 4. Insert the data.
try {
  // Optional: Clear the collection first to prevent duplicates on re-runs.
  db.getCollection(collectionName).deleteMany({});
  
  const result = db.getCollection(collectionName).insertMany(sitesData);
  print(`✅ Successfully inserted ${result.insertedIds.length} documents into '${collectionName}'.`);
} catch (e) {
  print(`❌ An error occurred: ${e}`);
}