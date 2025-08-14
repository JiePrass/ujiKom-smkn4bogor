export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // Ganti spasi dengan "-"
    .replace(/&/g, "-and-")      // Ganti & dengan "and"
    .replace(/[^\w\-]+/g, "")    // Hapus karakter non-word
    .replace(/\-\-+/g, "-");     // Hilangkan tanda "-" ganda
}
