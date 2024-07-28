import { ScriptableContext, ChartTypeRegistry } from 'chart.js';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function isWarning(ctx: ScriptableContext<keyof ChartTypeRegistry>): boolean {
  const index = ctx.dataIndex;
  const windValue = ctx.chart.data.datasets[0].data[index] || 0;
  const warningValue = ctx.chart.data.datasets[1].data[index] || 0;
  return warningValue > windValue;
}
