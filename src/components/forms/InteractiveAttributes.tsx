"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

export interface Attribute {
  id: string;
  name: string;
}

interface AttributesProps {
  type: "entrada" | "saida";
  title: string;
  description: string;
  placeholder: string;
  items: Attribute[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export function InteractiveAttributes({ type, title, description, placeholder, items, onAdd, onRemove }: AttributesProps) {
  const [inputValue, setInputValue] = useState("");
  const [duplicateModal, setDuplicateModal] = useState(false);

  const handleAdd = () => {
    const val = inputValue.trim().toUpperCase();
    if (!val) return;

    if (items.some(item => item.name === val)) {
      setDuplicateModal(true);
      return;
    }

    onAdd(val);
    setInputValue("");
  };

  const isEntrada = type === "entrada";
  const themeColorClass = isEntrada ? "bg-[#00aeb3]" : "bg-[#009a4d]";
  const borderColorClass = isEntrada ? "border-[#00aeb3]" : "border-[#009a4d]";
  const hoverColorClass = isEntrada ? "hover:bg-[#008f94]" : "hover:bg-[#008141]";
  const lightBgClass = isEntrada ? "bg-cyan-50" : "bg-green-50";

  return (
    <>
    <Modal
      isOpen={duplicateModal}
      onClose={() => setDuplicateModal(false)}
      title="Atributo Duplicado"
      type="warning"
      primaryAction={{ label: 'Entendi', onClick: () => setDuplicateModal(false) }}
    >
      <p className="text-sm">Este atributo já foi adicionado à lista.</p>
    </Modal>
    <div className={cn("bg-white border-2 border-slate-200 rounded-xl p-6 transition-all duration-300 hover:shadow-md h-[450px] flex flex-col", `border-l-4 ${borderColorClass}`)}>
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          {isEntrada ? "🔵" : "🟢"} {title}
        </h3>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm", themeColorClass)}>
          {items.length}
        </div>
      </div>

      <p className="text-sm text-slate-500 italic mb-5 p-3 bg-slate-50 rounded-lg">
        {description}
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors text-sm"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
        />
        <button
          type="button"
          onClick={handleAdd}
          className={cn("px-4 py-2 text-white font-semibold rounded-lg flex items-center gap-2 transition-all transform active:scale-95 text-sm", themeColorClass, hoverColorClass)}
        >
          <Plus size={18} /> Inserir
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-400 italic text-center py-8 text-sm"
            >
              Nenhum atributo adicionado
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn("flex items-center justify-between p-3 border border-slate-200 rounded-lg group", lightBgClass)}
              >
                <span className="text-slate-700 font-medium text-sm">{item.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-red-400 hover:text-red-600 opacity-50 group-hover:opacity-100 transition-opacity bg-white p-1.5 rounded-md hover:bg-red-50"
                  title="Remover atributo"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}
