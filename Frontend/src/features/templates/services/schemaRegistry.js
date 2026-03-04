/**
 * schemaRegistry.js
 * Maps each componentLibrary `type` string to its form schema.
 * Add new entries here as new schemas are created.
 */

import { userProfileSchema }  from './userProfileSchema';
import { requisitionSchema }  from './requisitionSchema';
import { jdSchema }           from './jdSchema';
import { interviewSchema }    from './interviewSchema';

export const schemaRegistry = {
  candidate_profile: userProfileSchema,
  requisition:       requisitionSchema,
  job_description:   jdSchema,
  interview:         interviewSchema,
};

/**
 * Look up the schema for a given component type.
 * Returns null when no schema is registered.
 *
 * @param {string} componentType  e.g. "candidate_profile"
 * @returns {{ name: string, schema: { title, description, fields[] } } | null}
 */
export function getSchemaForType(componentType) {
  return schemaRegistry[componentType] ?? null;
}
