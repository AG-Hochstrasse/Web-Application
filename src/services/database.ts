import { supabase } from "./supabaseClient";

export async function getLinksByPerson(id: string) {
    return await supabase
        .from("links")
        .select("*")
        .eq("person", id)
}