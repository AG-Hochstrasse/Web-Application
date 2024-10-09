import { Box, PageLayout } from '@primer/react'
import Sidebar from './AppSidebar'
import AppSidebar from './AppSidebar'

function Playground() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <PageLayout
                sx={{ height: '100%' }}
                rowGap="none"
                columnGap="none"
                padding="none"
                containerWidth="full"
            >
                <PageLayout.Content padding="normal" width="large">
                    <Box as="p" sx={{ margin: 0 }}>
                        <span>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nam at enim id lorem tempus egestas a non
                            ipsum. Maecenas imperdiet ante quam, at varius lorem
                            molestie vel. Sed at eros consequat, varius tellus
                            et, auctor felis. Donec pulvinar lacinia urna nec
                            commodo. Phasellus at imperdiet risus. Donec sit
                            amet massa purus. Nunc sem lectus, bibendum a sapien
                            nec, tristique tempus felis. Ut porttitor auctor
                            tellus in imperdiet. Ut blandit tincidunt augue,
                            quis fringilla nunc tincidunt sed. Vestibulum auctor
                            euismod nisi. Nullam tincidunt est in mi tincidunt
                            dictum. Sed consectetur aliquet velit ut ornare.
                        </span>
                    </Box>
                </PageLayout.Content>
                <PageLayout.Pane
                    position="start"
                    resizable
                    padding="normal"
                    divider="line"
                    sticky={true}
                    aria-label="Side pane"
                    width="small"
                >
                    <Box sx={{ display: 'grid', gap: 3, height: '100vh' }}>
                        <AppSidebar/>
                    </Box>
                </PageLayout.Pane>
            </PageLayout>
        </Box>
    )
}

export default Playground
