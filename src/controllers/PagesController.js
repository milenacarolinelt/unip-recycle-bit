class PagesController {
  async home(req, res) {
    return res.render('home', {
    });
  }
}

module.exports = new PagesController();