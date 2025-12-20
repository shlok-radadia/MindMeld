import { useState } from "react";

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left cursor-pointer hover:text-blue-400 transition"
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-gray-400 text-2xl">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}