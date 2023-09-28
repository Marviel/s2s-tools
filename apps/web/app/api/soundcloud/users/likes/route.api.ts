import { NextResponse } from 'next/server';
import SoundCloud from 'soundcloud.ts';
import { basicApiEndpoint } from '../../../_helpers/basicApiEndpoint';

/**
 * Gets all likes by given user ids
 */
export const POST = basicApiEndpoint(async (req: Request) => {
    const { scUserIds } = await req.json()

    const sc = new SoundCloud();

    const usersWithLikes = (await Promise.all(scUserIds.map(async (scUserId) => {
        const userData = await sc.users.getV2(scUserId)
        console.log('userData', userData)

        if (userData) {
            // console.log(await likesResp.text())
            // let likes = 
            // console.log('likes', likes)

            return {
                scUserData: userData,
                likes: []
            }
        }
        
            return null;
        
    })))
        .filter((x) => x !== null)

    return NextResponse.json({
        usersWithLikes
    })
})