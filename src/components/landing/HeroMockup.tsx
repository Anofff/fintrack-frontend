/** Decorative dashboard preview — no external images, matches FinTrack tokens. */
export function HeroMockup() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:mx-0">
      <div className="absolute w-[min(100%,500px)] h-[min(100%,500px)] bg-[rgba(0,105,76,0.08)] rounded-full blur-3xl -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative animate-[landing-float_6s_ease-in-out_infinite]">
        <div className="card rounded-2xl p-md lg:p-6 overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-label text-outline uppercase tracking-wide mb-1">Monthly spend (Jan 2026)</p>
              <p className="text-h1 font-semibold text-on-surface">GHS 2,131.45</p>
            </div>
            <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
            </div>
          </div>

          <div className="space-y-4">
            <CategoryRow
              icon="shopping_bag"
              iconClass="bg-[rgba(0,96,168,0.12)] text-secondary"
              name="Groceries & Food"
              amount="GHS 840"
              width="40%"
              barClass="bg-primary"
            />
            <CategoryRow
              icon="bolt"
              iconClass="bg-[rgba(85,76,185,0.12)] text-tertiary"
              name="Utilities"
              amount="GHS 312"
              width="15%"
              barClass="bg-tertiary"
            />
            <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] flex justify-between items-center">
              <span className="text-label text-outline uppercase tracking-wide">E-levy tracker</span>
              <span className="text-label text-error font-semibold">GHS 21.30</span>
            </div>
          </div>
        </div>

        {/* Desktop floating chips */}
        <div
          className="hidden lg:block absolute -bottom-6 -left-8 glass-card p-4 rounded-xl shadow-xl w-44"
        >
          <p className="text-label text-outline uppercase tracking-wide mb-1">E-levy paid</p>
          <p className="text-h3 font-semibold text-on-surface">GH₵ 142.50</p>
        </div>
        <div className="hidden lg:block absolute top-8 -right-6 glass-card p-4 rounded-xl shadow-xl w-48">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label text-outline">Spendings</span>
            <span className="text-primary text-label font-semibold">+12%</span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  icon,
  iconClass,
  name,
  amount,
  width,
  barClass,
}: {
  icon: string;
  iconClass: string;
  name: string;
  amount: string;
  width: string;
  barClass: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
          </div>
          <span className="text-body-mid font-medium text-on-surface">{name}</span>
        </div>
        <span className="text-body-mid font-medium text-on-surface">{amount}</span>
      </div>
      <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${barClass}`} style={{ width }} />
      </div>
    </div>
  );
}
