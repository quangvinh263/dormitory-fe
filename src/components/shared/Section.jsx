import clsx from 'clsx'; 

export default function Section({ title, children, className }) {
  return (
    <div 
      className={clsx(
        "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm", className 
      )}
    >
      {title && (
        <h2 className="text-lg font-bold text-gray-900 mb-6">{title}</h2>
      )}
      {children}
    </div>
  );
}