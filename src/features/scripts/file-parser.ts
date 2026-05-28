const PPTX_SLIDE_PATH_PATTERN = /^ppt\/slides\/slide(\d+)\.xml$/;

type ZipEntry = {
  name: string;
  compressionMethod: number;
  compressedSize: number;
  localHeaderOffset: number;
};

export async function extractPresentationText(file: File) {
  const extension = getFileExtension(file.name);
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (extension === "pptx") {
    return extractPptxText(bytes);
  }

  if (extension === "pdf") {
    return extractPdfText(bytes);
  }

  if (extension === "ppt") {
    throw new Error("오래된 .ppt 파일은 이번 MVP에서 지원하지 않습니다. .pptx 또는 .pdf 파일을 올려주세요.");
  }

  throw new Error("지원하지 않는 파일 형식입니다. .pptx 또는 .pdf 파일을 올려주세요.");
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

async function extractPptxText(bytes: Uint8Array) {
  const entries = readZipEntries(bytes)
    .filter((entry) => PPTX_SLIDE_PATH_PATTERN.test(entry.name))
    .sort((a, b) => getSlideNumber(a.name) - getSlideNumber(b.name));

  if (entries.length === 0) {
    throw new Error("PPTX 파일에서 슬라이드 텍스트를 찾지 못했습니다.");
  }

  const slideTexts: string[] = [];

  for (const [index, entry] of entries.entries()) {
    const entryBytes = await readZipEntry(bytes, entry);
    const xml = new TextDecoder("utf-8").decode(entryBytes);
    const texts = extractSlideXmlText(xml);

    if (texts.length > 0) {
      slideTexts.push(`슬라이드 ${index + 1}\n${texts.join("\n")}`);
    }
  }

  return normalizeExtractedText(slideTexts);
}

function getSlideNumber(path: string) {
  return Number(path.match(PPTX_SLIDE_PATH_PATTERN)?.[1] ?? "0");
}

function readZipEntries(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const endOfCentralDirectoryOffset = findEndOfCentralDirectory(view);
  const entryCount = view.getUint16(endOfCentralDirectoryOffset + 10, true);
  const centralDirectoryOffset = view.getUint32(endOfCentralDirectoryOffset + 16, true);
  const entries: ZipEntry[] = [];
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) {
      throw new Error("PPTX 파일 구조를 읽지 못했습니다.");
    }

    const compressionMethod = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const fileNameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);
    const nameBytes = bytes.slice(offset + 46, offset + 46 + fileNameLength);
    const name = new TextDecoder("utf-8").decode(nameBytes);

    entries.push({ name, compressionMethod, compressedSize, localHeaderOffset });
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function findEndOfCentralDirectory(view: DataView) {
  const minimumOffset = Math.max(0, view.byteLength - 65_557);

  for (let offset = view.byteLength - 22; offset >= minimumOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      return offset;
    }
  }

  throw new Error("PPTX 파일 구조를 찾지 못했습니다.");
}

async function readZipEntry(bytes: Uint8Array, entry: ZipEntry) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const offset = entry.localHeaderOffset;

  if (view.getUint32(offset, true) !== 0x04034b50) {
    throw new Error("PPTX 슬라이드 데이터를 읽지 못했습니다.");
  }

  const fileNameLength = view.getUint16(offset + 26, true);
  const extraLength = view.getUint16(offset + 28, true);
  const dataOffset = offset + 30 + fileNameLength + extraLength;
  const compressedBytes = bytes.slice(dataOffset, dataOffset + entry.compressedSize);

  if (entry.compressionMethod === 0) {
    return compressedBytes;
  }

  if (entry.compressionMethod === 8) {
    return decompressBytes(compressedBytes, "deflate-raw");
  }

  throw new Error("지원하지 않는 PPTX 압축 방식입니다.");
}

function extractSlideXmlText(xml: string) {
  const matches = xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g);

  return Array.from(matches, (match) => decodeXmlText(match[1]))
    .map((text) => text.trim())
    .filter(Boolean);
}

function decodeXmlText(text: string) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

