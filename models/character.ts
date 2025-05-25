import { minLength, object, pipe, string, type InferInput } from "valibot";

export const characterSchema = object({
    name: pipe(string(), minLength(4)),
    lastName: string(),
});

export type Character = InferInput<typeof characterSchema> & { id: number };

const characters: Map<number, Character> = new Map();

/**
 * Get all characters.
 * @returns {Character[]} - An array with all the characters.
 */
export const getAllCharacters = (): Character[] => {
    return Array.from(characters.values());
}

/**
 * Get a character by its ID
 * 
 * @param {number} id - The character's ID
 * @returns {Character | undefined} - Returns the character if found, undefined otherwise.
 */
export const getCharacterById = (id: number): Character | undefined => {
    return characters.get(id);
}

/**
 * Add a new character.
 * 
 * @param {Character} character - The character to be added.
 * @returns {Character} - The character that has been added.
 */
export const addCharacter = (character: Character): Character => {
    const newCharacter = {
        ...character,
        id: new Date().getTime()
    };

    characters.set(newCharacter.id, newCharacter);
    return newCharacter;
}

/**
 * Updates a character.
 * 
 * @param {number} id - The ID of the character to update.
 * @param {Character} updatedCharacter - The character with the updated data.
 * @returns {Character | null} - Returns the updated character if found by its ID, null otherwise.
 */
export const updateCharacter = (id: number, updatedCharacter: Character): Character | null => {
    if (!characters.has(id)) {
        console.error(`Character with id ${id} not found.`);
        return null;
    }

    characters.set(id, updatedCharacter);
    return updatedCharacter;
}

/**
 * Deletes a character by its ID.
 * 
 * @param {number} id - The ID of the character to delete.
 * @returns {boolean} - True if the character was deleted, False otherwise.
 */
export const deleteCharacter = (id: number): boolean => {
    if (!characters.has(id)) {
        console.error(`Character with id ${id} not found.`);
        return false;
    }

    characters.delete(id);
    return true;
}
