const express = require("express");
const router = express.Router();

const { startKYC, testPython,  startBlink} = require("../controllers/kycController");

router.post("/start-ekyc", startKYC);
router.get("/test-python", testPython);
router.get("/blink", startBlink);

module.exports = router;
const { saveKYC, evaluateKYC } = require("../controllers/kycController");

router.post("/kyc/save", saveKYC);
router.post("/kyc/evaluate", evaluateKYC);