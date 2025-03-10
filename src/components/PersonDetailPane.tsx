import { useEffect, useState } from "react";
import { Button, FormControl, SelectPanel } from "@primer/react";
import { TriangleDownIcon } from "@primer/octicons-react";
import { assignUser, getUsers, updateUserAssignments } from "../services/database";
import { Person, User } from "../Interfaces";
import { ItemInput } from "@primer/react/lib/deprecated/ActionList/List";



export default function PersonDetailPane(props: {person: Person}) {
  const [users, setUsers] = useState<User[]>([]);
  const [userItems, setUserItems] = useState<ItemInput[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();

      if (response.data) {
        setUsers(response.data)
        alert(props.person.assigned_users)
        setUserItems(response.data.map((user) => ({ text: (user as User).username ?? undefined, id: (user as User).id})));
        setSelected(users.filter((user) => props.person.assigned_users.map(($0) => $0.id).includes(user.id)))
      }
    };

    fetchUsers();
  }, []);

  const updateSelected = (newSelected: ItemInput[]) => {
    updateUserAssignments(props.person, newSelected.map((item) => users.filter((user) => user.id == item.id)[0]))
    setSelected(newSelected)
  }

  const [selected, setSelected] = useState<ItemInput[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = userItems.filter(
    (user) =>
      // design guidelines say to always show selected items in the list
      selected.some((selectedItem) => selectedItem.text === user.text) ||
      // then filter the rest
      user.text?.toLowerCase().startsWith(filter.toLowerCase()),
  )
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(
      (selectedItem) => selectedItem.text === a.text,
    )
    const bIsSelected = selected.some(
      (selectedItem) => selectedItem.text === b.text,
    )
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)
  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
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
        onSelectedChange={updateSelected}
        onFilterChange={setFilter}
      />
    </FormControl>
  )
}