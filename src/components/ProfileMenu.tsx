import React from "react";
import { ActionMenu, ActionList, Avatar, IconButton } from "@primer/react";
import { FeedPersonIcon } from "@primer/octicons-react";

export default function ProfileMenu() {
  return (
    <>
      {/* @ts-ignore */}
      <IconButton icon={FeedPersonIcon} aria-label="Account" onClick={() => { window.location.href = "/account" }} />
    </>
  )
}
