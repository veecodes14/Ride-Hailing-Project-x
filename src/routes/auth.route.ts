import express from "express";
const router = express.Router();
import {register, login, forgotPassword, verifyOTP, resetPassword} from "../controllers/auth.controller";
import { otpRequestLimiter, otpVerifyLimiter } from '../middlewares/otpLimiter.middleware'


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with hashed password and saves to the database.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - role
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               gender:
 *                 type: string
 *                 example: male
 *               role:
 *                 type: string
 *                 example: rider
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User, John Doe registered"
 *       404:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "User already exists"
 *       500:
 *         description: Internal server error
 */

/** 
//@route POST /api/v1/auth/register
//@desc Creates a new user
//@access public
*/
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Passenger logged in successfully"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *               data:
 *                 _id: "64b0c0f3e934b8..."
 *                 name: "John Doe"
 *                 email: "johndoe@example.com"
 *                 role: "rider"
 *                 phone: "+1234567890"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "All fields are required"
 *       500:
 *         description: Internal server error
 */
/** 
//@route POST /api/v1/auth/login
//@desc Login a user
//@access public
*/
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     description: Sends a one-time password (OTP) to the user's email for resetting their password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP request handled
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "A password reset OTP has been sent to your email. Please check your inbox."
 *       400:
 *         description: Missing or invalid email
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email is required to reset your password"
 *       500:
 *         description: Internal server error
 */
/** 
//@route POST /api/v1/auth/forgot-password
//@desc Forgot Password - Request OTP
//@access public
*/
router.post('/forgot-password', otpRequestLimiter, forgotPassword);

/**
 * @swagger
 * /api/v1/auth/otp/verify:
 *   post:
 *     summary: Verify OTP for password reset
 *     description: Verifies the OTP sent to the user and generates a temporary token for password reset.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OTP verified successfully. You can now reset your password."
 *               tempToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid OTP"
 *       401:
 *         description: OTP expired
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "OTP has expired. Request a new one."
 *       500:
 *         description: Internal server error
 */

/** 
//@route POST /api/v1/auth/otp/verify
//@desc Verify Forgot Password OTP
//@access public
*/
router.post('/otp/verify', otpVerifyLimiter, verifyOTP)

/**
 * @swagger
 * /api/v1/auth/otp/reset:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Reset Password using Verified OTP
 *     description: Allows the user to reset their password using the temporary token issued after successful OTP verification.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or missing token or password
 *       401:
 *         description: Token expired or unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
/** 
//@route PUT /api/v1/auth/otp/reset
//@desc Reset password
//@access public
*/
router.put('/otp/reset', resetPassword)


export default router;



// import express from "express";
// import { register } from "../controllers/auth.controller";

// const router = express.Router()

// router.post("/register", register)

// export default router

