import { useEffect, useState } from "react";
import { Person } from "../Interfaces";
import { supabase } from "../services/supabaseClient";

export function usePeople(): { people: Person[] | null, error: string | null } {
    const [people, setPeople] = useState<Person[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('people')
                    .select('*');

                if (error) {
                    throw error;
                }

                setPeople(data);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setPeople(null);
            }
        };

        fetchData();
    }, []);

    return { people, error };
}

export function usePerson(id: number): { person: Person | null, error: string | null } {
    const [person, setPeople] = useState<Person | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('people')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    throw error;
                }

                setPeople(data);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setPeople(null);
            }
        };

        fetchData();
    }, []);

    return { person, error };
}