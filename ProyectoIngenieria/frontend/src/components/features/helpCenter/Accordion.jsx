import { useRef, useEffect } from "react"
import VideoPlayer from "./VideoPlayer"
import Player from "@vimeo/player"

const Accordion = ({ question, answer, videoUrl, isAccordionOpen, onToggle }) => {
    const contentRef = useRef(null)
    const videoRef = useRef(null)
    const vimeoPlayerRef = useRef(null)

    const toggleAccordion = () => {
        onToggle()
    }

    useEffect(() => {
        const iframe = videoRef.current?.querySelector("iframe")

        // Animación
        if (contentRef.current) {
            if (isAccordionOpen) {
                contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`
                contentRef.current.style.paddingTop = "1.5rem"
                contentRef.current.style.opacity = "1"
            } else {
                contentRef.current.style.maxHeight = "0px"
                contentRef.current.style.paddingTop = "0"
                contentRef.current.style.opacity = "0"
            }
        }

        if (!iframe) return

        const src = iframe.src

        if (!isAccordionOpen) {
            // PAUSA al cerrar
            if (src.includes("youtube.com") && iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                    JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
                    "*"
                )
            } else if (src.includes("vimeo.com")) {
                if (!vimeoPlayerRef.current) {
                    vimeoPlayerRef.current = new Player(iframe)
                }

                vimeoPlayerRef.current.pause().catch((error) => {
                    console.warn("Error al pausar video Vimeo:", error)
                })
            }
        } else {
            // FORZAR CALIDAD al abrir
            if (src.includes("vimeo.com")) {
                if (!vimeoPlayerRef.current) {
                    vimeoPlayerRef.current = new Player(iframe)
                }

                vimeoPlayerRef.current.on("loaded", async () => {
                    try {
                        const qualities = await vimeoPlayerRef.current.getQualities()
                        const maxQuality = qualities
                            .filter(q => q.id !== "auto")
                            .sort((a, b) => b.height - a.height)[0]

                        if (maxQuality) {
                            await vimeoPlayerRef.current.setQuality(maxQuality.id)
                        }
                    } catch (err) {
                        console.warn("No se pudo establecer calidad máxima:", err)
                    }
                })
            }
        }
    }, [isAccordionOpen])

    const isStepByStep = Array.isArray(answer)

    return (
        <div className={`help-center-accordion-item ${isAccordionOpen ? "active" : ""}`}>
            <button
                className="help-center-accordion-header"
                onClick={toggleAccordion}
                aria-expanded={isAccordionOpen}
                aria-controls={`accordion-content-${question.replace(/\s+/g, "-").toLowerCase()}`}
            >
                <h3>{question}</h3>
                <svg
                    className={`help-center-accordion-icon ${isAccordionOpen ? "expanded" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div
                ref={contentRef}
                id={`accordion-content-${question.replace(/\s+/g, "-").toLowerCase()}`}
                className={`help-center-accordion-content ${isAccordionOpen ? "expanded" : ""}`}
            >
                <div className="help-center-accordion-body">
                    <div className="help-center-accordion-answer">
                        {isStepByStep ? (
                            <div className="help-center-steps">
                                <h4 className="steps-title">Instrucciones paso a paso:</h4>
                                <ol className="steps-list">
                                    {answer.map((step, i) => (
                                        <li key={i} className="step-item">
                                            <div className="step-number">{i + 1}</div>
                                            <div className="step-text">{step}</div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ) : (
                            <p className="help-center-text">{answer}</p>
                        )}
                    </div>
                    {videoUrl && (
                        <div ref={videoRef} className="help-center-video-wrapper">
                            <VideoPlayer videoUrl={videoUrl} title={question} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Accordion
