import Avatar from "../ui/Avatar";
import { Card, CardContent } from "../ui/Card";

export default function ProfileCard({ name, subtitle, meta, avatar }) {
  return (
    <Card hover={false}>
      <CardContent className="flex items-center gap-4">
        <Avatar name={name} src={avatar} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{name}</p>
          {subtitle && <p className="truncate text-sm text-slate-500">{subtitle}</p>}
          {meta && <p className="mt-1 text-xs text-slate-400">{meta}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
