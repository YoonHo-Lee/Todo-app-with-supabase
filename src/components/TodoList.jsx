import { TrashIcon } from "@heroicons/react/24/outline";

export default function TodoList({
  activeTodos,
  completedTodos,
  toggleComplete,
  onDelete,
}) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h1 className="text-2xl font-bold mb-6">할 일 관리</h1>
      <div className="space-y-6">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">진행중인 할 일</h2>
          <ul>
            {activeTodos.map((todo) => (
              <li
                id={todo.id}
                key={todo.id}
                className="flex items-center gap-3 p-1 m-0 group"
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleComplete(todo.id)}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="w-4 h-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="select-none">{todo.text}</span>
                </div>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-red-500 opacity-100 hover:opacity-50 transition-opacity p-1 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">완료된 할 일</h2>
          <ul>
            {completedTodos.map((todo) => (
              <li
                id={todo.id}
                key={todo.id}
                className="flex items-center gap-3 p-1 m-0 group"
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleComplete(todo.id)}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="w-4 h-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="line-through text-gray-500 select-none">
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-red-500 opacity-100 hover:opacity-50 transition-opacity p-1 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
