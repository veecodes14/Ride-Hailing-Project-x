import express from "express";
const router = express.Router();
import {
  changePassword,
  deleteAccount,
  updateProfile,
  userData,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/roles.middleware";

/**
 * @swagger
 * /api/v1/status/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get logged-in user data/profile (Get your own profile)
 *     description: Returns the details of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "642fc5365ebf3ab83d7d501a"
 *                     fullName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "jane@example.com"
 *                     role:
 *                       type: string
 *                       example: "Applicant"
 *                     isAccountDeleted:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *       500:
 *         description: Internal Server Error.
 */
router.get(
  "/profile",
  authMiddleware,
  authorizedRoles("rider", "driver"),
  userData
);

/**
 * @swagger
 * /api/v1/status/profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user's profile
 *     description: Updates the authenticated user's public profile information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               userName:
 *                 type: string
 *               yearGroup:
 *                 type: string
 *               occupation:
 *                 type: string
 *               about:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: uri
 *               backgroundImage:
 *                 type: string
 *                 format: uri
 *               affiliatedGroups:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/profile",
  authMiddleware,
  authorizedRoles("rider", "driver"),
  updateProfile
);

/**
 * @swagger
 * /api/v1/status/update/password:
 *   put:
 *     tags:
 *       - User
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password using the current password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPass123!"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePass456!"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       400:
 *         description: Validation or password mismatch error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/update/password",
  authMiddleware,
  authorizedRoles("rider", "driver"),
  changePassword
);

/**
 * @swagger
 * /api/v1/status/account/delete:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete (soft delete) user account
 *     description: Marks the authenticated user's account as deleted.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully."
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/account/delete",
  authMiddleware,
  authorizedRoles("rider", "driver"),
  deleteAccount
);

export default router;
