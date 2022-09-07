import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
            className="rounded-md flex  border px-4 py-2 border-violet-500 "
            key={index}
          >
            <div className="w-[400px]">
              <p className=" mb-2">
                <Link href={`/users/${msg.name}`}>
                  <a> {msg.name}</a>
                </Link>{" "}
                posted:
              </p>

              <p>
                {" "}
                <a>{msg.message} </a>
              </p>
            </div>
            <div className=" w-auto flex self-end pb-2">
              {session?.user?.name === msg.name ? (
                <button
                  className="sm:h-10 hover:bg-gray-900 my-auto ml-5 p-2 bg-zinc-800 rounded-md border-2 border-violet-700 focus:outline-none"
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
