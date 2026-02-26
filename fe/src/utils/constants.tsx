import { type AuthLevels } from "@/app/types";
import { type Options } from "check-password-strength";

export const baseUrl = "http://localhost:3000/api"

export const strengthOptions: Options<string> = [
    { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
    { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
    { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
    { id: 4, value: "very-strong", minDiversity: 4, minLength: 12 }
];

export const authLevels: AuthLevels = {
    basic: ["patient", "specialist", "operator", "ghost"],
    operator: ["operator", "ghost"],
    admin: ["ghost"]
}