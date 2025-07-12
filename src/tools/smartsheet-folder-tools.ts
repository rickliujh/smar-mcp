import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getFolderTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
        "get_folder",
        "Retrieves the specified folder, including its contents such as sheets, reports, and sub-folders.",
        {
        folderId: z.string().describe("The unique identifier (ID) of the folder to retrieve.")
        },
        async ({ folderId}) => {
        try {
            console.info(`Getting folder with ID: ${folderId}`);
            const folder = await api.folders.getFolder(folderId);

            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(folder, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to get folder with ID: ${folderId}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to get_folder: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "create_folder",
        "Creates a new, empty folder within a specified parent folder. This is for creating sub-folders.",
        {
        folderId: z.string().describe("The ID of the parent folder where the new folder will be created."),
        folderName: z.string().describe("The name of the new folder to be created.")
        },
        async ({ folderId, folderName }) => {
        try {
            console.info(`Creating folder in workspace with ID: ${folderId}`);
            const folder = await api.folders.createFolder(folderId, folderName);

            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(folder, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to create folder in workspace with ID: ${folderId}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to create_folder: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "create_workspace_folder",
        "Creates a new, empty folder at the top level of a specified workspace.",
        {
        workspaceId: z.string().describe("The ID of the workspace where the new folder will be created."),
        folderName: z.string().describe("The name of the new folder to be created.")
        },
        async ({ workspaceId, folderName }) => {
        try {
            console.info(`Creating folder in workspace with ID: ${workspaceId}`);
            const folder = await api.workspaces.createWorkspaceFolder(workspaceId, folderName);

            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(folder, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to create folder in workspace with ID: ${workspaceId}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to create_workspace_folder: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

}
