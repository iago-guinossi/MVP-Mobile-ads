const router = require("express").Router();
const upload = require("../config/multer");
const { verificarToken } = require("../middleware/auth");
const {
  createTrilha,
  listTrilhas,
  getTrilha,
  updateTrilha,
  deleteTrilha
} = require("../controllers/trilhas.controller");

router.post("/", verificarToken, upload.array("images", 5), createTrilha);
router.get("/", listTrilhas);
router.get("/:id", getTrilha);
router.put("/:id", verificarToken, upload.array("images", 5), updateTrilha);
router.delete("/:id", verificarToken, deleteTrilha);

module.exports = router;
