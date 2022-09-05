import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

type Inputs = {
  setMessageId: React.Dispatch<React.SetStateAction<string>>;
};
const Messages = ({ setMessageId }: Inputs) => {
  const { data: messages, isLoading } = trpc.useQuery(["guestbookgetAll"]);

  function handleClick(id: string) {
    setMessageId(id);
  }

  const { data: session } = useSession();
  if (isLoading) return <div>Fetching Messages</div>;

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-2xl">Messages</h1>
      {messages?.map((msg, index) => {
        return (
          <div
            className="rounded-md flex  border px-4 py-2 border-violet-500"
            key={index}
          >
            <div className=" w-[400px]">
              <p className=" mb-2">{msg.name} posted:</p>
              <p>{msg.message}</p>
            </div>
            <div className=" w-auto flex self-end">
              {session?.user?.name === msg.name ? (
                <button
                  onClick={() => {
                    handleClick(msg.id);
                  }}
                >
                  Edit
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Messages;
