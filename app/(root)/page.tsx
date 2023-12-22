import ThreadCard from "@/components/card/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { UserButton, currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
 
export default async function Home() {
  const result = await fetchPosts(1, 30)
  const user = await currentUser()

  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  
  return (
    <>
    <h1 className="head-text text-left">Home</h1>

    <section className="mt-9 flex flex-col gap-10">
      {
        result.posts.length === 0 ? (
          <p className="no-results">No Threads Found</p>
        ) : (
          <>
          {
            result.posts.map((post) => (
              <ThreadCard
              key={post._id}
              id={post._id}
              currentUserId={user?.id || ''}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
              />
            ))
          }
          </>
        )
      }
    </section>
    </>
  )
} 