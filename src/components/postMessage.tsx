import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";

type Inputs = {
  message: string;
};

const PostMessage = () => {
  const ctx = trpc.useContext();
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const postMessage = trpc.useMutation("guestbookpostMessage", {
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
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (session?.user?.name) {
      await postMessage.mutate({
        name: session?.user?.name as string,
        message: data.message,
      });
      reset();
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="px-4 py-2 w-96 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none "
          {...register("message", { required: true, maxLength: 100 })}
          placeholder="Your Message"
        />

        <button
          type="submit"
          className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default PostMessage;
