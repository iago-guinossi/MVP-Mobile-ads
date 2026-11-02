const path = require("path");
const fs = require("fs");
const prisma = require("../lib/prisma");
const { extractMapUrl } = require("../utils/googleMaps");
const { discardUploads } = require("../utils/uploads");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

async function createEvento(req, res) {
  try {
    const { name, summary, location, date, map } = req.body;

    let mapUrl;
    try {
      mapUrl = extractMapUrl(map);
    } catch (err) {
      discardUploads(req.files);
      return res.status(400).json({ error: err.message });
    }

    const filePaths = (req.files || []).map(f => ({ src: `/uploads/${f.filename}` }));

    const evento = await prisma.evento.create({
      data: {
        name,
        summary,
        location,
        mapUrl,
        date,
        images: {
          create: filePaths
        }
      },
      include: { images: true }
    });
    res.json(evento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar evento" });
  }
}

async function listEventos(req, res) {
  try {
    const eventos = await prisma.evento.findMany({ include: { images: true } });
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
}

async function getEvento(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const evento = await prisma.evento.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

    res.json(evento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar evento" });
  }
}

async function updateEvento(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.evento.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!existing) return res.status(404).json({ error: "Evento não encontrado" });

    const { name, summary, location, date, map, imagesMantidas } = req.body;
    const updateData = {};

    if (name && name.trim() !== "") updateData.name = name;
    if (summary && summary.trim() !== "") updateData.summary = summary;
    if (location && location.trim() !== "") updateData.location = location;
    if (date && date.trim() !== "") updateData.date = date;

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
      await prisma.imagemEvento.deleteMany({
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

    const updated = await prisma.evento.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });

    res.json(updated);
  } catch (error) {
    console.error("Erro no PUT:", error);
    res.status(500).json({ error: "Erro ao atualizar evento" });
  }
}

async function deleteEvento(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.evento.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!existing) return res.status(404).json({ error: "Evento não encontrado" });

    for (const imgObj of existing.images) {
      const fullPath = path.join(PROJECT_ROOT, imgObj.src);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (err) { console.warn("Erro ao deletar arquivo", fullPath, err); }
      }
    }

    await prisma.evento.delete({ where: { id } });
    res.json({ message: "Evento deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar evento" });
  }
}

module.exports = { createEvento, listEventos, getEvento, updateEvento, deleteEvento };
