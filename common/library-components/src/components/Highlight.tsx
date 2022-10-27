import clsx from "clsx";
import React, { useContext, useState } from "react";
import { getRandomLightColor, getRelativeTime, openArticleResilient, sendMessage } from "../common";
import { Annotation, Article, readingProgressFullClamp } from "../store";
import { getActivityColor } from "./Charts";
import { HighlightDropdown } from "./Dropdown/HighlightDowndown";
import { ModalContext, ResourceIcon } from "./Modal";

export function Highlight({
    annotation,
    article,
    isCurrentArticle,
    darkModeEnabled,
    reportEvent = () => {},
}: {
    annotation: Annotation;
    article: Article | undefined;
    isCurrentArticle: boolean;
    darkModeEnabled: boolean;
    reportEvent?: (event: string, properties?: any) => void;
}) {
    const { closeModal } = useContext(ModalContext);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    function openHighlight(e) {
        e.preventDefault();
        e.stopPropagation();

        if (isCurrentArticle) {
            closeModal?.();
            sendMessage({ event: "focusAnnotation", focusedAnnotation: annotation.id });
        } else if (article?.url) {
            // open new tab & scroll to highlight
            openArticleResilient(article.url, true, annotation.id);
        }
    }

    return (
        <a
            className="highlight animate-fadein relative flex cursor-pointer select-none flex-col justify-between gap-3 overflow-hidden rounded-md bg-stone-100 p-3 px-4 text-sm text-stone-900 transition-all hover:scale-[99.5%]"
            style={{
                background: getRandomLightColor(annotation.article_id, darkModeEnabled),
            }}
            href={article?.url}
            onClick={openHighlight}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropdownOpen(true);
            }}
        >
            <HighlightDropdown
                annotation={annotation}
                open={dropdownOpen}
                setOpen={setDropdownOpen}
                reportEvent={reportEvent}
            />

            <LimitedText text={`"${annotation.quote_text}"`} />
            <LimitedText className="font-medium" text={annotation.text} />

            {article ? (
                <div className="info-bar flex items-center justify-between gap-2 whitespace-nowrap font-medium">
                    <div className="text-medium flex items-center gap-1.5 overflow-hidden text-ellipsis">
                        <ResourceIcon
                            className="flex-shrink-0"
                            type={
                                article.reading_progress >= readingProgressFullClamp
                                    ? "articles_completed"
                                    : "articles"
                            }
                        />
                        {article?.title}
                    </div>

                    {annotation.is_favorite && (
                        <svg
                            viewBox="0 0 576 512"
                            className="animate-fadein text-lindy dark:text-lindyDark w-4 flex-shrink-0 transition-opacity"
                        >
                            <path
                                fill="currentColor"
                                d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"
                            />
                        </svg>
                    )}

                    {/* <div className="flex-grow" />
                    <div className="time flex items-center gap-1.5 ">
                        <svg className="h-4" viewBox="0 0 448 512">
                            <path
                                fill="currentColor"
                                d="M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z"
                            />
                        </svg>
                        {getRelativeTime(annotation.created_at * 1000)}
                    </div> */}
                </div>
            ) : (
                <div className="text-base"> </div>
            )}
        </a>
    );
}

function LimitedText({
    className,
    text,
    rows = 8,
}: {
    className?: string;
    text?: string;
    rows?: number;
}) {
    return (
        <div
            className={clsx("flex-grow overflow-hidden text-ellipsis leading-normal", className)}
            style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: rows,
            }}
        >
            {text}
        </div>
    );
}
