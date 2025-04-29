import { Heading, ProgressBar, Spinner, Stack } from "@primer/react";
import { usePeople } from "../hooks/usePeople";
import { Banner } from '@primer/react/drafts';
import { DotFillIcon } from "@primer/octicons-react";

export default function Progress() {
    const { error, people } = usePeople()

    if (error) {
        return <Banner variant="critical" title="Error" >
            An unknown error occurred
        </Banner>
    }

    if (!people) {
        return <Spinner />
    }

    const closed = people.filter(person => person.state === "closed").length
    const canceled = people.filter(person => person.state === "canceled").length
    const open = people.filter(person => person.state === "open").length

    return <>
        <Heading as="h2">Progress</Heading>
        <ProgressBar aria-valuenow={people.length}>
            <ProgressBar.Item progress={closed} sx={{ bg: "success.emphasis" }} aria-label={`${closed} closed`} />
            <ProgressBar.Item progress={canceled} sx={{ bg: "closed.emphasis" }} aria-label={`${canceled} canceled`} />
            <ProgressBar.Item progress={open} sx={{ bg: "accent.emphasis" }} aria-label={`${open} open`} />
        </ProgressBar>
        {/* TODO: Use CSS color variables */}
        <Stack direction="horizontal" wrap="wrap" role="presentation">
            <Stack direction="horizontal" gap="condensed" align="center">
                <DotFillIcon fill="#1a7f37" />
                Done ({closed})
            </Stack>
            <Stack direction="horizontal" gap="condensed" align="center">
                <DotFillIcon fill="#d1242f" />
                Canceled ({canceled})
            </Stack>
            <Stack direction="horizontal" gap="condensed" align="center">
                <DotFillIcon fill="#0969da" />
                In porgress ({open})
            </Stack>
        </Stack>
    </>
}