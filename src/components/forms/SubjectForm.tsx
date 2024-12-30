"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationsSchemas";
import { createSubject } from "@/lib/actions";
import { useFormState } from "react-dom";

const SubjectForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useFormState(createSubject, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="font-semibold text-xl">
        {type === "create"
          ? "Створити новий предмет"
          : "Оновити інформацію про предмет предмет"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Інформація для входу
      </span>
      {/* INPUTS */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Назва предмету"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
      </div>
      {state.error && <span className="text-red-500 ">Помилка</span>}
      <button className="bg-purple text-white p-2 rounded-md ">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;
