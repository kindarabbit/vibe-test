import { expect, test, type Page } from "@playwright/test";

async function openCleanApp(page: Page) {
  await page.goto("/app");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

async function createScript(page: Page) {
  await page.getByLabel("발표 제목").fill("AI 윤리 발표");
  await page
    .getByLabel("PPT 내용 또는 발표 키워드")
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

test("shows validation when required inputs are missing", async ({ page }) => {
  await openCleanApp(page);

  await page.getByRole("button", { name: "대본 생성" }).click();

  await expect(
    page.getByText("발표 제목과 PPT 내용 또는 발표 키워드를 모두 입력하세요."),
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

  await expect(page.getByRole("heading", { name: "AI 윤리 발표" })).toBeVisible();
});
