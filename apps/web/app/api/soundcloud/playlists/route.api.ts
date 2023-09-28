import { NextResponse } from 'next/server';
import SoundCloud from 'soundcloud.ts';

import { basicApiEndpoint } from '../../_helpers/basicApiEndpoint';

export const POST = basicApiEndpoint(async (req: Request) => {
  const { scPlaylistUrl } = await req.json()

  const sc = new SoundCloud();

  console.log('scPlaylistUrl', scPlaylistUrl)
  let playlistData = await sc.playlists.getV2(scPlaylistUrl);

  return NextResponse.json({
    playlistData: playlistData
  })
})