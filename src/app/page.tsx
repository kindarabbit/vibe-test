import Link from "next/link";

const featureCards = [
  {
    title: "PPT 내용 입력",
    description: "발표 자료의 핵심 문장이나 키워드를 바로 정리합니다.",
    accent: "from-mint to-sky",
  },
  {
    title: "말투 선택",
    description: "자연스럽게, 공식적으로, 친근하게 중 발표 상황에 맞게 고릅니다.",
    accent: "from-coral to-amber",
  },
  {
    title: "시간 맞춤",
    description: "5분, 10분, 15분 발표에 맞춰 읽기 좋은 대본 흐름을 만듭니다.",
    accent: "from-violet to-mint",
  },
];

const flowSteps = ["입력하기", "말투 고르기", "대본 확인하기"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eefdfa_46%,#fff7ed_100%)] text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-14">
        <div className="animate-fade-up max-w-3xl">
          <p className="mb-4 text-[15px] font-medium text-mint">발표 준비 MVP</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            발표 자료를 대본으로 바꾸는 가장 빠른 방법
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            PPT 내용이나 발표 키워드를 입력하면 원하는 말투와 발표 시간에 맞춰
            자연스러운 발표 대본을 만들어줍니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-700"
              href="/app"
            >
              발표 대본 만들기
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-[15px] font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-mint hover:text-slate-950"
              href="/app"
            >
              샘플 화면 보기
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((feature, index) => (
            <Link
              className="group animate-fade-up overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              href="/app"
              key={feature.title}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className={`h-1.5 bg-gradient-to-r ${feature.accent}`} />
              <article className="p-5">
                <h2 className="text-base font-medium text-slate-950">
                  {feature.title}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">
                  {feature.description}
                </p>
                <span className="mt-5 inline-flex text-[14px] font-medium text-mint transition group-hover:translate-x-1">
                  앱에서 사용하기
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="animate-fade-up rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 md:grid-cols-3">
            {flowSteps.map((step, index) => (
              <Link
                className="rounded-md border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-700 transition hover:border-sky hover:bg-sky/5 hover:text-slate-950"
                href="/app"
                key={step}
              >
                <span className="mr-2 text-mint">0{index + 1}</span>
                {step}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
