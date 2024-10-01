import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface JsonFormProps {
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
}

const JsonForm: React.FC<JsonFormProps> = ({ initialData, onSubmit }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData
  });

  const onSubmitHandler: SubmitHandler<Record<string, any>> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {Object.keys(initialData).map((key) => (
        <div key={key}>
          <label>{key}</label>
          <input {...register(key)} />
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};

export default JsonForm;