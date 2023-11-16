const express = require("express");
const router = express.Router();

const auth = require("./services/auth");
const user = require("./prisma/user");

router.post("/user", auth.hashPassword, user.create);
router.get("/user/:id", user.readById);
router.put("/user", user.update);
router.delete("/user/:id", user.deleteById);
module.exports = router;
