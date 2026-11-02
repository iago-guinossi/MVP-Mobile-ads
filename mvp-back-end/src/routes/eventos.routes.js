const router = require("express").Router();
const upload = require("../config/multer");
const { verificarToken } = require("../middleware/auth");
const {
  createEvento,
  listEventos,
  getEvento,
  updateEvento,
  deleteEvento
} = require("../controllers/eventos.controller");

router.post("/", verificarToken, upload.array("images", 5), createEvento);
router.get("/", listEventos);
router.get("/:id", getEvento);
router.put("/:id", verificarToken, upload.array("images", 5), updateEvento);
router.delete("/:id", verificarToken, deleteEvento);

module.exports = router;
