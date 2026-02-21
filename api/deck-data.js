export default function handler(req, res) {
  res.status(200).json({
    status: "success",
    message: "API deck-data aktif",
    data: {
      title: "KOPSIM Deck",
      version: "1.0"
    }
  });
}