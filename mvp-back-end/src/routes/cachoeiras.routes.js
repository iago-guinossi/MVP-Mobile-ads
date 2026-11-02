const router = require("express").Router();
const upload = require("../config/multer");
const { verificarToken } = require("../middleware/auth");
const {
  createCachoeira,
  listCachoeiras,
  getCachoeira,
  updateCachoeira,
  deleteCachoeira
} = require("../controllers/cachoeiras.controller");

router.post("/", verificarToken, upload.array("images", 5), createCachoeira);
router.get("/", listCachoeiras);
router.get("/:id", getCachoeira);
router.put("/:id", verificarToken, upload.array("images", 5), updateCachoeira);
router.delete("/:id", verificarToken, deleteCachoeira);

module.exports = router;
