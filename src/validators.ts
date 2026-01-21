import { z } from "zod";
import { NodeType, ViewType } from "./types";

/**
 * Zod schema for validating the type of a node.
 * Corresponds to the NodeType enum.
 */
export const nodeTypeSchema = z.enum(NodeType);

/**
 * Zod schema for validating a single Frain node.
 * Corresponds to the FrainNodeJSON interface.
 */
export const frainNodeSchema = z.object({
    id: z.uuid({ message: "Node ID must be a valid UUID" }),
    type: nodeTypeSchema,
    name: z.string().min(1, { message: "Node name cannot be empty" }),
    description: z.string(),
    technology: z.string(),
});

/**
 * Zod schema for validating a relation between two nodes.
 * Corresponds to the FrainRelationJSON interface.
 */
export const frainRelationSchema = z.object({
    sourceId: z.uuid({ message: "Source ID must be a valid UUID" }),
    targetId: z.uuid({ message: "Target ID must be a valid UUID" }),
    description: z.string(),
    technology: z.string(),
});

/**
 * Zod schema for validating the type of a view.
 * Corresponds to the ViewType enum.
 */
export const viewTypeSchema = z.enum(ViewType);

/**
 * Zod schema for validating a Frain view, containing nodes and relations.
 * Corresponds to the FrainViewJSON interface.
 */
export const frainViewSchema = z.object({
    type: viewTypeSchema,
    mainNodeId: z.string(), // Can be empty string or UUID, so just string is safer based on previous code
    name: z.string(),
    nodes: z.array(frainNodeSchema),
    relations: z.array(frainRelationSchema),
});

/**
 * Zod schema for validating the entire output structure.
 * Matches the return type of Frain.build().
 */
export const frainOutputSchema = z.object({
    title: z.string(),
    description: z.string(),
    views: z.array(frainViewSchema),
});
