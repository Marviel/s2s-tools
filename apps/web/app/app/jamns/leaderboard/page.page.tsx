"use client"
import React, { useState } from 'react';

import { SoundcloudPlaylistV2 } from 'soundcloud.ts';

import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useAsyncEffect } from '../../../../utils/hooks';

function useStateStatus<T>(initialState?: T){
  const [state, setState] = useState<{status: 'idle', data?: T} | {status: 'fetching', data?: T} | {status: 'done', data: T}>(initialState ? {
    status: 'done',
    data: initialState,
  } :{
    status: 'idle',
  });

  return {
    status: state.status,
    data: state.data,
    full: state,
    setter: setState,
  }
}

type PlaylistStub = {
  label: string,
  url: string,
  id?: string,
}




const S2S_SERVER_MEMBERS: {
  name?: string,
  soundCloudPermalink: string,
  altSoundCloudPermalinks?: string[],
}[] = [
  {
    soundCloudPermalink: 'gridzillah',
  },
  {
    soundCloudPermalink: 'spooqs',
    altSoundCloudPermalinks: ['chrono-tricker']
  },
  {
    soundCloudPermalink: 'head-lamp',
    altSoundCloudPermalinks: ['warped-attention'],
  },
  {
    name: 'Clockmangle',
    soundCloudPermalink: 'clockmangle',
  },
  {
    name: 'Jono En',
    soundCloudPermalink: 'jono_en',
  },
  {
    name: 'Max Palmer',
    soundCloudPermalink: 'max-palmer-422097728',
  },
  {
    name: 'Fabvanput',
    soundCloudPermalink: 'fabvanput',
  },
  {
    name: 'Tempotanglez',
    soundCloudPermalink: 'tempotanglez',
  },
  {
    name: 'Mount Ocean',
    soundCloudPermalink: 'mountoceanmusic',
  },
  {
    name: 'David Weddle',
    soundCloudPermalink: 'david-weddle-662711552',
  },
  {
    name: 'Colin Tilleman',
    soundCloudPermalink: 'colintilleman',
  },
  {
    name: 'MJP Taque',
    soundCloudPermalink: 'mjptaque',
  },
  {
    name: 'Tantal Twister',
    soundCloudPermalink: 'tantal_twister',
  },
  {
    name: 'PJ4533',
    soundCloudPermalink: 'pj4533',
  },
  {
    name: 'Tom Parson',
    soundCloudPermalink: 'tomparson',
  },
  {
    name: 'Federico Silva Ponte',
    soundCloudPermalink: 'federico-silva-ponte',
  },
  {
    name: 'Yohgi-39138242',
    soundCloudPermalink: 'yohgi-39138242',
  },
  {
    name: 'Godsine',
    soundCloudPermalink: 'godsine',
  },
  {
    name: 'Tempo M Tat',
    soundCloudPermalink: 'tempo-m-tat',
  },
  {
    name: 'Josip Antevulic SC2',
    soundCloudPermalink: 'josipantevulic-sc2',
  },
  {
    name: 'Techy White',
    soundCloudPermalink: 'techywhite',
  },
  {
    name: 'Miami Milkshake',
    soundCloudPermalink: 'miamimilkshake',
  },
  {
    name: 'Billy Pilgrim Fluxin',
    soundCloudPermalink: 'billy_pilgrim_fluxin',
  },
  {
    name: 'Mike A 71386919',
    soundCloudPermalink: 'mike-a-71386919',
  },
  {
    name: 'Eruditex',
    soundCloudPermalink: 'eruditex',
  },
  {
    name: 'User 989753770',
    soundCloudPermalink: 'user-989753770',
  },
  {
    name: 'Tempo Shlempo',
    soundCloudPermalink: 'tempo-shlempo',
  },
  {
    name: 'Sonic Celebration',
    soundCloudPermalink: 'sonic-celebration',
  },
  {
    name: 'Gibsong Music',
    soundCloudPermalink: 'gibsongmusic',
  },
  {
    name: 'Drew Willard',
    soundCloudPermalink: 'drewwillard',
  }
]

