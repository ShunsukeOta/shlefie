 "use client";

import { useMemo, useState } from "react";
import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import { useLibrary } from "../_components/LibraryProvider";

const weeklyBase = [
  { label: "月", read: 2, add: 1 },
  { label: "火", read: 1, add: 2 },
  { label: "水", read: 3, add: 1 },
  { label: "木", read: 2, add: 0 },
  { label: "金", read: 4, add: 2 },
  { label: "土", read: 1, add: 1 },
  { label: "日", read: 0, add: 1 },
];

const monthlyBase = Array.from({ length: 30 }, (_, index) => ({
  label: `${index + 1}`,
  read: [1, 0, 2, 3, 1, 4, 2, 1, 0, 3, 2, 4, 1, 2, 0, 3, 1, 2, 4, 2, 1, 3, 0, 2, 1, 4, 2, 1, 3, 2][
    index
  ],
  add: [0, 1, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 1, 2, 0, 1, 2, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1][
    index
  ],
}));

const yearlyBase = [
  { label: "1月", read: 12, add: 8 },
  { label: "2月", read: 9, add: 5 },
  { label: "3月", read: 14, add: 10 },
  { label: "4月", read: 6, add: 3 },
  { label: "5月", read: 11, add: 7 },
  { label: "6月", read: 8, add: 4 },
  { label: "7月", read: 10, add: 6 },
  { label: "8月", read: 13, add: 9 },
  { label: "9月", read: 7, add: 5 },
  { label: "10月", read: 12, add: 8 },
  { label: "11月", read: 9, add: 6 },
  { label: "12月", read: 15, add: 11 },
];


type SeriesProps = {
  title: string;
  data: { label: string; read: number; add: number }[];
};

function ChartCard({ title, data }: SeriesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const max = Math.max(...data.map((item) => item.read + item.add), 1);
  const chartHeight = 120;
  const dense = data.length > 12;
  const columns = data.length;

  return (
    <section className="rounded border border-[#e6e6e6] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">{title}</h2>
        <div className="flex items-center gap-2 text-[12px] text-[#6b6b6b]">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#2f8a4a]" />
            読書量
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#2f5fbf]" />
            登録量
          </span>
        </div>
      </div>
      <div
        className={`grid items-end ${dense ? "gap-0.5" : "gap-2"}`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {data.map((item, index) => {
          const total = item.read + item.add;
          const height = (total / max) * chartHeight;
          const readRatio = total === 0 ? 0 : item.read / total;
          const isActive = activeIndex === index;
          return (
            <div
              key={item.label}
              className="relative flex flex-col items-center"
            >
              <button
                type="button"
                className="w-full"
                aria-label={`${item.label}の読書量と登録量`}
                onClick={() =>
                  setActiveIndex(isActive ? null : index)
                }
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  className="flex w-full flex-col overflow-hidden rounded-md bg-[#f3f3f3]"
                  style={{ height: `${height}px` }}
                >
                  <div
                    className="w-full bg-[#2f8a4a]"
                    style={{ height: `${Math.round(height * readRatio)}px` }}
                  />
                  <div
                    className="w-full bg-[#2f5fbf]"
                    style={{ height: `${Math.round(height * (1 - readRatio))}px` }}
                  />
                </div>
              </button>
              {isActive && (
                <div className="pointer-events-none absolute -top-10 left-1/2 z-10 w-max max-w-[140px] -translate-x-1/2 whitespace-nowrap rounded-md border border-[#e6e6e6] bg-white px-2 py-1 text-[10px] text-[#222] shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                  <p>{item.label}</p>
                  <p>読書量: {item.read}冊</p>
                  <p>登録量: {item.add}冊</p>
                </div>
              )}
              <span className="mt-1 text-[9px] text-[#6b6b6b]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function SummaryPage() {
  const { books } = useLibrary();
  const [range, setRange] = useState<"week" | "month" | "year">("week");

  const scaleSeries = (
    base: { label: string; read: number; add: number }[],
    total: number
  ) => {
    const baseTotal = base.reduce((sum, item) => sum + item.read + item.add, 0) || 1;
    const factor = total / baseTotal;
    return base.map((item) => ({
      label: item.label,
      read: Math.max(0, Math.round(item.read * factor)),
      add: Math.max(0, Math.round(item.add * factor)),
    }));
  };

  const weekly = useMemo(() => scaleSeries(weeklyBase, books.length), [books.length]);
  const monthly = useMemo(
    () => scaleSeries(monthlyBase, books.length * 4),
    [books.length]
  );
  const yearly = useMemo(
    () => scaleSeries(yearlyBase, books.length * 12),
    [books.length]
  );

  const totals = useMemo(() => {
    const counts = {
      done: 0,
      reading: 0,
      stack: 0,
      unread: 0,
    };
    books.forEach((book) => {
      counts[book.statusKey] += 1;
    });
    return [
      { label: "登録冊数", value: `${books.length}` },
      { label: "読了", value: `${counts.done}` },
      { label: "読書中", value: `${counts.reading}` },
      { label: "積読", value: `${counts.stack}` },
      { label: "未読", value: `${counts.unread}` },
    ];
  }, [books]);

  const activeSeries =
    range === "week"
      ? { title: "1週間の読書量・登録量", data: weekly }
      : range === "month"
        ? { title: "1ヶ月の読書量・登録量", data: monthly }
        : { title: "1年の読書量・登録量", data: yearly };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar title="まとめ" />
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-4 pt-3 pb-[84px] text-left hide-scrollbar">
        <div className="grid gap-3">
          <div className="inline-flex items-center gap-2">
            {[
              { key: "week", label: "1週間" },
              { key: "month", label: "1ヶ月" },
              { key: "year", label: "1年" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`rounded-full px-3 py-2 text-[12px] ${
                  range === item.key
                    ? "bg-[#222] text-white"
                    : "bg-[#f1f1f1] text-[#6b6b6b]"
                }`}
                onClick={() =>
                  setRange(item.key as "week" | "month" | "year")
                }
              >
                {item.label}
              </button>
            ))}
          </div>
          <ChartCard title={activeSeries.title} data={activeSeries.data} />
        </div>

        <section className="mt-3 grid grid-cols-3 gap-2">
          {totals.map((item) => (
            <div
              key={item.label}
              className="rounded border border-[#e6e6e6] bg-white px-3 py-2"
            >
              <p className="text-[12px] text-[#6b6b6b]">{item.label}</p>
              <p className="text-[14px] font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

      </main>
      <BottomNav active="summary" />
    </div>
  );
}
