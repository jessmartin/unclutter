import React, { useContext, useEffect, useState } from "react";
import { FilterContext } from "../..";
import { FeedSubscription, ReplicacheContext, useSubscribe } from "../../../store";
import { FeedHeader } from "./FeedHeader";

export default function FeedListTab({ darkModeEnabled }) {
    const { setCurrentSubscription } = useContext(FilterContext);
    const rep = useContext(ReplicacheContext);

    const allSubscriptions = useSubscribe(
        rep,
        rep?.subscribe.listSubscriptions(),
        null,
        []
    ) as FeedSubscription[];

    const displayedSubscriptions = allSubscriptions?.sort((a, b) => {
        return a.time_added - b.time_added;
    });

    return (
        <div className="animate-fadein flex flex-col gap-4">
            {displayedSubscriptions?.map((subscription) => (
                <FeedHeader
                    subscription={subscription}
                    darkModeEnabled={darkModeEnabled}
                    isListEntry
                    setCurrentSubscription={setCurrentSubscription}
                />
            ))}
        </div>
    );
}