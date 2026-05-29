import { expect, test, type Locator, type Page } from "@playwright/test";

function mvpLocators(page: Page) {
  return {
    landing: {
      headline: page.getByRole("heading", {
        name: "발표 자료를 대본으로 바꾸는 가장 빠른 방법",
      }),
      primaryCta: page.getByRole("link", { name: "발표 대본 만들기" }).first(),
      sampleCta: page.getByRole("link", { name: "샘플 화면 보기" }),
    },
    app: {
      pageTitle: page.getByRole("heading", { name: "발표 대본 만들기" }),
      titleInput: page.getByLabel("발표 제목"),
      sourceInput: page.getByLabel("PPT/PDF 내용 또는 발표 키워드"),
      fileInput: page.getByLabel("PPTX/PDF 파일 첨부"),
      generateButton: page.getByRole("button", { name: "대본 생성" }),
      validationMessage: page.getByText(
        "발표 제목과 PPT/PDF에서 추출한 내용 또는 키워드를 입력하세요.",
      ),
      emptyState: page.getByRole("heading", {
        name: "아직 생성된 대본이 없습니다.",
      }).first(),
      previewPlaceholder: page.getByRole("heading", {
        name: "미리볼 대본을 선택해 주세요.",
      }),
      listTitle: page.getByRole("heading", { name: "생성된 대본" }),
      searchInput: page.getByLabel("대본 검색"),
      toneFilter: page.getByLabel("말투 필터"),
      durationFilter: page.getByLabel("발표 시간 필터"),
      statusFilterGroup: page.getByLabel("대본 상태 필터"),
      copyButton: page.getByRole("button", { name: "대본 복사" }),
      copiedButton: page.getByRole("button", { name: "복사 완료" }),
      firstStatusButton: page.getByRole("button", { name: "상태 변경" }).first(),
    },
    tone: {
      natural: page.getByRole("button", { name: "자연스럽게" }),
      formal: page.getByRole("button", { name: "공식적으로" }),
      friendly: page.getByRole("button", { name: "친근하게" }),
    },
    duration: {
      five: page.getByRole("button", { name: "5분" }),
      ten: page.getByRole("button", { name: "10분" }),
      fifteen: page.getByRole("button", { name: "15분" }),
    },
    statusFilter: {
      all: page.getByRole("button", { name: "전체" }),
      draft: page.getByRole("button", { name: "작성 중" }),
      review: page.getByRole("button", { name: "검토 중" }),
      done: page.getByRole("button", { name: "완료" }),
    },
    previewTone: {
      natural: page.getByRole("button", {
        name: "생성된 대본 말투를 자연스럽게로 변경",
      }),
      formal: page.getByRole("button", {
        name: "생성된 대본 말투를 공식적으로로 변경",
      }),
      friendly: page.getByRole("button", {
        name: "생성된 대본 말투를 친근하게로 변경",
      }),
    },
    previewDuration: {
      five: page.getByRole("button", {
        name: "생성된 대본 발표 시간을 5분으로 변경",
      }),
      ten: page.getByRole("button", {
        name: "생성된 대본 발표 시간을 10분으로 변경",
      }),
      fifteen: page.getByRole("button", {
        name: "생성된 대본 발표 시간을 15분으로 변경",
      }),
    },
    scriptCard(title: string): Locator {
      return page.getByRole("button", { name: title });
    },
    text(value: string): Locator {
      return page.getByText(value);
    },
  };
}

async function openCleanApp(page: Page) {
  await page.goto("/app");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

async function fillRequiredScriptForm(page: Page) {
  const ui = mvpLocators(page);

  await ui.app.titleInput.fill("AI 윤리 발표");
  await ui.app.sourceInput.fill("AI 활용 사례, 편향 문제, 책임 있는 사용");
  await ui.tone.formal.click();
  await ui.duration.ten.click();
}

test.describe("MVP locator smoke tests", () => {
  test("landing page locators move the user into the app", async ({ page }) => {
    const ui = mvpLocators(page);

    await page.goto("/");
    await expect(ui.landing.headline).toBeVisible();
    await ui.landing.primaryCta.click();

    await expect(ui.app.pageTitle).toBeVisible();
  });

  test("app locators cover the core create, preview, status, filter, and search flow", async ({
    page,
  }) => {
    await openCleanApp(page);
    const ui = mvpLocators(page);

    await expect(ui.app.pageTitle).toBeVisible();
    await expect(ui.app.emptyState).toBeVisible();

    await fillRequiredScriptForm(page);
    await ui.app.generateButton.click();

    await expect(ui.scriptCard("AI 윤리 발표")).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI 윤리 발표" })).toBeVisible();
    await expect(ui.text("공식적으로").first()).toBeVisible();
    await expect(ui.text("10분").first()).toBeVisible();

    await ui.app.firstStatusButton.click();
    await expect(ui.text("검토 중").first()).toBeVisible();

    await ui.statusFilter.review.click();
    await expect(ui.scriptCard("AI 윤리 발표")).toBeVisible();

    await ui.app.searchInput.fill("책임");
    await expect(ui.scriptCard("AI 윤리 발표")).toBeVisible();
  });

  test("app locators expose validation and generated-script variant controls", async ({
    page,
  }) => {
    await openCleanApp(page);
    const ui = mvpLocators(page);

    await ui.app.generateButton.click();
    await expect(ui.app.validationMessage).toBeVisible();

    await fillRequiredScriptForm(page);
    await ui.app.generateButton.click();

    await ui.previewTone.friendly.click();
    await ui.previewDuration.fifteen.click();

    await expect(ui.previewTone.friendly).toHaveAttribute("aria-pressed", "true");
    await expect(ui.previewDuration.fifteen).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
