import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import User from "../models/user.js";
import sequelize from "../utils/db.js";
import JWT from 'jsonwebtoken';

const JWT_SECRET = "RIEURVK12345678FDJKFJDI";
// Function to validate permissions
const parsePermissions = (permissions) => {
    try {
        return typeof permissions === "string" ? JSON.parse(permissions) : permissions;
    } catch (error) {
        throw new Error("Invalid JSON format for permissions");
    }
};

// Function to validate mobile number
const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};


export const createUser = async (req, res) => {
    const { userName, mobile, email, password, permissions } = req.body;
    console.log(req.body)

    // Validate fields
    if (!userName || !mobile || !email || !password || !permissions) {
        return res.status(422).json({ success: false, message: "Please fill all fields properly" });
    }
    if (!validateMobile(mobile)) {
        return res.status(422).json({ success: false, message: "Mobile number should be exactly 10 digits" });
    }

    // Parse permissions
    let parsedPermissions;
    try {
        parsedPermissions = parsePermissions(permissions);
    } catch (error) {
        return res.status(422).json({ success: false, message: "Invalid JSON format for permissions" });
    }

    try {
        // Check if user already exists
        const userNameExist = await User.findOne({ where: { userName } });
        const mobileExist = await User.findOne({ where: { mobile } });
        const userExist = await User.findOne({ where: { email } });

        if (userNameExist) {
            return res.status(422).json({ success: false, message: "Username already exists" });
        } else if (mobileExist) {
            return res.status(422).json({ success: false, message: "Mobile no. already exists" });
        } else if (userExist) {
            return res.status(422).json({ success: false, message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user
        const newUser = await User.create({
            userName,
            mobile,
            email,
            password: hashedPassword, // Ensure you set the hashedPassword here
            permissions: parsedPermissions,
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        console.error('Error in Create User:', error);
        res.status(500).json({
            success: false,
            message: 'Error in Create User',
            error: error.message
        });
    }
}

export const updateUser = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed as a route parameter
    const { userName, mobile, email, permissions } = req.body;

    // Validate fields
    if (!userName || !mobile || !email || !permissions) {
        return res.status(422).json({ success: false, message: "Please fill all fields properly" });
    }
    if (!validateMobile(mobile)) {
        return res.status(422).json({ success: false, message: "Mobile number should be exactly 10 digits" });
    }

    // Parse permissions
    let parsedPermissions;
    try {
        parsedPermissions = parsePermissions(permissions);
    } catch (error) {
        return res.status(422).json({ success: false, message: "Invalid JSON format for permissions" });
    }

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${userId} not found`
            });
        }

        // Check if updated email or mobile already exist for other users
        if (user.email !== email) {
            const userExist = await User.findOne({ where: { email } });
            if (userExist) {
                return res.status(422).json({ success: false, message: "Email already exists" });
            }
        }

        if (user.mobile !== mobile) {
            const mobileExist = await User.findOne({ where: { mobile } });
            if (mobileExist) {
                return res.status(422).json({ success: false, message: "Mobile no. already exists" });
            }
        }

        // Update the user
        await User.update({
            userName,
            mobile,
            email,
            permissions: parsedPermissions,
        }, {
            where: { id: userId }
        });

        // Fetch the updated user
        const updatedUser = await User.findByPk(userId);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error in Update User:', error);
        res.status(500).json({
            success: false,
            message: 'Error in Update User',
            error: error.message
        });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Exclude the password field
        });

        res.status(200).json({
            success: true,
            message: 'All users fetched successfully',
            data: users
        });
    } catch (error) {
        console.error('Error in Get All Users:', error);
        res.status(500).json({
            success: false,
            message: 'Error in Get All Users',
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed as a route parameter

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${userId} not found`
            });
        }

        // Delete the user
        await user.destroy();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        console.error('Error in Delete User:', error);
        res.status(500).json({
            success: false,
            message: 'Error in Delete User',
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate inputs
        if (!email || !password) {
            return res.status(422).json({ success: false, message: "Please provide email and password" });
        }

        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid email and password" });
        }

        //Genrate JWT Token 
        const token = await JWT.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });


        // User authenticated, respond with user data
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: token,
            data: {
                id: user.id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                permissions: user.permissions
                // Add more user data as needed
            }
        });
    } catch (error) {
        console.error('Error in Login:', error);
        res.status(500).json({
            success: false,
            message: 'Error in Login',
            error: error.message
        });
    }
};
