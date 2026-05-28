import { expect, test, type Page } from "@playwright/test";

async function openCleanApp(page: Page) {
  await page.goto("/app");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

async function createScript(page: Page) {
  await page.getByLabel("발표 제목").fill("AI 윤리 발표");
  await page
    .getByLabel("PPT/PDF 내용 또는 발표 키워드")
    .fill("AI 활용 사례, 편향 문제, 책임 있는 사용");
  await page.getByRole("button", { name: "공식적으로" }).click();
  await page.getByRole("button", { name: "10분" }).click();
  await page.getByRole("button", { name: "대본 생성" }).click();
}

test("creates a presentation script from required inputs", async ({ page }) => {
  await openCleanApp(page);
  await createScript(page);

  await expect(page.getByRole("heading", { name: "AI 윤리 발표" })).toBeVisible();
  await expect(page.getByText("공식적으로").first()).toBeVisible();
  await expect(page.getByText("10분").first()).toBeVisible();
  await expect(page.getByText("책임 있는 사용").first()).toBeVisible();
});

test("updates generated script tone and duration from the preview", async ({ page }) => {
  await openCleanApp(page);
  await createScript(page);

  await page
    .getByRole("button", { name: "생성된 대본 말투를 친근하게로 변경" })
    .click();
  await page
    .getByRole("button", { name: "생성된 대본 발표 시간을 15분으로 변경" })
    .click();

  await expect(
    page.getByRole("button", { name: "생성된 대본 말투를 친근하게로 변경" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "생성된 대본 발표 시간을 15분으로 변경" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("듣는 사람이 쉽게 따라올 수 있도록").first()).toBeVisible();
  await expect(page.getByText("배경, 핵심 내용, 시사점까지").first()).toBeVisible();
});

test("shows validation when required inputs are missing", async ({ page }) => {
  await openCleanApp(page);

  await page.getByRole("button", { name: "대본 생성" }).click();

  await expect(
    page.getByText("발표 제목과 PPT/PDF에서 추출한 내용 또는 키워드를 입력하세요."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "아직 생성된 대본이 없습니다." }).first(),
  ).toBeVisible();
});

test("updates status and filters the script list", async ({ page }) => {
  await openCleanApp(page);
  await createScript(page);

  await page.getByRole("button", { name: "상태 변경" }).first().click();
  await expect(page.getByText("검토 중").first()).toBeVisible();

  await page.getByRole("button", { name: "검토 중" }).click();
  await expect(page.getByRole("button", { name: "AI 윤리 발표" })).toBeVisible();

  await page.getByRole("button", { name: "완료" }).click();
  await expect(
    page.getByRole("heading", { name: "조건에 맞는 대본이 없습니다." }),
  ).toBeVisible();
});

test("searches scripts and copies generated content", async ({ page }) => {
  await openCleanApp(page);
  await createScript(page);

  await page.getByLabel("대본 검색").fill("편향");
  await expect(page.getByRole("button", { name: "AI 윤리 발표" })).toBeVisible();

  await page.getByRole("button", { name: "대본 복사" }).click();
  await expect(page.getByRole("button", { name: "복사 완료" })).toBeVisible();
});

test("persists generated scripts after reload", async ({ page }) => {
  await openCleanApp(page);
  await createScript(page);

  await page.reload();

  await expect(page.getByRole("heading", { name: "미리볼 대본을 선택해 주세요." })).toBeVisible();
  await expect(page.getByRole("button", { name: "AI 윤리 발표" })).toBeVisible();
});

test("extracts PPTX text into the editable source field", async ({ page }) => {
  await openCleanApp(page);

  await page.getByLabel("발표 제목").fill("팀 프로젝트 발표");
  await page.getByLabel("PPTX/PDF 파일 첨부").setInputFiles({
    name: "team-project.pptx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    buffer: createStoredZip({
      "ppt/slides/slide1.xml":
        '<p:sld><a:t>시장 분석</a:t><a:t>사용자 인터뷰 결과</a:t></p:sld>',
      "ppt/slides/slide2.xml":
        '<p:sld><a:t>MVP 핵심 기능</a:t><a:t>발표 대본 자동 생성</a:t></p:sld>',
    }),
  });

  await expect(page.getByText("텍스트를 추출해 입력창에 채웠습니다.")).toBeVisible();
  await expect(page.getByLabel("PPT/PDF 내용 또는 발표 키워드")).toHaveValue(
    /시장 분석[\s\S]*MVP 핵심 기능/,
  );

  await page.getByRole("button", { name: "대본 생성" }).click();

  await expect(page.getByText("team-project.pptx").first()).toBeVisible();
  await expect(page.getByText("파일 첨부").first()).toBeVisible();
  await expect(page.getByText("사용자 인터뷰 결과").first()).toBeVisible();
});

test("extracts PDF text into the editable source field", async ({ page }) => {
  await openCleanApp(page);

  await page.getByLabel("발표 제목").fill("PDF 발표 자료");
  await page.getByLabel("PPTX/PDF 파일 첨부").setInputFiles({
    name: "slides.pdf",
    mimeType: "application/pdf",
    buffer: createSimplePdf("PDF slide insight and closing message"),
  });

  await expect(page.getByText("텍스트를 추출해 입력창에 채웠습니다.")).toBeVisible();
  await expect(page.getByLabel("PPT/PDF 내용 또는 발표 키워드")).toHaveValue(
    /PDF slide insight/,
  );

  await page.getByRole("button", { name: "대본 생성" }).click();

  await expect(page.getByText("slides.pdf").first()).toBeVisible();
  await expect(page.getByText("PDF slide insight").first()).toBeVisible();
});

test("shows a parsing error for unsupported PPT files", async ({ page }) => {
  await openCleanApp(page);

  await page.getByLabel("PPTX/PDF 파일 첨부").setInputFiles({
    name: "legacy.ppt",
    mimeType: "application/vnd.ms-powerpoint",
    buffer: Buffer.from("legacy binary ppt"),
  });

  await expect(page.getByText("오래된 .ppt 파일은 이번 MVP에서 지원하지 않습니다.")).toBeVisible();
});

function createStoredZip(entries: Record<string, string>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const [name, value] of Object.entries(entries)) {
    const nameBuffer = Buffer.from(name, "utf8");
    const valueBuffer = Buffer.from(value, "utf8");
    const localHeader = Buffer.alloc(30);

    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt32LE(0, 14);
    localHeader.writeUInt32LE(valueBuffer.length, 18);
    localHeader.writeUInt32LE(valueBuffer.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);

    localParts.push(localHeader, nameBuffer, valueBuffer);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt32LE(0, 16);
    centralHeader.writeUInt32LE(valueBuffer.length, 20);
    centralHeader.writeUInt32LE(valueBuffer.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + valueBuffer.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const localFiles = Buffer.concat(localParts);
  const endOfCentralDirectory = Buffer.alloc(22);

  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(Object.keys(entries).length, 8);
  endOfCentralDirectory.writeUInt16LE(Object.keys(entries).length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectory.length, 12);
  endOfCentralDirectory.writeUInt32LE(localFiles.length, 16);

  return Buffer.concat([localFiles, centralDirectory, endOfCentralDirectory]);
}

function createSimplePdf(text: string) {
  const stream = `BT /F1 18 Tf 72 720 Td (${escapePdfLiteral(text)}) Tj ET`;

  return Buffer.from(
    `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${stream.length} >>
stream
${stream}
endstream
endobj
%%EOF`,
    "utf8",
  );
}

function escapePdfLiteral(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
