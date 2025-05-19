// RemoveToothButton.jsx
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

export default function RemoveToothButton({ onToothRemove, currentLayout }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Extract the current teeth in the layout (non-null values)
  const currentTeeth = currentLayout.flat().filter(Boolean).map(url => {
    return url.split('/').pop().replace('.glb', '');
  });

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
        <Button ref={triggerRef} className="bg-gray-500/70 text-white py-2 px-4 rounded">Remove a tooth</Button>
        </DropdownMenuTrigger>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 20,
            }}
          >
            <DropdownMenuContent className="w-56" forceMount>
              <ScrollArea className="h-[300px]">
                {currentTeeth.length > 0 ? (
                  currentTeeth.map((item, index) => (
                    <DropdownMenuItem key={index} onSelect={() => {
                      onToothRemove(item); // Pass the selected tooth to remove
                      setIsOpen(false);
                    }}>
                      {item}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No teeth to remove</DropdownMenuItem>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </div>
        )}
      </DropdownMenu>
    </div>
  );
}
