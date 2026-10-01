import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/user.model.js";


export async function protectRoute(req,res,next){
    try{
        const auth = getAuth(req);
        const { userId } = auth;
        if (!userId){
            res.status(401).json({ message: "Unauthorized" });
            return;

        }
        let user = await User.findOne({ clerkId: userId });

        if(!user){
            const clerkUser = await clerkClient.users.getUser(userId);
            const email =
                clerkUser.emailAddresses?.find(
                    (address) => address.id === clerkUser.primaryEmailAddressId,
                )?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;
            const fullName =
                [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
                clerkUser.username ||
                email?.split("@")[0];

            if (!email || !fullName) {
                res.status(422).json({ message: "Your account is missing a name or email address" });
                return;
            }

            user = await User.findOneAndUpdate(
                { clerkId: userId },
                {
                    clerkId: userId,
                    email,
                    fullName,
                    profilePic: clerkUser.imageUrl ?? "",
                },
                { new: true, upsert: true, setDefaultsOnInsert: true },
            );
        }
        req.auth = auth;
        req.user = user;
        next();


    }
    catch(error){
        console.error("Error in protectRoute middleware:",error.message);
        res.status(500).json({message: "Internal server error"});



    }
}