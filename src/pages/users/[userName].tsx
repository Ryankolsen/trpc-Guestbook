import Error from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import type { NextPage } from "next";
import Link from "next/link";

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
        <h1 className=" text-xl">Posts By {userName}</h1>
        <p className="mt-2">Total number of posts: {data.length}</p>
      </div>
      <div className="sm:w-11/12 sm:mx-auto">
        <div className="text-4xl text-center mb-6 ">All Posts</div>
        {data ? (
          <div className="rounded-md   border px-4 py-2 border-violet-500 ">
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
      <div className="pt-12 text-center">
        <Link href={"/"}>
          <button className="sm:h-12 my-auto ml-5 p-2 bg-zinc-800 rounded-md border-2 border-violet-700 focus:outline-none">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PostsByUser;
