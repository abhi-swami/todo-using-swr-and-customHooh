import { useState } from "react";

import AddTodos from "./components/todos/addTodo";
import { useFetch, BASE_URL } from "./hooks/useFetch";
import EditTodo from "./components/todos/editTodo";
import useSWR from "swr";

const Todos = () => {
  const getFetcher = () => getMehtod("todos");
  const { getMehtod, otherMethod } = useFetch();

  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editTodo, setEditTodo] = useState({});

  const data = useSWR(`${BASE_URL}todos`, getFetcher);

  const { data: allTodos, mutate } = data;

  console.log("allData", data);

  const addNewTodo = async (obj) => {
    try {
      const res = await otherMethod(`todos`, "POST", obj);
      console.log("res", res);
    } catch (err) {
      console.log(err);
    }
  };

  const editExistingTodo = async (key, obj) => {
    try {
      const res = await otherMethod(`todos/${key}`, "PUT", obj);
      console.log("res", res);
    } catch (err) {
      console.log(err);
    }
  };

  // const toggleMutation = useMutation({
  //   mutationFn: ( {key, todo} ) => {
  //     console.log("key is", key,todo);
  //     const obj = { ...todo, completed: !todo.completed };
  //     return otherMethod(`todos/${key}`, "PUT", obj);
  //   },
  //   onSuccess: () => {
  //     refetch();
  //   },
  //   onError: (error) => {
  //     console.error("Failed to toggle todo:", error);
  //   },
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: ({ key, obj }) => {
  //     return otherMethod(`todos/${key}`, "DELETE", obj);
  //   },
  //   onSuccess: () => {
  //     refetch();
  //   },
  //   onError: (error) => console.log(error),
  // });

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleAddTodo = () => {
    const obj = {
      id: allTodos.length + 1,
      title: inputValue,
      completed: false,
    };
    addNewTodo(obj);
  };

  const handleToggle = (key, todo) => {
    const updatedTodo ={...todo,completed:!todo.completed}
    editExistingTodo(key, updatedTodo);
    // toggleMutation.mutate({ key, todo });
  };

  const handleEdit = (key, todo) => {
    setIsModalOpen((prev) => !prev);
    setEditTodo({ ...todo });
  };

  const handleEditSubmit = (todo) => {
    const key = todo.id;
    toggleMutation.mutate({ key, todo });
    setIsModalOpen(false);
  };

  const handleDelete = (key) => {
    const obj = {};
    deleteMutation.mutate({ key, obj });
  };

  return (
    <>
      <section className="w-full">
        <AddTodos
          value={inputValue}
          onInputchange={handleInputChange}
          onAddTodo={handleAddTodo}
        />
        {allTodos &&
          allTodos.map((individualTodo) => (
            <div key={individualTodo.id} className="flex py-2">
              <div className="flex-1 flex justify-star items-center">
                <p className="inline text-left px-2">{individualTodo.id}</p>
                <p className="truncate text-left">{individualTodo.title}</p>
              </div>
              <div className="flex gap-x-3">
                <button
                  className={`border border-gray-500 px-2 py-1 rounded cursor-pointer ${
                    individualTodo.completed
                      ? "text-green-700"
                      : "text-yellow-400"
                  }`}
                  onClick={() =>
                    handleToggle(individualTodo.id, individualTodo)
                  }
                >
                  {individualTodo.completed ? "Done" : "Pending"}
                </button>
                <button
                  className={`border border-gray-500 px-2 py-1 rounded cursor-pointer`}
                  onClick={() => handleEdit(individualTodo.id, individualTodo)}
                >
                  Edit
                </button>
                <button
                  className="border border-gray-500 px-2 py-1 rounded cursor-pointer"
                  onClick={() => handleDelete(individualTodo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </section>
      <EditTodo
        todo={editTodo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen((prev) => !prev)}
        onEdit={handleEditSubmit}
      />
    </>
  );
};

export default Todos;
