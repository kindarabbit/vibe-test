import Link from "next/link";

const features = [
  "PPT 내용과 발표 키워드 입력",
  "자연스럽게, 공식적으로, 친근하게 말투 선택",
  "5분, 10분, 15분 발표 시간 선택",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-[15px] font-medium uppercase tracking-normal text-mint">
            발표 준비 MVP
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            발표 자료를 대본으로 바꾸는 가장 빠른 방법
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            PPT 내용이나 발표 키워드를 입력하면 원하는 말투와 발표 시간에 맞춰
            자연스러운 발표 대본을 만들어줍니다.
          </p>
          <Link
            className="mt-8 inline-flex items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-white transition hover:bg-slate-700"
            href="/app"
          >
            발표 대본 만들기
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={feature}
            >
              <h2 className="text-base font-medium text-slate-950">{feature}</h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-600">
                발표 상황에 맞는 선택지를 먼저 정하고, 대본 작성 부담을 줄입니다.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
