import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export default function InfoCard({ title, children, actions }) {
  return (
    <Card hover={false}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {actions}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
