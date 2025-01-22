export default function AuthLayout({ children }) {
  return (
    <div className="antialiased w-full h-full justify-center flex items-center bg-slate-100">
      {children}
    </div>
  );
}
