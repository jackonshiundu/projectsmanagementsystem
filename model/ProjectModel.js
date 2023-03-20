const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timetaken: {
    type: String,
    enum: [
      '1-5 days',
      '1 week',
      '2 weeks',
      '3 weeks',
      '4 weeks',
      '1 Month',
      '2 Months',
    ],
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  status: {
    type: String,
    enum: [
      'Idea Mapping',
      'Not Started',
      'In progress',
      'Completed',
      'Not Sure',
    ],
  },
});

module.exports = mongoose.model('ProjectModel', ProjectSchema);
