import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";

type Inputs = {
  message: string;
};

const PostMessage = () => {
  const ctx = trpc.useContext();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
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
    if (errors) {
      console.log(errors.message);
    }
  };
  return (
    <div>
      <h1 className="py-2 text-xl">Post a Message</h1>
      <form className="flex justify-around" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="px-4 py-2 w-96 border border-violet-700 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none "
          {...register("message", { required: true, maxLength: 100 })}
          placeholder="Your Message"
        />

        <button
          type="submit"
          className="h-12 my-auto ml-5 p-2 bg-zinc-800 rounded-md border-2 border-violet-700 focus:outline-none"
        >
          Submit Now
        </button>
      </form>
    </div>
  );
};

export default PostMessage;
