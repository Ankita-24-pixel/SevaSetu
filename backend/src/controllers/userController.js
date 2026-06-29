const User = require('../models/User');
const Service = require('../models/Service'); // We need this to cache OSM data!
const nodemailer = require('nodemailer');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');

const toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { serviceId, serviceData } = req.body;

        let dbServiceId = serviceId;

        // LAZY-CACHING: If this came from OpenStreetMap (no MongoDB _id yet)
        if (serviceData && !serviceData._id) {
            // Check if someone else already favorited and cached this exact location
            let existingService = await Service.findOne({ 
                name: serviceData.name, 
                address: serviceData.address 
            });

            // If not, save it to MongoDB silently!
            if (!existingService) {
                existingService = await Service.create({
                    name: serviceData.name,
                    category: serviceData.category || "Service",
                    address: serviceData.address || "Mapped Location",
                    location: serviceData.location || { type: "Point", coordinates: [0, 0] },
                    phone: serviceData.phone || "",
                    website: serviceData.website || "",
                    description: "Live OpenStreetMap Data"
                });
            }
            // Use our newly created MongoDB _id for the user's favorites
            dbServiceId = existingService._id;
        }

        // Standard toggle logic
        const isFavorited = user.favorites.includes(dbServiceId);

        if (isFavorited) {
            user.favorites.pull(dbServiceId);
        } else {
            user.favorites.push(dbServiceId);
        }

        await user.save();

        res.status(200).json({ 
            message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
            isFavorited: !isFavorited 
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getMyFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "No account with that email found." });
        }

        // 1. Generate a random reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 2. Hash it and save it to the database (expires in 10 mins)
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // 3. Create the Reset URL for the frontend
        // Make sure this matches your React frontend port (usually 5173 or 3000)
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // 4. Send the Email using Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL_USERNAME, // Your Gmail address in .env
                pass: process.env.EMAIL_PASSWORD  // Your 16-character Gmail App Password in .env
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'SevaSetu Support <noreply@sevasetu.com>',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h3>You requested a password reset</h3>
                <p>Click the link below to set a new password. This link is valid for 10 minutes.</p>
                <a href="${resetUrl}" target="_blank">Reset Password Here</a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });

    } catch (error) {
        console.error(error);
        // If email fails, clear the token from database so they can try again
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
        }
        res.status(500).json({ message: "Email could not be sent", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        // 1. Hash the token from the URL to compare with the one saved in the database
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // 2. Find user by token AND make sure it hasn't expired yet
        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // 3. Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // 4. Clear the reset tokens from the database since they've been used
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


module.exports = { toggleFavorite, getMyFavorites, forgotPassword, resetPassword };