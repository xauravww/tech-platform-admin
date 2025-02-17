import mongoose from 'mongoose';

const SubServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  technologies: { type: [String], default: [] }, // Optional field
  description: { type: String, required: true },
});

const ServiceSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    description: { type: String, required: true },
    sub_services: { type: [SubServiceSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
