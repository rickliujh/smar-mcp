import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getUserTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
        "get_current_user",
        "Retrieves the profile information for the user who is currently authenticated and using the tool.",
        {},
        async () => {
            try {
                console.info("Getting current user");
                const user = await api.users.getCurrentUser();

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(user, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error("Failed to get current user", { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get current user: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "get_user",
        "Retrieves the profile information for a specific user, identified by their user ID.",
        {
            userId: z.string().describe("The unique identifier (ID) of the user to retrieve.")
        },
        async ({ userId }) => {
            try {
                console.info(`Getting user with ID: ${userId}`);
                const user = await api.users.getUserById(userId);

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(user, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error("Failed to get user", { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get user: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "list_users",
        "Retrieves a list of all users in the Smartsheet organization, including their profile information.",
        {},
        async () => {
            try {
                console.info("Listing all users");
                const users = await api.users.listUsers();

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(users, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error("Failed to list users", { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to list users: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

}