async function extractPdfText(bytes: Uint8Array) {
  const binary = bytesToBinaryString(bytes);
  const streamPattern = /(<<[\s\S]*?>>)\s*stream\r?\n?([\s\S]*?)\r?\n?endstream/g;
  const textParts: string[] = [];

  for (const match of binary.matchAll(streamPattern)) {
    const dictionary = match[1];
    const streamBytes = binaryStringToBytes(match[2]);
    const decodedBytes = /\/FlateDecode/.test(dictionary)
      ? await decompressBytes(streamBytes, "deflate")
      : streamBytes;
    const content = bytesToBinaryString(decodedBytes);

    textParts.push(...extractPdfTextStrings(content));
  }

  return normalizeExtractedText(textParts);
}

function extractPdfTextStrings(content: string) {
  const parts: string[] = [];
  let index = 0;

  while (index < content.length) {
    const character = content[index];

    if (character === "(") {
      const parsed = readPdfLiteralString(content, index);
      parts.push(parsed.value);
      index = parsed.nextIndex;
      continue;
    }

    if (character === "<" && content[index + 1] !== "<") {
      const endIndex = content.indexOf(">", index + 1);

      if (endIndex > index) {
        parts.push(decodePdfHexString(content.slice(index + 1, endIndex)));
        index = endIndex + 1;
        continue;
      }
    }

    index += 1;
  }

  return parts;
}

function readPdfLiteralString(content: string, startIndex: number) {
  let value = "";
  let depth = 1;
  let index = startIndex + 1;

  while (index < content.length && depth > 0) {
    const character = content[index];

    if (character === "\\") {
      const parsed = readPdfEscape(content, index);
      value += parsed.value;
      index = parsed.nextIndex;
      continue;
    }

    if (character === "(") {
      depth += 1;
      value += character;
      index += 1;
      continue;
    }

    if (character === ")") {
      depth -= 1;

      if (depth > 0) {
        value += character;
      }

      index += 1;
      continue;
    }

    value += character;
    index += 1;
  }

  return { value, nextIndex: index };
}

function readPdfEscape(content: string, slashIndex: number) {
  const escaped = content[slashIndex + 1];

  if (!escaped) {
    return { value: "", nextIndex: slashIndex + 1 };
  }

  const simpleEscapes: Record<string, string> = {
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "\t",
    "\\": "\\",
    "(": "(",
    ")": ")",
  };

  if (escaped in simpleEscapes) {
    return { value: simpleEscapes[escaped], nextIndex: slashIndex + 2 };
  }

  if (escaped === "\r" || escaped === "\n") {
    const nextIndex = escaped === "\r" && content[slashIndex + 2] === "\n" ? slashIndex + 3 : slashIndex + 2;
    return { value: "", nextIndex };
  }

  if (/[0-7]/.test(escaped)) {
    const octal = content.slice(slashIndex + 1, slashIndex + 4).match(/^[0-7]{1,3}/)?.[0] ?? "";
    return { value: String.fromCharCode(Number.parseInt(octal, 8)), nextIndex: slashIndex + 1 + octal.length };
  }

  return { value: escaped, nextIndex: slashIndex + 2 };
}

function decodePdfHexString(hex: string) {
  const normalized = hex.replace(/\s+/g, "");
  const evenLengthHex = normalized.length % 2 === 0 ? normalized : `${normalized}0`;
  const bytes = new Uint8Array(evenLengthHex.length / 2);

  for (let index = 0; index < evenLengthHex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(evenLengthHex.slice(index, index + 2), 16);
  }

  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return decodeUtf16Be(bytes.slice(2));
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function decodeUtf16Be(bytes: Uint8Array) {
  let text = "";

  for (let index = 0; index < bytes.length - 1; index += 2) {
    text += String.fromCharCode((bytes[index] << 8) | bytes[index + 1]);
  }

  return text;
}

async function decompressBytes(bytes: Uint8Array, format: CompressionFormat) {
  if (!("DecompressionStream" in globalThis)) {
    throw new Error("이 브라우저에서는 압축된 파일을 해제할 수 없습니다.");
  }

  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const stream = new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function normalizeExtractedText(parts: string[]) {
  const text = parts
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  if (!text) {
    throw new Error("파일에서 텍스트를 찾지 못했습니다. 슬라이드가 이미지로만 구성되어 있다면 키워드를 직접 입력해 주세요.");
  }

  return text;
}

function bytesToBinaryString(bytes: Uint8Array) {
  const chunks: string[] = [];
  const chunkSize = 8192;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.slice(index, index + chunkSize)));
  }

  return chunks.join("");
}

function binaryStringToBytes(value: string) {
  const bytes = new Uint8Array(value.length);

  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }

  return bytes;
}
