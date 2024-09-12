import React, { useState } from "react";
import { Text, Heading, Button, Box, Stack } from "@primer/react";
import packageJson from "../../package.json";
import * as Entries from "../assets/whatsnew.json";
import { ArrowRightIcon } from "@primer/octicons-react";
import { useNavigate } from "react-router-dom";

export default function WhatsNew({ all }: any) {
  const navigate = useNavigate()

  let version = "_"

  return (
    <Box>
      {all && <><Heading>
        Updates
      </Heading><br /></>}
      <Heading sx={{ fontSize: '1.5em' }} >What's new in this version: <Text sx={{ fontFamily: 'monospace' }} >{packageJson.version}</Text></Heading>
      {Entries
        .filter((entry) =>
          entry.version == packageJson.version
        )
        .map((entry: any, i: number) => {
          return <Text>– {entry.description} {entry.thread && <Text>(#{entry.thread})</Text>}<br /></Text>;
        })
      }
      {all && <>
        <br />
        <br />
        <Heading sx={{ fontSize: '1.5em' }} >Older updates</Heading>
        {Entries
          .filter((entry) =>
            entry.version != packageJson.version
          )
          .map((entry: any, i: number) => {
            let newVersion = false
            if (version != entry.version && version != "_") {
              version = entry.version
              newVersion = true
            }
            return <Text>{newVersion && <br />}– {all && <><Text sx={{ fontFamily: 'monospace' }}>{entry.version}</Text>:</>} {entry.description} {entry.thread && <Text>(#{entry.thread})</Text>}<br /></Text>;
          })
        }
      </>}
      {!all &&
        <>
          <br />
          <Button leadingVisual={ArrowRightIcon} onClick={() => navigate("/whatsnew")} >Show all</Button>
        </>
      }
    </Box>
  )
}