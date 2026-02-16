import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// import "videojs-hls-quality-selector"; // We are using a custom implementation
import "videojs-contrib-quality-levels";
import { getVideoById } from "../services/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

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
                            const qualityLevels = ((this as any).player() as any).qualityLevels();
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
                            const qualityLevels = ((this as any).player() as any).qualityLevels();
                            const items = [];

                            // Auto Item
                            items.push(new QualityMenuItem((this as any).player(), {
                                label: 'Auto',
                                level: 'auto',
                                selected: true // Default to auto
                            }));

                            // Quality Items
                            for (let i = 0; i < qualityLevels.length; i++) {
                                const level = qualityLevels[i];
                                const label = level.height ? `${level.height}p` : `Level ${i}`;
                                items.push(new QualityMenuItem((this as any).player(), {
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

                        // Fix alignment - add custom class
                        qualityButton.addClass('custom-quality-button');
                    }

                    // Re-update items when levels change (e.g., loadedmetadata)
                    const qualityLevels = playerAny.qualityLevels();

                    const handleQualityUpdate = () => {
                        const qualitySelector = playerAny.controlBar.getChild('QualitySelector');
                        if (qualitySelector) {
                            qualitySelector.update();
                        }
                    };

                    qualityLevels.on('addqualitylevel', (_event: any) => {
                        handleQualityUpdate();
                    });

                    // Force initial update in case levels are already present
                    if (qualityLevels.length > 0) {
                        handleQualityUpdate();
                    }

                    // Also listen to player loadedmetadata being the standard ready state for tracks
                    player.on('loadedmetadata', () => {
                        handleQualityUpdate();
                    });

                    // Polling fallback
                    let checks = 0;
                    const intervalId = setInterval(() => {
                        checks++;
                        if (qualityLevels.length > 0) {
                            handleQualityUpdate();
                        }

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

                player.src({
                    src: hlsUrl,
                    type: sourceType
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
        <DashboardLayout>
            <style>{`
                /* Custom styles for quality selector alignment */
                .video-js .custom-quality-button {
                    margin-top: 0.1em; /* Adjust this value to align with other buttons */
                }
                .video-js .vjs-menu-button-popup .vjs-menu {
                    width: 10em;
                    left: -3em; 
                }
                .video-js .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
                    background-color: rgba(43, 51, 63, 0.9); /* Match videojs theme */
                    max-height: 15em;
                }
            `}</style>
            <div className="flex flex-col h-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
                <div className="w-full max-w-5xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors mb-6"
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>

                    <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div data-vjs-player>
                            <div ref={videoNode} />
                        </div>
                    </div>

                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h1 className="text-3xl font-bold mb-3">{video.videoName}</h1>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{video.description}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VideoPlayerPage;
