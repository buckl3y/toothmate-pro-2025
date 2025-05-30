// AddToothButton.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import templates from '../data/templates'; // Import the templates

export default function AddToothButton({ onToothSelect, currentLayout }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null); // Ensure this is initialized with null, not false
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Extract tooth names from the mixedView template
  const items = templates.mixedView.flat().filter(Boolean).map(url => {
    // Extract the tooth name from the URL (e.g., "28_Right_Upper_Wisdom")
    return url.split('/').pop().replace('.glb', '');
  });

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
      {/* Add Tooth Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
        <Button ref={triggerRef} className="bg-gray-500/70 text-white py-2 px-4 rounded">Add a tooth</Button>
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
                {items.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => {
                      onToothSelect(item); // Pass the selected tooth to the parent
                      setIsOpen(false);
                    }}
                    disabled={currentTeeth.includes(item)} // Disable if already exists
                  >
                    {item}
                    {currentTeeth.includes(item) && " (Already Added)"}
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </div>
        )}
      </DropdownMenu>
    </div>
  );
}
