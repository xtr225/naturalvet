import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { formatNumber } from "../../utils/formatNumber";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
}) {
  const colors = {
    blue: "bg-[rgb(126_139_93_/_0.14)] text-[color:var(--color-primary)]",
    emerald: "bg-[rgb(163_174_132_/_0.18)] text-[color:var(--color-olive-dark)]",
    red: "bg-red-50 text-red-600",
    amber: "bg-[rgb(196_106_66_/_0.14)] text-[color:var(--color-secondary)]",
    violet: "bg-[rgb(126_139_93_/_0.18)] text-[color:var(--color-primary)]",
  };
  const canRenderIcon = typeof Icon === "function" || typeof Icon === "string";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#27331f]">
              {formatNumber(value)}
            </h2>
          </div>

          {canRenderIcon && (
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ${colors[color]}`}
            >
              <Icon size={28} />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
