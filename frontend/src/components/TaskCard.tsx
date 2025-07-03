import React, { useState } from 'react';

const TaskCard = ({ task, onEdit, onDelete, onUpdateChecklist, onDeleteChecklist, onAddChecklist, onEditChecklist }) => {
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const completedCount = task.checklist.filter(item => item.completed).length;
  const totalCount = task.checklist.length;

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      onAddChecklist(newChecklistItem.trim());
      setNewChecklistItem('');
      setIsAddingItem(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex-1 mb-4 sm:mb-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-gray-800">Checklist</h4>
          <span className="text-sm text-gray-500">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        )}

        <div className="space-y-2">
          {task.checklist.map(item => (
            <div key={item._id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => onUpdateChecklist(item._id, { completed: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {item.message}
              </span>
              <button
                onClick={() => onEditChecklist(item)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteChecklist(item._id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {isAddingItem ? (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Enter checklist item"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              autoFocus
            />
            <button
              onClick={handleAddChecklistItem}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingItem(false);
                setNewChecklistItem('');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add Checklist Item
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;