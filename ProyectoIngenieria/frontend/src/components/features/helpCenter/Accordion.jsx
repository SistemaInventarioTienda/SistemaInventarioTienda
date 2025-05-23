import { useRef, useEffect } from "react"
import VideoPlayer from "./VideoPlayer"

const Accordion = ({ question, answer, videoUrl, isAccordionOpen, onToggle }) => {
    const contentRef = useRef(null)
    const videoRef = useRef(null)

    const toggleAccordion = () => {
        onToggle()
    }

    useEffect(() => {
        // Animación de apertura y cierre
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

        // Pausar el video de YouTube cuando se cierra el accordion
        if (!isAccordionOpen && videoRef.current) {
            const iframe = videoRef.current.querySelector("iframe");
            if (iframe && iframe.contentWindow && iframe.src.includes("youtube.com")) {
                iframe.contentWindow.postMessage(
                    JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
                    "*"
                );
            }
        }
    }, [isAccordionOpen])

    // Determinar si la respuesta es un array (pasos) o texto simple
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
