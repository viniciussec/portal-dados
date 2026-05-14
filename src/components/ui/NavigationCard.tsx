import Link from "next/link";
import { MsIcon } from "@/components/ui/MsIcon";

type AccentColor =
  | "emerald"
  | "orange"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "slate";

type NavigationCardProps = {
  href: string;
  title: string;
  description: string;
  icon: string;
  accentColor: AccentColor;
  ctaLabel: string;
  isExternal?: boolean;
  disabled?: boolean;
};

const colorStyles: Record<
  AccentColor,
  {
    border: string;
    bar: string;
    iconBg: string;
    iconText: string;
    ctaText: string;
    ctaBg: string;
  }
> = {
  emerald: {
    border: "hover:border-emerald-500",
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    ctaText: "text-emerald-600",
    ctaBg: "group-hover:bg-emerald-50",
  },
  orange: {
    border: "hover:border-orange-500",
    bar: "bg-orange-500",
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    ctaText: "text-orange-600",
    ctaBg: "group-hover:bg-orange-50",
  },
  blue: {
    border: "hover:border-blue-500",
    bar: "bg-blue-500",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    ctaText: "text-blue-600",
    ctaBg: "group-hover:bg-blue-50",
  },
  violet: {
    border: "hover:border-violet-500",
    bar: "bg-violet-500",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    ctaText: "text-violet-600",
    ctaBg: "group-hover:bg-violet-50",
  },
  amber: {
    border: "hover:border-amber-500",
    bar: "bg-amber-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    ctaText: "text-amber-600",
    ctaBg: "group-hover:bg-amber-50",
  },
  rose: {
    border: "hover:border-rose-500",
    bar: "bg-rose-500",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    ctaText: "text-rose-600",
    ctaBg: "group-hover:bg-rose-50",
  },
  slate: {
    border: "hover:border-slate-400",
    bar: "bg-slate-400",
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    ctaText: "text-slate-600",
    ctaBg: "group-hover:bg-slate-100",
  },
};

type CardInnerProps = {
  colors: (typeof colorStyles)[AccentColor];
  iconName: string;
  title: string;
  description: string;
  ctaLabel: string;
};

function CardInner({
  colors,
  iconName,
  title,
  description,
  ctaLabel,
}: CardInnerProps) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 border-slate-200 p-8 ${colors.border} hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-2 ${colors.bar} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
      />
      <div className="flex-1 flex flex-col items-center">
        <div
          className={`w-20 h-20 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300`}
        >
          <MsIcon name={iconName} size={40} className={colors.iconText} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div
        className={`mt-8 px-6 py-2 bg-slate-50 ${colors.ctaText} font-semibold rounded-full ${colors.ctaBg} transition-colors`}
      >
        {`${ctaLabel} →`}
      </div>
    </div>
  );
}

export function NavigationCard({
  href,
  title,
  description,
  icon,
  accentColor,
  ctaLabel,
  isExternal = false,
}: NavigationCardProps) {
  const colors = colorStyles[accentColor];

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <CardInner
          colors={colors}
          iconName={icon}
          title={title}
          description={description}
          ctaLabel={ctaLabel}
        />
      </a>
    );
  }

  return (
    <Link href={href} className="group block h-full">
      <CardInner
        colors={colors}
        iconName={icon}
        title={title}
        description={description}
        ctaLabel={ctaLabel}
      />
    </Link>
  );
}
