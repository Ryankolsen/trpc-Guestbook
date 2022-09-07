import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";

type FormInputs = {
  messageContent: string;
};
type ComponentInputs = {
  messageId: string;
  setMessageId: React.Dispatch<React.SetStateAction<string>>;
};

const EditMessage = ({ messageId, setMessageId }: ComponentInputs) => {
  const { data: message, isLoading } = trpc.useQuery([
    "guestbookgetOne",
    { messageId: messageId },
  ]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const postEdit = trpc.useMutation("guestbookeditPost", {
    onMutate: () => {
      ctx.cancelQuery(["guestbookgetAll"]);

      const optimisticUpdate = ctx.getQueryData(["guestbookgetAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["guestbookgetAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["guestbookgetAll"]);
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (session && session.user) {
      if (session?.user.name === message?.name && message?.id) {
        await postEdit.mutate({
          id: message?.id,
          message: data.messageContent,
        });
        setMessageId("");
        reset();
      }
    }
    console.error("not authorized");
  };

  const ctx = trpc.useContext();
  const { data: session } = useSession();

  if (isLoading) return <div>Fetching Messages</div>;

  return (
    <div>
      <h1 className="py-2 text-xl">Edit This Post</h1>
      <form className="flex justify-around" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="px-4 py-2 w-96 border border-violet-700 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none "
          {...register("messageContent", { required: true, maxLength: 100 })}
          placeholder={message?.message}
        />
        {errors.messageContent && (
          <p>Error, please try again {errors.messageContent.message}</p>
        )}
        <button
          className="sm:h-12 my-auto ml-5 p-2 bg-zinc-800 rounded-md border-2 border-violet-700 focus:outline-none"
          type="submit"
        >
          Revise
        </button>
      </form>
    </div>
  );
};

export default EditMessage;
