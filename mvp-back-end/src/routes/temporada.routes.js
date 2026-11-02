const router = require("express").Router();
const upload = require("../config/multer");
const { verificarToken } = require("../middleware/auth");
const {
  createTemporada,
  listTemporadas,
  getTemporada,
  updateTemporada,
  deleteTemporada
} = require("../controllers/temporada.controller");

router.post("/", verificarToken, upload.single("image"), createTemporada);
router.get("/", listTemporadas);
router.get("/:id", getTemporada);
router.put("/:id", verificarToken, upload.single("image"), updateTemporada);
router.delete("/:id", verificarToken, deleteTemporada);

module.exports = router;
