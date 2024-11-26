import React from "react";
import { ActionMenu, ActionList, Avatar } from "@primer/react";
import { FeedPersonIcon } from "@primer/octicons-react";

export default function ProfileMenu() {
  return (
    {/* @ts-ignore */}
    <FeedPersonIcon onClick={() => { window.location.href = "/account" }} />
  )
}
