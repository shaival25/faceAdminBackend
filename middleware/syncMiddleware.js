const { addToQueue } = require("../services/syncQueue");

module.exports = function (schema, atlasModelName) {
  schema.pre("save", function (doc) {
    console.log("PRE SAVE CALLED");
    addToQueue("update", atlasModelName, doc.toObject());
  });

  schema.pre("remove", function (doc) {
    console.log("PRE REMOVE CALLED");
    addToQueue("delete", atlasModelName, doc.toObject());
  });
};
