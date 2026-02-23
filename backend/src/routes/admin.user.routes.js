const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const {
  getAllUsers,
  updateUserStatus
} = require("../controllers/admin.user.controller");

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/users", getAllUsers);

router.patch("/users/:userId/status", updateUserStatus);

module.exports = router;