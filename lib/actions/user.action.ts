"use server"

import { revalidatePath } from "next/cache";
import Users from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId : string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}

export async function updateUser({
    userId ,
    username,
    name,
    bio,
    image,
    path,
} : Params) : Promise<void>{
    
    try {
        
        connectToDB()
        
        await Users.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase(),
                name: name,
                bio: bio,
                image: image,
                onboarded: true
            },
            {upsert: true}
        );
    
        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error : any) {
        throw new Error(`Failed to create/updated User ${error.message}`)
    }
}

export async function fetchUser(userId:string) {
    try {
        connectToDB();
        

        return await Users
        .findOne({id: userId})
        // .populate()
    } catch (error : any) {
        throw new Error(`Failed to fetch User : ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
      connectToDB();
  
      // Find all threads authored by the user with the given userId
      const threads = await Users.findOne({ id: userId }).populate({
        path: "threads",
        model: Thread,
        populate: [
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: Users,
              select: "name image id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      });
      return threads;
    } catch (error) {
      console.error("Error fetching user threads:", error);
      throw error;
    }
  }

  export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
  } : {
    userId:string,
    searchString? : string,
    pageNumber?: number,
    pageSize? : number,
    sortBy: SortOrder
  }) {
    try {
      connectToDB()

      const skipAmount = (pageNumber - 1) * pageSize;

      const regex = new RegExp(searchString, "i");

      const query: FilterQuery<typeof Users> = {
        id : {$ne: userId}
      }

      if(searchString.trim() !== ''){
        query.$or = [
          {username : {$regex: regex}},
          {name : {$regex: regex}},
        ]
      }

      const sortOptions = {createdAt : sortBy}

      const usersQuery = Users.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

      const totalUsersCount = await Users.countDocuments(query)

      const users = await usersQuery.exec()

      const isNext = totalUsersCount > skipAmount + users.length

      return {users, isNext}
    } catch (error: any) {
      throw new Error(`Failed to fetch users : ${error.message}`)
    }
  }

export async function getActivity(userId:string) {
  try {
    connectToDB();

    const userThreads =  await Thread.find({author : userId});

    const childThreadIds = userThreads.reduce((acc,userThread)=>{
      return acc.concat(userThread.children)
    },[])

    const replies = await Thread.find({
      _id: {$in : childThreadIds},
      author: {$ne : userId}
    })
    .populate({
      path: 'author',
      model: Users,
      select: 'name image _id'
    })

    return replies
  } catch (error : any) {
    throw new Error(`Failed fetch Activity : ${error.message}`)
  }
}