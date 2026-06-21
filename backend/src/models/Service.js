const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    description: String,

    serviceType: {
        type: String,
        enum: ["GOVERNMENT", "PRIVATE"],
        required: true
    },

    category: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: String,

    state: String,

    phone: String,

    website: String,

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
},
{
    timestamps: true
});

serviceSchema.index({
    location: "2dsphere"
});

module.exports = mongoose.model(
    "Service",
    serviceSchema
);