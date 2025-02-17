import mongoose from 'mongoose';

const ResearchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  doi: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Research || mongoose.model('Research', ResearchSchema);