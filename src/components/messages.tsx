import { trpc } from "../utils/trpc";

const Messages = () => {
  const { data: messages, isLoading } = trpc.useQuery(["guestbookgetAll"]);

  if (isLoading) return <div>Fetching Messages</div>;

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-2xl">Messages</h1>
      {messages?.map((msg, index) => {
        return (
          <div
            className="rounded-md  border px-4 py-2 border-violet-500"
            key={index}
          >
            <p className="w-48 mx-auto mb-5">{msg.name} posted:</p>
            <p>{msg.message}</p>
          </div>
        );
      })}
    </div>
  );
};
export default Messages;
