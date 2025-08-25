const express = require("express")
const router = new express.Router() 
const aboutController = require("../controllers/aboutController")

  // Route to build about page
  router.get("/about", aboutController.buildAbout);

module.exports = router;