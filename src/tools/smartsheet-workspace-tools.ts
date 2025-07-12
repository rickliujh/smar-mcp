import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getWorkspaceTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
        "get_workspaces",
        "Retrieves a list of all workspaces that the current user has access to.",
        {},
        async ({ }) => {
          try {
            console.info("Getting workspaces");
            const workspace = await api.workspaces.getWorkspaces();
    
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(workspace, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error("Failed to get workspaces", { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to get workspaces: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
    );
    
    server.tool(
        "get_workspace",
        "Retrieves a specific workspace, including its contents like sheets, reports, dashboards, and folders.",
        {
          workspaceId: z.string().describe("The unique identifier (ID) of the workspace to retrieve.")
        },
        async ({ workspaceId}) => {
          try {
            console.info(`Getting workspace with ID: ${workspaceId}`);
            const workspace = await api.workspaces.getWorkspace(workspaceId);
    
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(workspace, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to get workspace with ID: ${workspaceId}`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to get workspace: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
    );
    
    server.tool(
        "create_workspace",
        "Creates a new, empty workspace with the specified name.",
        {
          workspaceName: z.string().describe("The name for the new workspace to be created.")
        },
        async ({ workspaceName }) => {
          try {
            console.info(`Creating workspace: ${workspaceName}`);
            const workspace = await api.workspaces.createWorkspace(workspaceName);
    
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(workspace, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error("Failed to create workspace", { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to create_workspace: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
    );

}
