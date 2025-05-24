import { useState, useRef, useEffect } from "react";

function Acordeon({ title, children }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open]);

  return (
    <div className="mb-4 border rounded overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 font-semibold text-blue-700"
      >
        {title}
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: height }}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Acordeon;
