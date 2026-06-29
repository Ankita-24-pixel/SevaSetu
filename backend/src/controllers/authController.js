const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (req.body.confirmPassword && password !== req.body.confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Fail gracefully if JWT_SECRET is missing!
        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL ERROR: JWT_SECRET is missing from your .env file!");
            return res.status(500).json({ message: "Server configuration error. Missing JWT_SECRET." });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role || 'user' // Added a fallback just in case role is empty
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        // THIS WILL PRINT THE EXACT REASON TO YOUR BACKEND TERMINAL
        console.error("Registration Crash Details:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL ERROR: JWT_SECRET is missing from your .env file!");
            return res.status(500).json({ message: "Server configuration error. Missing JWT_SECRET." });
        }
        
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role || 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            }
        });
    } catch (error) {
        console.error("Login Crash Details:", error);
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error("Profile Crash Details:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login, getProfile };