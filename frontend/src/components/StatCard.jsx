const StatCard = ({ title, value }) => {
  return (
    <div className="p-4 border border-white/10 rounded-xl bg-white/5 text-center">
      <h3 className="text-sm text-slate-400">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;