import { JSDOM } from 'jsdom';
import { NextResponse } from 'next/server';
import SoundCloud from 'soundcloud.ts';

import { basicApiEndpoint } from '../../../_helpers/basicApiEndpoint';

export const POST = basicApiEndpoint(async (req: Request) => {
    const { scTrackUrlOrIdArray, withLikes } = await req.json()

    const sc = new SoundCloud();

    console.log('scTrackUrlOrIdArray', scTrackUrlOrIdArray)
    let trackData = await sc.tracks.getArrayV2(scTrackUrlOrIdArray);

    var allTrackLikes: ({ trackId: number, userIds: string[] } | Error)[] | undefined = undefined;

    if (withLikes) {
        allTrackLikes = await Promise.all(trackData.map(async (track) => {
            const strippedTrackUrl = track.permalink_url.replace('https://soundcloud.com/', '');

            // let user = userData;
            // URLFORMAT: https://soundcloud.com/head-lamp/cool-dry-place-headlamp-1/likes
            const likesResp = await fetch(`https://soundcloud.com/${strippedTrackUrl}/likes`);

            if (likesResp.status !== 200) {
                return new Error(`(code: ${likesResp.status})`)
            }
            else {
                const likesRespText = await likesResp.text()

                // Initialize JSDOM
                const dom = new JSDOM(likesRespText);
                const document = dom.window.document;

                const section = document.querySelector('section');
                const userIds: string[] = [];

                if (section) {
                    const articles = section.querySelectorAll('article');
                    articles.forEach(article => {
                        const userLink = article.querySelector('a[itemprop="url"]');
                        if (userLink) {
                            const href = userLink.getAttribute('href');
                            if (href) {
                                const parts = href.split('/');
                                const userId = parts[parts.length - 1];
                                userIds.push(userId);
                            }
                        }
                    });
                }

                return {
                    trackId: track.id,
                    userIds
                }
            }
        }))
    }

    console.log('allTrackLikes', allTrackLikes)

    return NextResponse.json({
        trackData,
        allTrackLikes: allTrackLikes?.filter((x) => !(x instanceof Error))
    })
})