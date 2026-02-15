import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// import "videojs-hls-quality-selector"; // We are using a custom implementation
import "videojs-contrib-quality-levels";
import { getVideoById } from "../services/api";
import { ArrowLeft, Loader2 } from "lucide-react";

interface VideoData {
    id: string;
    videoName: string;
    description: string;
    firebaseUrl: string;
    contentType: string;
}

const VideoPlayerPage: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const navigate = useNavigate();
    const videoNode = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any | null>(null);

    const [video, setVideo] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [debugInfo, setDebugInfo] = useState<any>({}); // For on-screen debugging

    useEffect(() => {
        const fetchVideo = async () => {
            if (!videoId) return;
            try {
                setLoading(true);
                const data = await getVideoById(videoId);
                setVideo(data);
            } catch (err) {
                console.error("Failed to fetch video details", err);
                setError("Failed to load video.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [videoId]);

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current && video) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');

            if (videoNode.current) {
                videoNode.current.appendChild(videoElement);
            }

            const player = playerRef.current = videojs(videoElement, {
                autoplay: false,
                controls: true,
                responsive: true,
                fluid: true,
                playbackRates: [0.5, 1, 1.5, 2],
                html5: {
                    hls: {
                        overrideNative: true
                    },
                    nativeVideoTracks: false,
                    nativeAudioTracks: false,
                    nativeTextTracks: false
                },
                sources: [] // Start with empty sources to ensure plugin listeners are set up before loading
            });

            player.ready(() => {
                console.log("Player is ready");

                // Custom Quality Selector Implementation
                if (player) {
                    const MenuButton = videojs.getComponent('MenuButton');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const MenuItem = videojs.getComponent('MenuItem') as any;

                    class QualityMenuItem extends MenuItem {
                        level: string | number;

                        constructor(player: any, options: any) {
                            const label = options.label;
                            const level = options.level;
                            super(player, {
                                label: label,
                                selectable: true,
                                selected: options.selected || false,
                            });
                            this.level = level; // 'auto' or level index
                        }

                        handleClick() {
                            const qualityLevels = (this.player_ as any).qualityLevels();
                            super.handleClick();

                            if (this.level === 'auto') {
                                // Enable all levels for auto
                                for (let i = 0; i < qualityLevels.length; i++) {
                                    qualityLevels[i].enabled = true;
                                }
                            } else {
                                // Enable only selected level
                                for (let i = 0; i < qualityLevels.length; i++) {
                                    qualityLevels[i].enabled = (i === this.level);
                                }
                            }
                        }
                    }

                    class QualitySelector extends MenuButton {
                        createItems() {
                            const qualityLevels = (this.player_ as any).qualityLevels();
                            const items = [];

                            // Auto Item
                            items.push(new QualityMenuItem(this.player_, {
                                label: 'Auto',
                                level: 'auto',
                                selected: true // Default to auto
                            }));

                            // Quality Items
                            for (let i = 0; i < qualityLevels.length; i++) {
                                const level = qualityLevels[i];
                                const label = level.height ? `${level.height}p` : `Level ${i}`;
                                items.push(new QualityMenuItem(this.player_, {
                                    label: label,
                                    level: i,
                                    selected: false
                                }));
                            }

                            return items;
                        }

                        buildCSSClass() {
                            return `vjs-quality-selector ${super.buildCSSClass()}`;
                        }
                    }

                    // Register and add component if not exists
                    if (!videojs.getComponent('QualitySelector')) {
                        videojs.registerComponent('QualitySelector', QualitySelector);
                    }

                    // Add to control bar if not added
                    const playerAny = player as any;
                    if (!playerAny.controlBar.getChild('QualitySelector')) {
                        const qualityButton = playerAny.controlBar.addChild('QualitySelector', {}, playerAny.controlBar.children_.length - 2);
                        // Add icon class to make it visible
                        qualityButton.addClass('vjs-icon-cog');
                        qualityButton.controlText('Quality');
                    }

                    // Re-update items when levels change (e.g., loadedmetadata)
                    const qualityLevels = playerAny.qualityLevels();

                    const handleQualityUpdate = () => {
                        const qualitySelector = playerAny.controlBar.getChild('QualitySelector');
                        if (qualitySelector) {
                            qualitySelector.update();
                        }
                        // Update debug info state
                        setDebugInfo((prev: any) => ({
                            ...prev,
                            qualityLevels: qualityLevels.length,
                            levels: qualityLevels
                        }));
                    };

                    qualityLevels.on('addqualitylevel', (event: any) => {
                        console.log("Quality level added:", event.qualityLevel);
                        handleQualityUpdate();
                    });

                    // Force initial update in case levels are already present
                    console.log("Initial Quality Levels:", qualityLevels.length);
                    if (qualityLevels.length > 0) {
                        handleQualityUpdate();
                    }

                    // Also listen to player loadedmetadata being the standard ready state for tracks
                    player.on('loadedmetadata', () => {
                        console.log("Metadata loaded. Levels:", qualityLevels.length);
                        handleQualityUpdate();
                        setDebugInfo((prev: any) => ({
                            ...prev,
                            tech: player.techName_,
                            duration: player.duration(),
                            vhs: (player.tech() as any).vhs ? 'Present' : 'Missing',
                            hls: (player.tech() as any).hls ? 'Present' : 'Missing',
                            vhsStats: (player.tech() as any).vhs?.stats || 'N/A'
                        }));

                        // Try accessing VHS representations directly as fallback logging
                        const vhs = (player.tech() as any).vhs;
                        if (vhs) {
                            console.log("VHS Object found:", vhs);
                            if (vhs.representations) {
                                console.log("VHS Representations:", vhs.representations());
                            }
                            if (vhs.playlists) {
                                console.log("VHS Playlists:", vhs.playlists);
                                if (vhs.playlists.master) {
                                    console.log("VHS Master Playlist:", vhs.playlists.master);
                                }
                            }
                        }
                    });

                    // Polling fallback
                    let checks = 0;
                    const intervalId = setInterval(() => {
                        checks++;
                        if (qualityLevels.length > 0) {
                            console.log(`Polling found levels at attempt ${checks}:`, qualityLevels.length);
                            handleQualityUpdate();
                        }
                        // Update polling status in debug
                        setDebugInfo((prev: any) => ({
                            ...prev,
                            pollingFor: checks,
                            currentLevels: qualityLevels.length
                        }));

                        if (checks >= 10 && qualityLevels.length === 0) {
                            clearInterval(intervalId);
                        } else if (qualityLevels.length > 0) {
                            clearInterval(intervalId);
                        }
                    }, 1000);

                    // Clear interval on dispose
                    player.on('dispose', () => clearInterval(intervalId));

                    // Expose player for debugging
                    (window as any).player = player;
                }

                // --- SET SOURCE AFTER SETUP ---
                const hlsUrl = (function () {
                    let url = video.firebaseUrl;
                    if (url.includes('cloudinary.com')) {
                        url = url.replace(/\.mp4$/, '.m3u8');
                        if (!url.includes('/sp_auto/')) {
                            url = url.replace('/upload/', '/upload/sp_auto/');
                        }
                    }
                    return url;
                })();

                const sourceType = (video.firebaseUrl.includes('cloudinary.com') || video.contentType === 'video/mp4')
                    ? 'application/x-mpegURL'
                    : (video.contentType || 'application/x-mpegURL');

                console.log("Setting player source:", hlsUrl);
                player.src({
                    src: hlsUrl,
                    type: sourceType
                });

                setDebugInfo({
                    url: hlsUrl,
                    type: sourceType,
                    tech: player.techName_ || 'Unknown',
                    qualityLevels: 0,
                    status: 'Initialized'
                });

            });
        } else {
            const player = playerRef.current;
            if (player && video) {
                // --- SET SOURCE UPDATE ---
                const hlsUrl = (function () {
                    let url = video.firebaseUrl;
                    if (url.includes('cloudinary.com')) {
                        url = url.replace(/\.mp4$/, '.m3u8');
                        if (!url.includes('/sp_auto/')) {
                            url = url.replace('/upload/', '/upload/sp_auto/');
                        }
                    }
                    return url;
                })();

                const sourceType = (video.firebaseUrl.includes('cloudinary.com') || video.contentType === 'video/mp4')
                    ? 'application/x-mpegURL'
                    : (video.contentType || 'application/x-mpegURL');

                player.src({
                    src: hlsUrl,
                    type: sourceType
                });
            }
        }
    }, [video, videoNode]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-teal-600">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-red-600 text-lg font-medium">{error || "Video not found"}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <div data-vjs-player>
                        <div ref={videoNode} />
                    </div>
                </div>

                <div className="mt-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">{video.videoName}</h1>
                    <p className="text-gray-400">{video.description}</p>
                </div>

                {/* Debug Info Panel */}
                <div className="mt-8 p-4 bg-gray-800 rounded-lg text-xs font-mono text-green-400 overflow-auto">
                    <h3 className="font-bold mb-2 text-white">Debug Info</h3>
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
