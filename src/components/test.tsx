import { Button, FormControl, SelectPanel, Text } from "@primer/react";
import { Person, User } from "../Interfaces";
import { useEffect, useState } from "react";
import { TriangleDownIcon } from "@primer/octicons-react";
import { getUsers } from "../services/database";
import { ItemInput } from "@primer/react/lib-esm/deprecated/ActionList/List";

export default function PersonDetailPane(props: { person: Person }) {
  const [selected, setSelected] = useState<ItemInput[]>([])
  const [filter, setFilter] = useState('')

  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers()

      if (response.data) {
        setUsers(response.data)
      }
    }

    fetchUsers()
  }, [])
  const filteredItems = users.filter(
    (user) =>
      // design guidelines say to always show selected items in the list
      selected.some((selectedItem) => selectedItem.text === user.username) ||
      // then filter the rest
      user.username?.toLowerCase().startsWith(filter.toLowerCase()),
  )
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(
      (selectedItem) => selectedItem.text === a.username,
    )
    const bIsSelected = selected.some(
      (selectedItem) => selectedItem.text === b.username,
    )
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)
  return (
    <FormControl>
      <FormControl.Label>{users.length}</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels" // button text when no items are selected
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({ children, ...anchorProps }) => (
          <Button
            trailingAction={TriangleDownIcon}
            {...anchorProps}
            aria-haspopup="dialog"
          >
            {children}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
      />
    </FormControl>
  )
}