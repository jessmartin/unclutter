import { useTabInfos, useArticleListsCache } from "../../components";
import React, { ReactNode, useContext } from "react";
import { DraggableContext } from "../ArticleList/DraggableContext";
import { ArticleGroup } from "../ArticleList/ArticleGroup";
import { FilterContext, ModalStateContext } from "./context";

export default function RecentModalTab({}: {}) {
    const { darkModeEnabled, userInfo, reportEvent } = useContext(ModalStateContext);
    const { domainFilter } = useContext(FilterContext);

    const tabInfos = useTabInfos(domainFilter, userInfo);
    const [articleListsCache, setArticleListsCache] = useArticleListsCache(tabInfos);

    return (
        <div className="animate-fadein flex flex-col gap-4">
            <DraggableContext
                articleLists={articleListsCache}
                setArticleLists={setArticleListsCache}
                reportEvent={reportEvent}
            >
                <ArticleGroup
                    key="queue"
                    groupKey="queue"
                    title="Reading Queue"
                    icon={
                        <svg className="h-4" viewBox="0 0 640 512">
                            <path
                                fill="currentColor"
                                d="M443.5 17.94C409.8 5.608 375.3 0 341.4 0C250.1 0 164.6 41.44 107.1 112.1c-6.752 8.349-2.752 21.07 7.375 24.68C303.1 203.8 447.4 258.3 618.4 319.1c1.75 .623 3.623 .9969 5.5 .9969c8.25 0 15.88-6.355 16-15.08C643 180.7 567.2 62.8 443.5 17.94zM177.1 108.4c42.88-36.51 97.76-58.07 154.5-60.19c-4.5 3.738-36.88 28.41-70.25 90.72L177.1 108.4zM452.6 208.1L307.4 155.4c14.25-25.17 30.63-47.23 48.13-63.8c25.38-23.93 50.13-34.02 67.51-27.66c17.5 6.355 29.75 29.78 33.75 64.42C459.6 152.4 457.9 179.6 452.6 208.1zM497.8 224.4c7.375-34.89 12.13-76.76 4.125-117.9c45.75 38.13 77.13 91.34 86.88 150.9L497.8 224.4zM576 488.1C576 501.3 565.3 512 552 512L23.99 510.4c-13.25 0-24-10.72-24-23.93c0-13.21 10.75-23.93 24-23.93l228 .6892l78.35-214.8l45.06 16.5l-72.38 198.4l248.1 .7516C565.3 464.1 576 474.9 576 488.1z"
                            />
                        </svg>
                    }
                    articles={articleListsCache?.["queue"] || []}
                    articleLines={1}
                    darkModeEnabled={darkModeEnabled}
                    reportEvent={reportEvent}
                />

                {tabInfos?.slice(1).map((tabInfo, i) => {
                    return (
                        // TopicGroup
                        <ArticleGroup
                            {...tabInfo}
                            key={tabInfo.key}
                            groupKey={tabInfo.key}
                            articles={articleListsCache?.[tabInfo.key] || []}
                            darkModeEnabled={darkModeEnabled}
                            reportEvent={reportEvent}
                        />
                    );
                })}
            </DraggableContext>
        </div>
    );
}

export function FilterButton({
    title,
    icon,
    onClick,
    href,
    color,
}: {
    title: string;
    icon?: ReactNode;
    href?: string;
    onClick?: () => void;
    color?: string;
}) {
    return (
        <a
            className="flex flex-shrink-0 cursor-pointer select-none items-center gap-2 rounded-md bg-stone-100 px-2 py-1 font-medium transition-all hover:scale-[97%] dark:bg-neutral-800"
            onClick={onClick}
            href={href}
            style={{
                background: color,
            }}
            target="_blank"
            rel="noreferrer"
        >
            {icon}
            {title}
        </a>
    );
}
