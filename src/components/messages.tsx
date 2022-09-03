import { trpc } from "../utils/trpc";

const Messages = () => {
  const { data: messages, isLoading } = trpc.useQuery(["guestbookgetAll"]);

  if (isLoading) return <div>Fetching Messages</div>;

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1>Messages</h1>
      {messages?.map((msg, index) => {
        return (
          <div key={index}>
            <p>{msg.name}</p>
            <p>{msg.message}</p>
          </div>
        );
      })}
    </div>
  );
};
export default Messages;
