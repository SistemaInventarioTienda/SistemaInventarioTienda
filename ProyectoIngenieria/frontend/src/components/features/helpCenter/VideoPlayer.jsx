const isValidVideoUrl = (url) =>
    typeof url === "string" &&
    (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com/"));

const appendEnableJsApi = (url) => {
    const hasParams = url.includes('?');
    const enableJsApiParam = 'enablejsapi=1';
    if (url.includes(enableJsApiParam)) return url;
    return `${url}${hasParams ? '&' : '?'}${enableJsApiParam}`;
};

const VideoPlayer = ({ videoUrl, title }) => {
    if (!videoUrl) {
        return (
            <div className="help-center-video-error">
                <p>No se proporcionó una URL de video válida.</p>
            </div>
        );
    }

    const embedUrl = appendEnableJsApi(videoUrl);

    const isEmbeddable = isValidVideoUrl(embedUrl);

    if (!isEmbeddable) {
        return (
            <div className="help-center-video-error">
                <p>Este video no se puede mostrar directamente aquí.</p>
                <a href={videoUrl.replace("/embed/", "/watch?v=")} target="_blank" rel="noopener noreferrer">
                    Ver en YouTube
                </a>
            </div>
        );
    }

    return (
        <div className="help-center-video-container">
            <iframe
                src={embedUrl}
                title={title || "Video tutorial"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-presentation"
                allowFullScreen
                loading="lazy"
            />
        </div>
    );
};

export default VideoPlayer;