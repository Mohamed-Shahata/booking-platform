import { Router } from "express";
import ReviewController from "./review.controller";
import { auth, authRoles } from "../../shared/middlewares/auth.middleware";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import validate from "../../shared/middlewares/validation.middleware";
import { createReviewSchema } from "./dto/create.dto";
import { getAllReviewSchema } from "./dto/getAll";
import expressAsyncHandler from "express-async-handler";
import { uploadFile } from "../../shared/middlewares/multer.middleware";

class ReviewRouter {
  router = Router();
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.initRoutes();
  }

  /**
   * @swagger
   * tags:
   *   name: Reviews
   *   description: Endpoints related to user reviews and complaints
   */

  private initRoutes() {
    /**
     * @swagger
     * /reviews/system:
     *   get:
     *     summary: Get all system reviews (public)
     *     tags: [Reviews]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           example: 1
     *         description: Page number for pagination (optional)
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           example: 20
     *         description: Number of reviews per page (optional)
     *     responses:
     *       200:
     *         description: List of system reviews
     */
    this.router.get(
      "/system",
      validate(getAllReviewSchema),
      expressAsyncHandler(this.reviewController.getAllReviewsSystem)
    );

    /**
     * @swagger
     * /reviews/experts:
     *   get:
     *     summary: Get all reviews for experts
     *     tags: [Reviews]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           example: 1
     *         description: Page number for pagination (optional)
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           example: 20
     *         description: Number of reviews per page (optional)
     *     responses:
     *       200:
     *         description: List of expert reviews
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      "/experts",
      validate(getAllReviewSchema),
      auth,
      expressAsyncHandler(this.reviewController.getAllReviewsExperts)
    );

    /**
     * @swagger
     * /reviews/{expertId}:
     *   get:
     *     summary: Get all reviews for a specific expert
     *     tags: [Reviews]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: expertId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Reviews for the expert
     *       404:
     *         description: Expert not found
     */
    this.router.get(
      "/:expertId",
      auth,
      expressAsyncHandler(this.reviewController.getReviewsOneExpert)
    );

    /**
     * @swagger
     * /reviews/complaints-suggestions/find:
     *   get:
     *     summary: Get all complaints and suggestions
     *     tags: [Reviews]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of complaints
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      "/complaints-suggestions/find",
      auth,
      expressAsyncHandler(this.reviewController.getAllComplaints)
    );

    /**
     * @swagger
     * /reviews/create:
     *   post:
     *     summary: Create a new review
     *     tags: [Reviews]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               expertId:
     *                 type: string
     *                 description: MongoDB ObjectId of the expert being reviewed
     *                 example: "64f1c5e2a9f1b2d3c4e5f678"
     *               provider:
     *                 type: string
     *                 description: Source of the review (system or manual)
     *                 enum: [SYSTEM, CLIENT]
     *                 default: SYSTEM
     *               Message:
     *                 type: string
     *                 description: Review Message
     *                 minLength: 10
     *                 maxLength: 300
     *                 example: "Very professional and helpful expert!"
     *               stars:
     *                 type: number
     *                 description: Rating stars (1-5)
     *                 minimum: 1
     *                 maximum: 5
     *                 example: 5
     *     responses:
     *       201:
     *         description: Review created successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     */
    this.router.post(
      "/create",
      validate(createReviewSchema),
      auth,
      authRoles(UserRoles.ADMIN, UserRoles.CLIENT),
      expressAsyncHandler(this.reviewController.create)
    );

    /**
     * @swagger
     * /reviews/create/complaints-suggestions:
     *   post:
     *     summary: Submit a complaint or suggestion (with optional image)
     *     tags: [Reviews]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: false
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               message:
     *                 type: string
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: Complaint submitted
     *       401:
     *         description: Unauthorized
     */
    this.router.post(
      "/create/complaints-suggestions",
      auth,
      uploadFile.single("image"),
      expressAsyncHandler(this.reviewController.createComplaints)
    );

    /**
     * @swagger
     * /reviews/delete/{reviewId}:
     *   delete:
     *     summary: Delete a review
     *     tags: [Reviews]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: reviewId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Review deleted successfully
     *       404:
     *         description: Review not found
     */
    this.router.delete(
      "/delete/:reviewId",
      auth,
      authRoles(UserRoles.ADMIN, UserRoles.CLIENT),
      expressAsyncHandler(this.reviewController.delete)
    );
  }
}

export default ReviewRouter;  
