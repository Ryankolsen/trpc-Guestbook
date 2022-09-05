import Error from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import type { NextPage } from "next";

const PostsByUser: NextPage = (props) => {
  const router = useRouter();

  const userName = router.query.userName as string;

  //TODO change query to get by authorId
  const { data, isLoading } = trpc.useQuery([
    "guestbookgetPostsByAuthor",
    { userName: userName },
  ]);

  if (isLoading) {
    return <p> Loading...</p>;
  }
  if (!data) {
    return (
      <p>
        <Error statusCode={404} />
      </p>
    );
  }
  return (
    <div>
      <div className="p-4">
        <h1 className=" text-xl">All Posts By: {userName}</h1>
        <p className="mt-5">Total number of posts: {data.length}</p>
      </div>
      <div className="sm:w-11/12 mx-auto">
        <div className="text-4xl text-center mb-6 sm:max-w-[1000px]">
          All Posts
        </div>
        {data ? (
          <div className="rounded-md   border px-4 py-2 border-violet-500 sm:max-w-[1000px]">
            {data.map((msg) => (
              <div key={msg.id} className="p-4  ">
                {" "}
                <p>{msg.message}</p>
                <p>{}</p>
              </div>
            ))}{" "}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostsByUser;
