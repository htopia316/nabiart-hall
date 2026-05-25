'use client';

const BENEFITS = [
  {
    tier: '나비 후원자',
    amount: '월 10,000원 이상',
    perks: ['공연 소식 뉴스레터', '후원자 명단 등재 (선택)'],
    color: 'border-green-500',
  },
  {
    tier: '은빛 후원자',
    amount: '월 30,000원 이상',
    perks: ['나비 후원자 혜택 전부', '연 2회 공연 초대권 (1매)', '10% 예매 할인'],
    color: 'border-blue-500',
  },
  {
    tier: '금빛 후원자',
    amount: '월 50,000원 이상',
    perks: ['은빛 후원자 혜택 전부', '연 4회 공연 초대권 (2매)', '리허설 관람 초대', '프로그램 북 후원자 명단'],
    color: 'border-yellow-500',
  },
  {
    tier: '무지개 후원자',
    amount: '월 100,000원 이상',
    perks: ['금빛 후원자 혜택 전부', '모든 공연 초대권 (2매)', '배우/스텝 만남의 시간', 'VIP 좌석 우선 예약', '연말 감사 행사 초대'],
    color: 'border-purple-500',
  },
];

export function SupportInfo() {
  return (
    <div className="mt-6 space-y-10">
      <section>
        <h2 className="mb-4 text-xl font-semibold">후원 취지</h2>
        <div className="rounded-2xl border border-border p-6 leading-relaxed">
          <p>
            나비아트홀은 관객과 함께 성장하는 극단입니다. 여러분의 후원은 신인 배우 발굴,
            실험적인 작품 제작, 시설 개선 등 더 나은 공연 환경을 만드는 데 사용됩니다.
          </p>
          <p className="mt-3">
            작은 후원도 큰 힘이 됩니다. 나비아트홀과 함께 예술의 가치를 지켜주세요.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">후원 등급 및 혜택</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.tier} className={`rounded-2xl border-2 ${b.color} p-5`}>
              <h3 className="text-lg font-bold">{b.tier}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.amount}</p>
              <ul className="mt-4 space-y-2">
                {b.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-green-600">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
