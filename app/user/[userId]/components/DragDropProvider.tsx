"use client";

import React, { createContext, useContext, useState } from 'react';

interface DragDropContextType {
  draggedItem: any | null;
  setDraggedItem: (item: any | null) => void;
  handleDragStart: (item: any) => void;
  handleDragEnd: () => void;
  handleDrop: (targetItem: any) => void;
  isDragging: boolean;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export default function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<any | null>(null);

  const handleDragStart = (item: any) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetItem: any) => {
    // This will be handled by the parent component
    console.log('Drop', { draggedItem, targetItem });
  };

  return (
    <DragDropContext.Provider
      value={{
        draggedItem,
        setDraggedItem,
        handleDragStart,
        handleDragEnd,
        handleDrop,
        isDragging: !!draggedItem
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}
