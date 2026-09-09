import { useState } from "react";
import { useForm } from "react-hook-form";
import { PRIORITY_DEFAULT } from "../../constants/priorities";
import { TodoFormFields } from "../TodoFormFields/TodoFormFields";
import { yupResolver } from "@hookform/resolvers/yup";
import { getTodoSchema } from "../../schemas/todo";
import styles from "./TodoForm.module.css";

export function TodoForm({ onCreate }) {
  const [showAllFields, setShowAllFields] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getTodoSchema({ isNew: true })),
    defaultValues: {
      description: "",
      deadline: "",
      priority: PRIORITY_DEFAULT,
      completed: false,
    },
  });

  function handleCreate(data) {
    onCreate(data);
    reset();
  }

  return (
    <section>
      <h3 className={styles.Title}>
        New To-Do
        <button onClick={() => setShowAllFields(!showAllFields)}>
          {showAllFields ? "Hide" : "Show"} all fields
        </button>
      </h3>

      <form className={styles.Form} onSubmit={handleSubmit(handleCreate)}>
        <TodoFormFields
          showAllFields={showAllFields}
          register={register}
          errors={errors}
        />
        <input type="submit" value="Add" />
      </form>
    </section>
  );
}
