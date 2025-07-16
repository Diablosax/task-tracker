// src/components/FloatingButton.tsx
import React from 'react';

interface FloatingButtonProps {
  showMenu: boolean;
  onToggleMenu: (show: boolean) => void;
  onAddTask: () => void;
  onCreateTemplate: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  showMenu,
  onToggleMenu,
  onAddTask,
  onCreateTemplate
}) => {
  return (
    <div className="floating-button-container">
      {showMenu && (
        <div className="floating-menu">
          <button className="menu-item" onClick={onAddTask}>
            📝 Добавить задачу
          </button>
          <button className="menu-item" onClick={onCreateTemplate}>
            📋 Создать шаблон
          </button>
        </div>
      )}
      
      <button
        className={`floating-button ${showMenu ? 'active' : ''}`}
        onClick={() => onToggleMenu(!showMenu)}
      >
        {showMenu ? '×' : '+'}
      </button>
    </div>
  );
};

export default FloatingButton;
