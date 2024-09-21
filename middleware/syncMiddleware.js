const { addToQueue } = require("../services/syncQueue");

module.exports = function (schema, atlasModelName) {
    schema.post('save', function (doc) {
        console.log(`Post-save hook triggered for ${atlasModelName} with document: ${doc._id}`);
        addToQueue('update', atlasModelName, doc.toObject());
    });

    schema.post('remove', function (doc) {
        console.log(`Post-remove hook triggered for ${atlasModelName} with document: ${doc._id}`);
        addToQueue('delete', atlasModelName, doc.toObject());
    });

    schema.post('update', function (doc) {
        console.log(`Post-update hook triggered for ${atlasModelName} with document: ${doc._id}`);
        addToQueue('update', atlasModelName, doc.toObject());
    });
};
