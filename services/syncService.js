const { getUnsyncedOperations, markAsSynced } = require('./syncQueue');
const atlasDB = require('../config/atlasDB'); // This contains the Atlas models only
const { checkInternet } = require('../helpers/internetHelper');
const mongoose = require('mongoose'); // For ObjectId conversion only

// Function to sync a document to MongoDB Atlas
async function syncDocumentToAtlas(atlasModel, localDoc) {
    try {
        if (typeof localDoc._id === 'string') {
            localDoc._id = mongoose.Types.ObjectId(localDoc._id);
        }
        const result = await atlasModel.updateOne(
            { _id: localDoc._id },
            localDoc,
            { upsert: true }
        );
        console.log(`Synced document with _id: ${localDoc._id} to Atlas. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, UpsertedId: ${result.upsertedId}`);
    } catch (error) {
        console.error('Failed to sync document to Atlas:', error);
        throw error;
    }
}

// Function to process the sync queue
async function processSyncQueue() {
    const unsyncedOperations = await getUnsyncedOperations();
    const isOnline = await checkInternet();

    if (isOnline && unsyncedOperations.length > 0) {
        console.log('Started Syncing queued operations to Atlas...');
        for (const queueItem of unsyncedOperations) {
            const { operation, modelName, document, _id } = queueItem;

            let atlasModel;
            try {
                // Convert modelName to match Atlas model name format
                const modelKey = `Atlas${modelName.charAt(0).toUpperCase() + modelName.slice(1)}`;
                atlasModel = atlasDB[modelKey];
                if (!atlasModel) {
                    throw new Error(`Model ${modelKey} not found in Atlas DB.`);
                }
            } catch (error) {
                console.error(`Model ${modelName} not found in Atlas DB.`);
                continue;
            }

            try {
                if (operation === 'update') {
                    await syncDocumentToAtlas(atlasModel, document);
                } else if (operation === 'delete') {
                    await deleteDocumentFromAtlas(atlasModel, document);
                }
                await markAsSynced(_id);
            } catch (error) {
                console.error('Error during sync operation:', error);
            }
        }
    } else {
        console.log('Offline or no operations to sync.');
    }
}

module.exports = { processSyncQueue };
