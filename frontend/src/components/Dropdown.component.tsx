import React, { useEffect, useRef, useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export interface Dropdown {
  options: Array<any>;
  placeholder: string;
  label?: string;
}

const Dropdown = ({ options, placeholder, label }: Dropdown) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const dropdownRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const dropdownHeight = dropdownRef.current!.clientHeight;
    const inputRect =
      dropdownRef.current!.parentElement!.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    if (spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight) {
      setIsOpen(false); // Close the dropdown if there's not enough space below
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <div className="relative cursor-pointer h-8 flex" onClick={toggleDropdown}>
      {!!label && (
        <div
          className={`mr-2 font-bold flex items-center justify-center h-full ${
            isOpen ? "bg-blue-200" : ""
          }`}
        >
          {label}
        </div>
      )}
      <input
        className="bg-white border rounded shadow cursor-pointer px-3"
        placeholder={placeholder}
        value={selectedItem}
        readOnly={true}
        ref={dropdownRef}
      />
      <div className="flex items-center justify-center h-full">
        {isOpen ? (
          <CaretUp size={24} color="#b2c6dc" weight="bold" />
        ) : (
          <CaretDown size={24} color="#b2c6dc" weight="bold" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 200 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50 left-0 w-full bg-white border rounded shadow overflow-hidden"
            style={{ top: "100%" }}
          >
            {options.map((item) => (
              <motion.li
                key={item}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleItemClick(item)}
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
