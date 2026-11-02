const router = require("express").Router();
const authRoutes = require("./auth.routes");
const trilhasRoutes = require("./trilhas.routes");
const eventosRoutes = require("./eventos.routes");
const cachoeirasRoutes = require("./cachoeiras.routes");
const temporadaRoutes = require("./temporada.routes");

router.use("/", authRoutes);
router.use("/trilhas", trilhasRoutes);
router.use("/eventos", eventosRoutes);
router.use("/cachoeiras", cachoeirasRoutes);
router.use("/temporada", temporadaRoutes);

module.exports = router;
