import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import React, { use } from "react";


const Page = async () => {
    
    const user = await currentUser()
    
    const userInfo = {}

    const userdata = {
        id : user?.id,
        objectId: userInfo?._id,
        username : userInfo?.username || user?.firstName || "",
        user : userInfo?.name || user?.firstName || "",
        bio : userInfo?.bio || "",
        image : userInfo?.image || user?.imageUrl
    }

    
    
  return (
    <main className="mx-auto flex flex-col justify-start max-w-3xl px-20 py-20">
      <h1 className="head-text">On Boarding</h1>
      <p className="mt-3 text-base-regular text-light-2">Complete Your profile now to use Threads</p>

      <section className="mt-10 bg-dark-2 p-10">
        <AccountProfile user={userdata} btnTitle="Continue"/>
      </section>
    </main>
  );
};

export default Page;
