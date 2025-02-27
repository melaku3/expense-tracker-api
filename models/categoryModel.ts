import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    type: {type: String, enum: ['income', 'expense'], required: true},
    colorCode: {type: String, default: '#000000'}

}, { timestamps: true });

const categoryModel = mongoose.models.category || mongoose.model('category', categorySchema);
export default categoryModel;
