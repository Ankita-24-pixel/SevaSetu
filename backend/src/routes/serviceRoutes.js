const express = require("express");
const {createService, getAllServices, getServiceById, searchServices, getNearbyServices} = require("../controllers/serviceController");

const router = express.Router();

router.post("/", createService);
router.get("/", getAllServices);
router.get("/search", searchServices);
router.get("/nearby", getNearbyServices);
router.get("/:id", getServiceById);

module.exports = router;