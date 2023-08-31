import React from 'react';
import {AppState, StyleSheet} from 'react-native';
import {Text, Box, Button, Container, Image} from 'native-base';
import {images} from '../res';
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    useTrackPlayerEvents,
    usePlaybackState,
    TrackPlayerEvents,
    STATE_PLAYING,
    Event,
} from 'react-native-track-player';
class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            audio: 'https://api.lradio.ru/air-mobile',
            isPlaying: false,
            playingArtist: '',
            playingTrack: '',
        }

        this.handlePlayAudio = this.handlePlayAudio.bind(this);
        this.getCurrentTrack = this.getCurrentTrack.bind(this);
        this.setupTrackPlayer = this.setupTrackPlayer.bind(this);
    }

    async setupTrackPlayer() {
        const { audio, playingArtist, playingTrack } = this.state;
        const songs = [{
            id: 1,
            url: audio,
            artist: playingArtist,
            title: playingTrack,
            artwork: require('../res/images/vania-logo.png')
        }];

        TrackPlayer.setupPlayer().then(async () => {
            console.log('Player ready');
            await TrackPlayer.addEventListener(Event.PlaybackState, (e) => {
                console.log('Player state:', e.state === 'playing');
                let isPlaying = e.state === 'playing';
                this.setState({ isPlaying: isPlaying });
            });
            await TrackPlayer.reset();
            await TrackPlayer.add(songs);
            //TrackPlayer.play();
            //this.setState({ isPlaying: true });

            await TrackPlayer.updateOptions({
                stopWithApp: false,
                autoHandleInterruptions: true,
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                ],
                android: {
                    appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                    alwaysPauseOnInterruption: true,
                },
                icon: 'ic_launcher_round',
            });
        });
        /*
        TrackPlayer.addEventListener(Event.PlaybackMetadataReceived, (event) => {
            console.log(event)
            this.setState({
                playingArtist: event.artist,
                playingTrack: event.title
            });
        });
        */
    }

    async getCurrentTrack() {
        const { playingArtist, playingTrack } = this.state;
        try {
            const response = await fetch('https://air.unmixed.ru/status-json.xsl');
            const json = await response.json();
            json?.icestats?.source?.forEach((track) => {
                if (track.listenurl.match(/\/lradiomaster1$/)) {
                    let changed = false;
                    const trackTitleEncoded = decodeURIComponent(escape(track.title));
                    const trackTitle = trackTitleEncoded.replace("'", "\'").split('-');
                    if (trackTitle[0].trim() === '«L»') {
                        trackTitle[0] = '«L» - радио';
                        trackTitle[1] = '';
                    }
                    changed = true;
                    if (playingArtist !== (trackTitle[0].trim() || '«L» - радио') && (playingTrack !== trackTitle[1].trim())) {
                        changed = true;
                    }
                    this.setState({
                        playingArtist: trackTitle[0].trim() || '«L» - радио',
                        playingTrack: trackTitle[1].trim() || ''
                    });
                    TrackPlayer.updateMetadataForTrack(0, {
                        artist: playingArtist,
                        title: playingTrack,
                        artwork: require('../res/images/vania-logo.png')
                    });

                    console.log('AppState: ' + AppState.currentState);
                    /*
                    if (AppState.currentState.match(/inactive|background/)) {
                        //console.log(changed);
                        if (changed) this.DisplayNotification();
                    } else {
                        this.onCancelNotification();
                    }
                    */
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    handlePlayAudio = () => {
        const { isPlaying } = this.state;
        console.log('handlePlayAudio', isPlaying);
        if (!isPlaying) {
            TrackPlayer.play();
            this.setState({ isPlaying: true });
        } else {
            TrackPlayer.pause();
            this.setState({ isPlaying: false });
        }
    }

    componentDidMount() {
        this.setupTrackPlayer();
    }


    render() {
        const {audio, isPlaying, isBusy, playingArtist, playingTrack} = this.state;
        if (audio) {
            return (
                <>
                    <Box
                        alignItems="center"
                        justifyContent="center"
                        bg={'#D2151C'}
                        py="0"
                        px="0"
                        height="100%"
                        width="100%"
                    >
                        <Box
                            width="270"
                            maxH="223"
                            alignItems="center"
                            position="relative"
                        >
                            <Image
                                key={`play-${images.logo}`}
                                source={images.logo}
                                height="100%"
                                width="100%"
                                alt=""
                            />
                        </Box>
                        <Button
                            variant="unstyled"
                            style={{
                                marginTop: 60,
                            }}
                            onPress={() => this.handlePlayAudio()}
                        >
                            <Image
                                key={isPlaying ? images.pause : images.play}
                                source={isPlaying ? images.pause : images.play}
                                size="md"
                                alt=""
                            />
                        </Button>
                        <Text
                            mt="3"
                            fontSize="md"
                            color="white"
                            fontFamily="montserrat-regular"
                            fontWeight="400"
                        >
                            {playingArtist}
                        </Text>
                        <Text
                            mt="2"
                            fontSize="lg"
                            color="#FFFFFF"
                            fontWeight="600"
                            fontFamily="montserrat-semiBold"
                        >
                            {isPlaying ? `${playingTrack}` : `Поток на паузе`}
                        </Text>
                    </Box>
                </>
            );
        }
        return null;
    }
}

export default Player;