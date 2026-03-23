export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center z-50">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-dark-500 animate-spin" style={{
          borderTopColor: '#00d4ff',
          borderRightColor: '#b249f8',
        }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-display font-bold gradient-text">RM</span>
        </div>
      </div>
      <p className="text-dark-200 text-sm animate-pulse">Loading your world...</p>
    </div>
  );
}
