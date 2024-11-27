/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {

    // eslint-disable-next-line prefer-const
    let feed: Feed[] = [];

    if(req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }


    const session = await getServerAuthSession({ req, res });

    if (!session?.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {data: followings, error: followingsError} = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`);

    const followingIds = followings ? followings.map((f) => f.user_id === session.user.id ? f.friend_id : f.user_id) : [];

    
    const { data: booksActivity, error } = await supabase
        .rpc("get_library_books_from_friends", { friends: followingIds });


    

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    for (const activity of booksActivity) {
        feed.push({
            friend_id: activity.user_id,
            created_at: activity.created_at,
            activity: activity.status,
            activity_id: activity.title,
        });
    }

    

    const {data: challengesCreatedByFriends, error: challengesCreatedByFriendsError} = await supabase
    .from("challenges")
    .select("*")
    .in("created_by", followingIds);

    if (challengesCreatedByFriendsError) {
        console.error(challengesCreatedByFriendsError);
        return res.status(500).json({ error: challengesCreatedByFriendsError.message });
    }

    for (const challenge of challengesCreatedByFriends) {
        feed.push({
            friend_id: challenge.created_by,
            created_at: challenge.created_at,
            activity: "createdChallenge",
            activity_id: challenge.name
        });

    }

    const {data: challengesActivity, error: challengesError} = await supabase
    .rpc("get_challenges_joined_by_friends", { friends: followingIds });

    if (challengesError) {
        console.error(challengesError);
        return res.status(500).json({ error: challengesError.message });
    }

    for (const challenge of challengesActivity) {
        feed.push({
            friend_id: challenge.user_id,
            created_at: challenge.joined_at,
            activity: "joinedChallenge",
            activity_id: challenge.challenge_name
        });
    }

    const {data: friendsRating, error: friendsRatingError} = await supabase
    .rpc("get_friends_ratings", { friends: followingIds });

    

    if (friendsRatingError) {
        console.error(friendsRatingError);
        return res.status(500).json({ error: friendsRatingError.message });
    }

    for (const rating of friendsRating) {
        feed.push({
            friend_id: rating.user_id,
            created_at: rating.created_at,
            activity: "ratedBook " + rating.rating,
            activity_id: rating.title
        });
    }

    feed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    feed.splice(6);

    res.status(200).json(feed satisfies Feed[]);

};


export type Feed = {
    friend_id: string;
    created_at: string;
    activity: string;
    activity_id: string;
}

export default handler;