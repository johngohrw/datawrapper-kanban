import { writable } from "svelte/store";


export const user = writable();

if (typeof window !== 'undefined') {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null")
    user.set(storedUser)
    user.subscribe(value => {
        localStorage.setItem("user", JSON.stringify(value));
    });
}

