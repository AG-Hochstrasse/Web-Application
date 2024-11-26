import React from "react";
import { ActionMenu, ActionList, Avatar } from "@primer/react";
import { FeedPersonIcon } from "@primer/octicons";

export default function ProfileMenu() {
  return (
    <FeedPersonIcon onClick={() => { window.location.href = "/account" }} />
  )
}
