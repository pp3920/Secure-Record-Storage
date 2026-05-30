const router = require("express").Router();
const Note = require("../../models/Note");
const { authMiddleware } = require("../../utils/auth");


// ======================================================
// CREATE NOTE
// POST /api/notes
// ======================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================================================
// GET ALL NOTES OF LOGGED-IN USER
// GET /api/notes
// ======================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================================================
// GET SINGLE NOTE
// GET /api/notes/:id
// ======================================================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User is not authorized to view this note",
      });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================================================
// UPDATE NOTE
// PUT /api/notes/:id
// ======================================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User is not authorized to update this note",
      });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================================================
// DELETE NOTE
// DELETE /api/notes/:id
// ======================================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User is not authorized to delete this note",
      });
    }

    await note.deleteOne();

    res.json({
      message: "Note deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;