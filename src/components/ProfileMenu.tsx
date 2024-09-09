import React from "react";
import { ActionMenu, ActionList, Avatar } from "@primer/react";

export default function ProfileMenu() {
  return (
    <Avatar src="https://github.com/octocat.png" size={30} square alt="@octocat" onClick={() => { window.location.href = "/account" }} />
  )
}