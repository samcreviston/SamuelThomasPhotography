const aboutController = {}

aboutController.buildAbout = async function(req, res){
  res.render("about", {title: "About SamuelThomas"})
}

module.exports = aboutController