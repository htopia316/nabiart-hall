'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@sunghoon_lee/akron-ui';

const FACILITIES = [
  { icon: '🎭', label: '무대', desc: '프로시니엄 무대 (가로 12m × 세로 8m × 높이 6m)' },
  { icon: '💡', label: '조명', desc: '전문 조명 시스템 (무빙라이트 12대, 일반조명 48채널)' },
  { icon: '🔊', label: '음향', desc: '디지털 음향 시스템 (메인 스피커 + 모니터 시스템)' },
  { icon: '🎥', label: '영상', desc: 'LED 스크린 (가로 6m × 세로 3m) + 프로젝터' },
  { icon: '🚻', label: '편의시설', desc: '분장실 3실, 대기실 2실, 화장실, 장애인 시설' },
  { icon: '🅿️', label: '주차', desc: '건물 내 주차장 (30대), 인근 공영주차장' },
];

const PRICING = [
  { type: '평일 (월~목)', full: '1,500,000', half: '900,000' },
  { type: '주말 (금~일)', full: '2,000,000', half: '1,200,000' },
  { type: '공휴일', full: '2,200,000', half: '1,400,000' },
];

export function VenueInfo() {
  const t = useTranslations();

  return (
    <div className="mt-6 space-y-10">
      {/* Overview */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">극장 소개</h2>
        <div className="rounded-2xl border border-border p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">좌석 수</p>
              <p className="text-lg font-semibold">100석</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">위치</p>
              <p className="text-lg font-semibold">서울특별시 종로구</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">규모</p>
              <p className="text-lg font-semibold">소극장 (블랙박스)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">개관</p>
              <p className="text-lg font-semibold">2020년</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">시설 안내</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FACILITIES.map((f) => (
            <div key={f.label} className="flex gap-3 rounded-xl border border-border p-4">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-medium">{f.label}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">{t('rental.pricing')}</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">구분</th>
                <th className="px-4 py-3 text-right font-medium">종일 (8시간)</th>
                <th className="px-4 py-3 text-right font-medium">반일 (4시간)</th>
              </tr>
            </thead>
            <tbody>
              {PRICING.map((row) => (
                <tr key={row.type} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3 text-right font-semibold">₩{row.full}</td>
                  <td className="px-4 py-3 text-right font-semibold">₩{row.half}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          * 부가세 별도 / 음향·조명 기술 스텝 비용 포함 / 리허설 별도 협의
        </p>
      </section>
    </div>
  );
}
