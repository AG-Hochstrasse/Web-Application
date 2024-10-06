import { BookIcon, HomeIcon, InfoIcon, LinkExternalIcon, MarkGithubIcon, NorthStarIcon, PeopleIcon, StarIcon, ThreeBarsIcon, XIcon } from "@primer/octicons-react"
import { ActionList, AnchoredOverlay, Box, Button, Header, IconButton, NavList, Overlay } from "@primer/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AppSidebar() {
  const [open, setOpen] = useState(false)
  const navigateToUrl = useNavigate()

  const navigate = (url: string) => {
    navigateToUrl(url)
    setOpen(false)
  }
  return (
    <>
      <AnchoredOverlay
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderAnchor={(props) => <Button {...props} variant="invisible" sx={{color: 'white'}} size="small" icon={ThreeBarsIcon}></Button>}
        height="initial"
        side="inside-top"
        anchorOffset={-19}
        alignmentOffset={-30}
        width="medium"
        
      >
        <Box
          width="94%"
          height="100vh"
          display="flex"
          flexDirection="column"
          sx={{ marginLeft: '2%' }}
        >
          <Header sx={{ background: 'none', color: 'black', width: '100%' }}>
            <Header.Item full sx={{ fontWeight: 'bold' }}>
              AG Hochstrasse
            </Header.Item>
            <Header.Item>
              <IconButton icon={XIcon} aria-label="Close" variant="invisible" onClick={() => setOpen(false)} />
            </Header.Item>
          </Header>
          <NavList>
            <NavList.Item onClick={() => navigate('/')}>
              <NavList.LeadingVisual><HomeIcon /></NavList.LeadingVisual> Home
            </NavList.Item>
            <NavList.Item onClick={() => navigate('/people')}>
              <NavList.LeadingVisual><PeopleIcon /></NavList.LeadingVisual> People
            </NavList.Item>
            <NavList.Item onClick={() => navigate('/whatsnew')}>
              <NavList.LeadingVisual><NorthStarIcon /></NavList.LeadingVisual> Updates
            </NavList.Item>

            <NavList.Divider />

            <NavList.Item onClick={() => navigate('/about')}>
              <NavList.LeadingVisual><InfoIcon /></NavList.LeadingVisual> About
            </NavList.Item>
            <NavList.Item href="https://github.com/AG-Hochstrasse">
              <NavList.LeadingVisual><MarkGithubIcon /></NavList.LeadingVisual> AG Hochstraße on GitHub
              <NavList.TrailingVisual><LinkExternalIcon /></NavList.TrailingVisual>
              </NavList.Item>
            <NavList.Item href="https://github.com/AG-Hochstrasse/Web-Application">
              <NavList.LeadingVisual><StarIcon /></NavList.LeadingVisual> Star on GitHub
              <NavList.TrailingVisual><LinkExternalIcon /></NavList.TrailingVisual>
              </NavList.Item>
            <NavList.Item href="https://github.com/AG-Hochstrasse/Web-Application/wiki">
              <NavList.LeadingVisual><BookIcon /></NavList.LeadingVisual> Wiki
              <NavList.TrailingVisual><LinkExternalIcon /></NavList.TrailingVisual>
            </NavList.Item>
          </NavList>
        </Box>
      </AnchoredOverlay>
    </>
  )
}
