const path = require("path");
const fs = require("fs");
const prisma = require("../lib/prisma");
const { extractMapUrl } = require("../utils/googleMaps");
const { discardUploads } = require("../utils/uploads");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

async function createCachoeira(req, res) {
  try {
    const { name, summary, location, map } = req.body;

    let mapUrl;
    try {
      mapUrl = extractMapUrl(map);
    } catch (err) {
      discardUploads(req.files);
      return res.status(400).json({ error: err.message });
    }

    const filePaths = (req.files || []).map(f => ({ src: `/uploads/${f.filename}` }));

    const cachoeira = await prisma.cachoeira.create({
      data: {
        name,
        summary,
        location,
        mapUrl,
        images: {
          create: filePaths
        }
      },
      include: { images: true }
    });
    res.json(cachoeira);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar cachoeira" });
  }
}

async function listCachoeiras(req, res) {
  try {
    const cachoeiras = await prisma.cachoeira.findMany({ include: { images: true } });
    res.json(cachoeiras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar cachoeiras" });
  }
}

async function getCachoeira(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const cachoeira = await prisma.cachoeira.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!cachoeira) return res.status(404).json({ error: "Cachoeira não encontrada" });

    res.json(cachoeira);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar cachoeira" });
  }
}

async function updateCachoeira(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.cachoeira.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!existing) return res.status(404).json({ error: "Cachoeira não encontrada" });

    const { name, summary, location, map, imagesMantidas } = req.body;
    const updateData = {};

    if (name && name.trim() !== "") updateData.name = name;
    if (summary && summary.trim() !== "") updateData.summary = summary;
    if (location && location.trim() !== "") updateData.location = location;

    // "map" só é alterado quando enviado; texto vazio remove o mapa
    if (map !== undefined) {
      try {
        updateData.mapUrl = extractMapUrl(map);
      } catch (err) {
        discardUploads(req.files);
        return res.status(400).json({ error: err.message });
      }
    }

    let mantidasSrcs = [];
    if (imagesMantidas) {
      mantidasSrcs = Array.isArray(imagesMantidas) ? imagesMantidas : [imagesMantidas];
    }

    const imagensParaDeletar = existing.images.filter(imgObj => !mantidasSrcs.includes(imgObj.src));

    for (const imgObj of imagensParaDeletar) {
      const fullPath = path.join(PROJECT_ROOT, imgObj.src);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.warn("Erro ao deletar arquivo antigo do disco:", fullPath);
        }
      }
    }

    if (imagensParaDeletar.length > 0) {
      await prisma.imagemCachoeira.deleteMany({
        where: {
          id: { in: imagensParaDeletar.map(img => img.id) }
        }
      });
    }

    const newFiles = req.files || [];

    if (newFiles.length > 0) {
      updateData.images = {
        create: newFiles.map(f => ({ src: `/uploads/${f.filename}` }))
      };
    }

    const updated = await prisma.cachoeira.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });

    res.json(updated);
  } catch (error) {
    console.error("Erro no PUT:", error);
    res.status(500).json({ error: "Erro ao atualizar cachoeira" });
  }
}

async function deleteCachoeira(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.cachoeira.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!existing) return res.status(404).json({ error: "Cachoeira não encontrada" });

    for (const imgObj of existing.images) {
      const fullPath = path.join(PROJECT_ROOT, imgObj.src);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (err) { console.warn("Erro ao deletar arquivo", fullPath, err); }
      }
    }

    await prisma.cachoeira.delete({ where: { id } });
    res.json({ message: "Cachoeira deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar cachoeira" });
  }
}

module.exports = { createCachoeira, listCachoeiras, getCachoeira, updateCachoeira, deleteCachoeira };
