import React, { useState } from "react";
import { X } from "lucide-react";

/* ---------------------------------------------------------------- Frame */
export function Frame({ kicker, floor, title, lead, children, wide }) {
  return (
    <div className={`mx-auto flex w-full flex-1 flex-col ${wide ? "max-w-[86rem]" : "max-w-[80rem]"}`}>
      {(kicker || floor) && (
        <div className="mb-3 flex items-center gap-3 md:mb-4">
          {kicker && <span className="kicker">{kicker}</span>}
          {floor && (
            <span className="ml-auto flex-none rounded-full border border-line bg-paper px-2.5 py-1 text-[0.68rem] font-semibold tracking-wider text-muted md:px-3 md:text-[0.75rem]">
              {floor}
            </span>
          )}
        </div>
      )}
      {title && (
        <h2 className="mb-2 text-[1.45rem] font-extrabold leading-tight text-ink sm:text-[1.7rem] md:text-[2.15rem]">
          {title}
        </h2>
      )}
      {lead && (
        <p className="mb-4 max-w-4xl text-[0.9rem] leading-relaxed text-muted md:mb-6 md:text-[0.98rem]">
          {lead}
        </p>
      )}
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------- Card */
export function Card({ title, icon: Icon, tone = "brand", children, className = "" }) {
  const tones = {
    brand: "text-brand-700 bg-brand-50",
    good: "text-good bg-emerald-50",
    warn: "text-warn2 bg-amber-50",
    bad: "text-bad bg-red-50",
    slate: "text-slateink bg-slate-100",
  };
  return (
    <div className={`surface p-4 md:p-6 ${className}`}>
      {title && (
        <h3 className="mb-2 flex items-center gap-2 text-[1rem] font-bold text-ink md:text-[1.06rem]">
          {Icon && (
            <span className={`grid h-7 w-7 flex-none place-items-center rounded-lg ${tones[tone]}`}>
              <Icon size={16} strokeWidth={2.4} />
            </span>
          )}
          {title}
        </h3>
      )}
      <div className="text-[0.9rem] leading-relaxed text-slateink md:text-[0.95rem]">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------- Pill */
export function Pill({ tone = "slate", children }) {
  const tones = {
    slate: "border-line bg-slate-50 text-slateink",
    brand: "border-brand-200 bg-brand-50 text-brand-700",
    good: "border-emerald-200 bg-emerald-50 text-good",
    warn: "border-amber-200 bg-amber-50 text-warn2",
    bad: "border-red-200 bg-red-50 text-bad",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.74rem] font-semibold md:text-[0.78rem] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Table */
/* 手机竖向：每行折叠成一张"标签 + 内容"的卡片；md 以上显示为表格。 */
export function DataTable({ head, rows, widths, align }) {
  return (
    <>
      {/* 手机端 */}
      <div className="space-y-3 md:hidden">
        {rows.map((r, ri) => (
          <div key={ri} className="surface p-4">
            {r.map((c, ci) => (
              <div key={ci} className={ci === 0 ? "" : "mt-2.5 border-t border-line/70 pt-2.5"}>
                <div className="text-[0.68rem] font-bold uppercase tracking-wide text-brand-700">
                  {head[ci]}
                </div>
                <div className="mt-0.5 text-[0.9rem] leading-relaxed text-slateink">{c}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 桌面端 */}
      <div className="surface hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-[0.94rem]">
          <thead>
            <tr className="bg-brand-50/70">
              {head.map((h, i) => (
                <th
                  key={i}
                  style={widths ? { width: widths[i] } : undefined}
                  className="px-4 py-3 text-left font-bold text-brand-800"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className={ri % 2 ? "bg-slate-50/50" : "bg-paper"}>
                {r.map((c, ci) => (
                  <td
                    key={ci}
                    className={`border-t border-line px-4 py-3 align-top leading-relaxed text-slateink ${
                      align && align[ci] ? align[ci] : ""
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Stats */
export function Stat({ value, unit, label, tone = "brand" }) {
  const toneCls =
    tone === "good"
      ? "from-good to-emerald-400"
      : tone === "warn"
      ? "from-warn2 to-amber-400"
      : "from-brand-600 to-teal2";
  return (
    <div className="surface p-5 md:p-6">
      <div className="flex items-baseline gap-1">
        <span
          className={`tnum bg-gradient-to-br ${toneCls} bg-clip-text text-[2.2rem] font-extrabold leading-none text-transparent md:text-[2.6rem]`}
        >
          {value}
        </span>
        {unit && <span className="text-[0.85rem] font-semibold text-muted md:text-[0.9rem]">{unit}</span>}
      </div>
      <p className="mt-3 text-[0.86rem] leading-relaxed text-muted md:text-[0.9rem]">{label}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- Figure */
export function Figure({ src, alt, caption }) {
  const [zoom, setZoom] = useState(false);
  return (
    <figure className="surface p-2 md:p-3">
      <button
        type="button"
        onClick={() => setZoom(true)}
        title="点击放大查看"
        className="block w-full cursor-zoom-in rounded-xl"
      >
        <img src={src} alt={alt} className="w-full rounded-xl" />
      </button>
      {caption && (
        <figcaption className="px-2 pb-1 pt-2.5 text-center text-[0.8rem] text-muted md:pt-3 md:text-[0.85rem]">
          {caption}
        </figcaption>
      )}
      <p className="pb-1 text-center text-[0.72rem] text-muted/80 md:hidden">点击图片可放大查看</p>

      {zoom && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/85 p-3"
          onClick={() => setZoom(false)}
        >
          <div className="flex items-center justify-between px-1 pb-2 text-white">
            <span className="text-[0.82rem] text-white/80">{alt}</span>
            <button
              type="button"
              onClick={() => setZoom(false)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/25 text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
          <div
            className="thin-scroll flex-1 overflow-auto rounded-xl bg-white p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={src} alt={alt} className="w-[44rem] max-w-none" />
          </div>
        </div>
      )}
    </figure>
  );
}

/* ---------------------------------------------------------------- Focus */
export function Focus({ no, title, tag, tagTone = "brand", goal, points, aside }) {
  return (
    <div className="grid items-start gap-5 md:gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      <div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="tnum bg-gradient-to-br from-brand-600 to-teal2 bg-clip-text text-[2.4rem] font-extrabold leading-none text-transparent md:text-[3.4rem]">
            {no}
          </span>
          <div>
            <h3 className="text-[1.2rem] font-extrabold text-ink md:text-[1.4rem]">{title}</h3>
            <div className="mt-1">{tag && <Pill tone={tagTone}>{tag}</Pill>}</div>
          </div>
        </div>
        {goal && <p className="mt-3 text-[0.92rem] leading-relaxed text-slateink md:mt-4 md:text-[1rem]">{goal}</p>}
        <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
          {points.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-slateink md:gap-3 md:text-[0.95rem]">
              <span className="mt-[0.5rem] h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      {aside && <div className="space-y-3 md:space-y-4">{aside}</div>}
    </div>
  );
}

export function Quote({ children }) {
  return (
    <p className="border-l-4 border-brand-500 pl-4 text-[0.95rem] leading-relaxed text-slateink md:pl-5 md:text-[1.05rem]">
      {children}
    </p>
  );
}

export function Grid({ cols = 2, children }) {
  const map = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 xl:grid-cols-4",
  };
  return <div className={`grid gap-3 md:gap-4 ${map[cols] || map[2]}`}>{children}</div>;
}
