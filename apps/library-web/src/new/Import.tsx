import { useUser } from "@supabase/auth-helpers-react";
import { useAutoDarkMode } from "@unclutter/library-components/dist/common";
import { useContext, useEffect, useState } from "react";
import {
    Article,
    ReplicacheContext,
    UserInfo,
    useSubscribe,
} from "@unclutter/library-components/dist/store";
import { useRouter } from "next/router";
import {
    SettingsButton,
    SettingsGroup,
} from "@unclutter/library-components/dist/components/Settings/SettingsGroup";
import { reportEventPosthog } from "../../common/metrics";
import { GenerateSection } from "./Import/Generate";
import { ImportSection } from "./Import/Import";
import Head from "next/head";
import { StaticArticleList } from "@unclutter/library-components/dist/components";

export default function SmartReadingOnboarding() {
    const router = useRouter();
    const rep = useContext(ReplicacheContext);
    const { user } = useUser();
    // @ts-ignore
    const userInfo = useSubscribe<UserInfo>(rep, rep?.subscribe.getUserInfo(), undefined);
    const darkModeEnabled = useAutoDarkMode();

    useEffect(() => {
        if (!rep || !userInfo || !user) {
            return;
        }
        if (userInfo.aiEnabled) {
            // everything set up
            return;
        }

        if (userInfo.stripeId) {
            // user likely cancelled subscription
            router.push("/welcome");
            return;
        } else {
            // signup didn not work yet?
            rep.mutate.updateUserInfo({ aiEnabled: true });
        }

        reportEventPosthog("enableSmartReading", {
            $set: {
                aiEnabled: true,
                stripeId: userInfo.stripeId,
            },
        });
    }, [rep, userInfo]);

    const [sampleArticles, setSampleArticles] = useState<Article[]>([]);
    useEffect(() => {
        rep?.query.listRecentArticles().then((articles) => {
            const queueArticles = articles.filter((a) => a.is_queued);
            if (queueArticles.length >= 3) {
                setSampleArticles(queueArticles.slice(0, 4));
            } else {
                setSampleArticles(articles.slice(0, 4));
            }
        });
    }, [rep]);

    if (!userInfo) {
        return <></>;
    }
    return (
        <div className="animate-fadein flex flex-col gap-4">
            <Head>
                <title>Import articles</title>
            </Head>

            <SettingsGroup
                title="Thank you!"
                icon={
                    <svg className="h-4 w-4" viewBox="0 0 512 512">
                        <path
                            fill="currentColor"
                            d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM296 336h-16V248C280 234.8 269.3 224 256 224H224C210.8 224 200 234.8 200 248S210.8 272 224 272h8v64h-16C202.8 336 192 346.8 192 360S202.8 384 216 384h80c13.25 0 24-10.75 24-24S309.3 336 296 336zM256 192c17.67 0 32-14.33 32-32c0-17.67-14.33-32-32-32S224 142.3 224 160C224 177.7 238.3 192 256 192z"
                        />
                    </svg>
                }
                animationIndex={0}
                // buttons={
                //     <>
                //         <SettingsButton
                //             title="Manage subscription"
                //             href="https://billing.stripe.com/p/login/5kA8x62Ap9y26v6144"
                //             darkModeEnabled={darkModeEnabled}
                //             reportEvent={reportEventPosthog}
                //         />
                //     </>
                // }
            >
                <p className="mb-2">
                    Thank you for supporting Unclutter! The AI Smart Reading features are now
                    activated for your account. Try it out on any web article!
                </p>

                <StaticArticleList articles={sampleArticles} />
            </SettingsGroup>

            <GenerateSection rep={rep} userInfo={userInfo} darkModeEnabled={darkModeEnabled} />

            <ImportSection rep={rep} userInfo={userInfo} darkModeEnabled={darkModeEnabled} />
        </div>
    );
}
