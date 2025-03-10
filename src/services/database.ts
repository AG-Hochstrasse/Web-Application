import { Person, User } from "../Interfaces";
import { supabase } from "./supabaseClient";

export async function getLinksByPerson(id: string) {
    return await supabase
        .from("links")
        .select("*")
        .eq("person", id)
}

export async function getAssignedUsersByPerson(person: Person) {
    return await supabase
        .from("people")
        .select("assigned_users")
        .eq("id", person.id)
        .single()
}

// Toggle assigned state of a user and return the new array of assigned users
export async function assignUser(user: User, person: Person): Promise<User[] | null> {
    const assigned = await getAssignedUsersByPerson(person)

    let users = assigned.data?.assigned_users as User[] | null

    if (users) {
        if (users.includes(user)) {
            users = users.splice(users.indexOf(user), 1) // remove user
        }
        else {
            users.push(user)
        }
    }
    else {
        return null
    }

    // Update database
    const response = await supabase
        .from("people")
        .update({ assigned_users: users })
    
    if (response.error) {
        return null
    }

    return users
}

export async function getUsers() {
    return supabase
        .from("profiles")
        .select("*")
}

export async function updateUserAssignments(person: Person, users: User[]) {
    return await supabase
        .from("people")
        .update({ assigned_users: users.map((user) => user.id)})
}

export async function getPersonById(id: number) {
    return await supabase
        .from("people")
        .select("*")
        .eq("id", id)
        .single()
}

export async function getPersonByGrave(grave: string) {
    return await supabase
        .from("people")
        .select("*")
        .eq("grave_number", grave)
        .single()
}

export async function getUsersById(ids: number[]) {
    return await supabase
        .from("profiles")
        .select("*")
        .containedBy("id", ids)
}