export async function parseManualFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "txt":
      return await file.text();

    case "pdf": {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-manual", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.text;
    }

    default:
      throw new Error("지원하지 않는 파일 형식입니다. (PDF, TXT 지원)");
  }
}

export function chunkManualText(
  text: string,
  maxChunkSize = 8000
): string[] {
  const paragraphs = text.split("\n\n");
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + para).length > maxChunkSize) {
      if (current) chunks.push(current.trim());
      current = para;
    } else {
      current += "\n\n" + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
