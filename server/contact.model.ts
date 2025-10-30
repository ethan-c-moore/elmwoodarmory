// contact.model.ts
import mongoose from "mongoose";
import { Contact } from "./contact";

const contactSchema = new mongoose.Schema<Contact>({
    contactInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        contactValue: { type: String, required: true },
        contactType: { type: String, enum: ["phone", "email"], required: true }
    },
    request: {
        requestType: {
            type: String,
            enum: ["commission", "repair", "other"],
            required: true
        },
        message: { type: String, required: true },
        pieceType: {
            type: String,
            enum: ["tack", "armor", "accessory", "other"],
            required: false
        }
    },
    contactDate: { type: Date, required: true, default: Date.now },
    status: [{
        code: {
            type: String,
            enum: ["new", "pending", "scheduling", "scheduled", "in-progress", "update", "complete", "canceled"],
            required: true
        },
        upDate: { type: Date, required: true },
        message: { type: String, required: true },
        statusOwner: { type: String, required: true }
    }],
    shopRef: { type: Number, required: false },
    shopAttribute: [{
        name: { type: String, required: true },
        value: { type: String, required: true }
    }]
});

const ContactModel = mongoose.model<Contact>("Contact", contactSchema);

export default ContactModel;
