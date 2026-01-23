import { z } from "zod";
import { NodeType, ViewType } from "./types";

/**
 * Schema for validating the Frain config
 */
export const frainConfigSchema = z.object({
    projectId: z.uuid({ message: "Project ID must be a valid UUID" }),
    apiKey: z.string().min(1, { message: "API key cannot be empty" }),
    description: z
        .string()
        .min(1, { message: "Description cannot be empty" })
        .max(500, { message: "Description cannot exceed 500 characters" }),
    title: z
        .string()
        .min(1, { message: "Title cannot be empty" })
        .max(255, { message: "Title cannot exceed 255 characters" }),
});

/**
 * Schema for validating the type of a node.
 * Corresponds to the NodeType enum.
 */
export const nodeTypeSchema = z.enum(NodeType);

/**
 * Schema for validating a single Frain node.
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
 * Schema for validating a single Frain node.
 * Corresponds to the FrainNodeJSON interface.
 */
export const frainNodeCreationSchema = z.object({
    type: nodeTypeSchema,
    name: z.string().min(1, { message: "Node name cannot be empty" }),
    description: z.string(),
    technology: z.string(),
});

/**
 * Schema for validating a relation between two nodes.
 * Corresponds to the FrainRelationJSON interface.
 */
export const frainRelationSchema = z.object({
    sourceId: z.uuid({ message: "Source ID must be a valid UUID" }),
    targetId: z.uuid({ message: "Target ID must be a valid UUID" }),
    description: z.string(),
    technology: z.string(),
});

/**
 * Schema for validating the type of a view.
 * Corresponds to the ViewType enum.
 */
export const viewTypeSchema = z.enum(ViewType);

/**
 * Schema for validating a Frain view, containing nodes and relations.
 * Corresponds to the FrainViewJSON interface.
 */
export const frainViewSchema = z.object({
    type: viewTypeSchema,
    container: z
        .object({
            name: z.string(),
            description: z.string(),
            technology: z.string(),
        })
        .optional(),
    name: z.string(),
    nodes: z.array(frainNodeSchema),
    relations: z.array(frainRelationSchema),
});

/**
 * Schema for validating the entire output structure.
 * Matches the return type of Frain.build().
 */
export const frainOutputSchema = z.object({
    title: z.string(),
    description: z.string(),
    views: z.array(frainViewSchema),
});
