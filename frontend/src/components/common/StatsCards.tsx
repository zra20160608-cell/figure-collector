// StatsCards 组件
interface StatsCardsProps {
  stats: {
    total_figures: number;
    new_today: number;
    pre_order_count: number;
    manufacturer_count: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      label: '手办总数',
      value: stats.total_figures.toLocaleString(),
      icon: '📊',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: '今日新品',
      value: `+${stats.new_today}`,
      icon: '📈',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '预定中',
      value: stats.pre_order_count.toLocaleString(),
      icon: '⏰',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: '厂商数',
      value: stats.manufacturer_count.toString(),
      icon: '🏭',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`${item.bgColor} rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl md:text-3xl">{item.icon}</span>
          </div>
          <div className={`${item.color} text-2xl md:text-3xl font-bold mb-1`}>
            {item.value}
          </div>
          <div className="text-sm text-gray-600">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