const DEFAULT_PLAYLISTS: PlaylistStub[] = [
  {
    label: 'Fluxjamns 2023 Day 1',
    url: 'https://soundcloud.com/gridzillah/sets/fluxjamns-day-1',
  },
  {
    label: 'Fluxjamns 2023 Day 2',
    url: 'https://soundcloud.com/gridzillah/sets/fluxjamns-day-2',
  }
]

const App: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState<string>(DEFAULT_PLAYLISTS[0].url);
  const {
    full: playlist,
    setter: setPlaylist,
  } = useStateStatus<SoundcloudPlaylistV2 | undefined>(undefined);

  const {
    full: allTrackLikes,
    setter: setAllTrackLikes,
  } = useStateStatus<{trackId: number, userIds: string[]}[]>();
  const [sortStrategy, setSortStrategy] = useState<'likes' | 'likes-by-artists'| 'likes-by-s2s-members'>('likes-by-s2s-members');

  const handleChange = (event) => {
    setPlaylistUrl(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setPlaylist({
      status: 'fetching',
    })

    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scPlaylistUrl: playlistUrl })
    };
    const response = await fetch('/api/soundcloud/playlists', requestOptions);
    const {playlistData} = await response.json();

    setPlaylist({
      status: 'done',
      data: playlistData,
    });
  }


  /**
   * Whenever the playlist is loaded, we need to grab all the tracks individually
   */
  useAsyncEffect(async () => {
    if (playlist.status === 'done' && playlist.data){
      setAllTrackLikes({
        status: 'fetching',
      });
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withLikes: true, scTrackUrlOrIdArray: playlist.data.tracks.map((t) => t.id) })
      };
      const response = await fetch('/api/soundcloud/tracks/getArray', requestOptions);
  
      const respJson = await response.json();

      const _allTrackLikes = respJson.allTrackLikes;

      setAllTrackLikes({
        status: 'done',
        data: _allTrackLikes.map((curr) => {
          return {
            trackId: curr.trackId,
            userIds: curr.userIds,
          };
        })
      });
    }
  }, [playlist])

  const artistsInPlaylist = playlist?.data?.tracks.map((t) => t.user.permalink.toString());

  // Likes by people who also had a track in the playlist.
  const likesByArtistsInPlaylist = allTrackLikes.status === 'done' ? {
    status: 'done',
    data: allTrackLikes.data.map((curr) => {
      const thisTrackLikesByPlaylistArtists = curr.userIds.filter((userId) => artistsInPlaylist?.find((t) => t === userId));

      return {
        trackId: curr.trackId,
        // Remove any userIds that don't have a track in the playlist
        userIds: thisTrackLikesByPlaylistArtists,
        numLikes: thisTrackLikesByPlaylistArtists.length,
      };
    })
  }
  :
  {
    status: allTrackLikes.status
  }

  const likesByS2SMembers = allTrackLikes.status === 'done' ? {
    status: 'done',
    data: allTrackLikes.data.map((curr) => {
      // Check if any of the userIds are in the S2S server members list
      // Either their main account or their alts.
      const thisTrackLikesByS2SMembers = curr.userIds.filter((userId) => S2S_SERVER_MEMBERS.find((m) => m.soundCloudPermalink === userId || m.altSoundCloudPermalinks?.find((a) => a === userId)));

      return {
        trackId: curr.trackId,
        // Remove any userIds that don't have a track in the playlist
        userIds: thisTrackLikesByS2SMembers,
        numLikes: thisTrackLikesByS2SMembers.length,
      };
    })
  }
  :
  {
    status: allTrackLikes.status
  }

  const tracksOrdered = playlist?.data?.tracks.sort((a, b) => {
    if (sortStrategy === 'likes'){
      return b.likes_count - a.likes_count;
    } else if (sortStrategy === 'likes-by-artists'){
      if (likesByArtistsInPlaylist.status !== 'done'){
        return 0;
      }
      else {
        const aLikes = likesByArtistsInPlaylist.data.find((t) => t.trackId === a.id)?.numLikes || -1;
        const bLikes = likesByArtistsInPlaylist.data.find((t) => t.trackId === b.id)?.numLikes || -1;

        return bLikes - aLikes;
      }
    }
    else if (sortStrategy === 'likes-by-s2s-members'){
      if (likesByS2SMembers.status !== 'done'){
        return 0;
      }
      else {
        const aLikes = likesByS2SMembers.data.find((t) => t.trackId === a.id)?.numLikes || -1;
        const bLikes = likesByS2SMembers.data.find((t) => t.trackId === b.id)?.numLikes || -1;

        return bLikes - aLikes;
      }
    }
    else {
      return 0;
    }
  })

  return (
    <Stack style={{padding: '20px'}} gap={1}>
        <Card elevation={2} sx={{padding: '10px', alignItems: 'center', justifyItems: 'center'}}>
            <form onSubmit={handleSubmit}>
                <Stack width={'100%'} gap={1} alignContent='center' justifyContent={'center'} alignItems={'center'} justifyItems={'center'}>
                    {/* A mui Autocomplete picker which will let us choose urls from our predefined list */}
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={DEFAULT_PLAYLISTS}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Load Predefined Playlist" />}
                        onChange={(event, newValue) => {
                          if (newValue){
                            setPlaylistUrl(newValue.url);
                          }
                        }}
                    />

                    {/* The playlist url */}
                    <TextField 
                        label="Playlist URL"
                        variant="outlined"
                        value={playlistUrl}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth={false}>
                        Load Playlist
                    </Button>
                </Stack>
            </form>
        </Card>
        <Paper>
          <FormControl>
            <Stack direction={'row'} spacing={2} sx={{padding: '10px'}}>
              <FormLabel id="demo-controlled-radio-buttons-group"><Typography>Sort</Typography></FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={sortStrategy}
                row
                onChange={(e) => setSortStrategy(e.target.value as any)}
              >
                <FormControlLabel value="likes" control={<Radio />} label="Likes" />
                <FormControlLabel value="likes-by-artists" control={<Radio />} label="Likes by Playlist Artists" />
                <FormControlLabel value="likes-by-s2s-members" control={<Radio />} label="Likes by S2S Members" />
              </RadioGroup>
            </Stack>
          </FormControl>
          <Grid container spacing={3} padding={2} justifyItems={'center'} alignItems={'center'} alignContent={'center'} justifyContent={'center'}>
            {
              playlist?.status === 'fetching' ? <CircularProgress /> : null
            }

              {tracksOrdered?.map(track => (
                  <Grid key={track.id} item>
                    <a href={track.permalink_url} >
                      <Card elevation={10} sx={{
                          padding: '10px', 
                          ':hover': {backgroundColor: '#eeeeee', borderShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', transform: 'scale(1.02)'},
                          height: '100%',
                          width: '200px',
                      }}>
                          <Typography variant="body1" sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: '1',
                              WebkitBoxOrient: 'vertical',
                          }}>
                            {track.title}
                          </Typography>
                          <Typography variant="body2">By {track.user.username}</Typography>
                          <img src={track.artwork_url ? track.artwork_url : track.user.avatar_url} alt={track.title}  width={'100%'} height={'fit-content'}/>
                            
                          <Typography variant='body2'>Likes: {track.likes_count}</Typography>
                          {
                            (() => {
                              if (likesByArtistsInPlaylist.status !== 'done'){
                                return null;
                              }
                              else {
                                const numLikes = likesByArtistsInPlaylist.data.find((t) => t.trackId === track.id)?.numLikes

                                return numLikes === undefined ? null : <Typography variant='body2'>Likes by Playlist Artists: {numLikes}</Typography>
                              }
                            })()
                          }
                          {
                            (() => {
                              if (likesByS2SMembers.status !== 'done'){
                                return null;
                              }
                              else {
                                const numLikes = likesByS2SMembers.data.find((t) => t.trackId === track.id)?.numLikes

                                return numLikes === undefined ? null : <Typography variant='body2'>Likes by S2S Members: {numLikes}</Typography>
                              }
                            })()
                          }
                      </Card>
                      </a>
                  </Grid>
              ))}
          </Grid>
        </Paper>
    </Stack>
  );
}

export default App;
