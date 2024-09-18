const mongooseAtlas = new (require('mongoose')).Mongoose(); // Create a new Mongoose instance
const config = require('./config');

// Create a connection to MongoDB Atlas using the separate Mongoose instance
const atlasConnection = mongooseAtlas.createConnection(config.atlasURI, {
});

atlasConnection.on('error', (err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

atlasConnection.once('open', () => {
    console.log('Successfully connected to MongoDB Atlas');
});

// Import models
const bnyGeneralSchema = require('../models/bnyGeneral').schema;
const busSchema = require('../models/bus').schema;
const feedbackSchema = require('../models/feedback').schema;
const personCounterSchema = require('../models/personCounter').schema;
const sipCalcSchema = require('../models/sipCalc').schema;
const userAnalyticsSchema = require('../models/userAnalytics').schema;
const heatMapSchema = require('../models/heatMap').schema;

// Register Atlas models using the new Mongoose instance and the Atlas connection
const AtlasBnyGeneral = atlasConnection.model('BnyGeneral', bnyGeneralSchema, 'bnygenerals');
const AtlasBus = atlasConnection.model('Bus', busSchema, 'buses');
const AtlasFeedback = atlasConnection.model('Feedback', feedbackSchema, 'feedbacks');
const AtlasPersonCounter = atlasConnection.model('PersonCounter', personCounterSchema, 'personCounters');
const AtlasSipCalc = atlasConnection.model('SipCalc', sipCalcSchema, 'sipCalcs');
const AtlasUserAnalytics = atlasConnection.model('UserAnalytics', userAnalyticsSchema, 'userAnalytics');
const AtlasHeatMap = atlasConnection.model('HeatMap', heatMapSchema, 'heatMaps');

// Export the models and the atlas connection (if needed)
module.exports = {
    AtlasBnyGeneral,
    AtlasBus,
    AtlasFeedback,
    AtlasPersonCounter,
    AtlasSipCalc,
    AtlasUserAnalytics,
    AtlasHeatMap,
    atlasConnection  // Only if you need to use the connection directly somewhere
};
