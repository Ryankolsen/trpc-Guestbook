import Error from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import type { NextPage } from "next";

const SinglePost: NextPage = (props) => {
  const router = useRouter();
  const postId = router.query.post as string;

  //TODO change query to get single Post
  const { data, isLoading } = trpc.useQuery([
    "guestbookgetOne",
    { messageId: postId },
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
      <h1>{data.message}</h1>
    </div>
  );
};

export default SinglePost;
