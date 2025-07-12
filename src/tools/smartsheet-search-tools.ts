import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getSearchTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
        "search_sheets",
        "Searches all sheets the user can access for a specific query. The search includes sheet names, cell data, and summary fields.",
        {
        query: z.string().describe("The text to search for. Example: 'Q3 Financials' or 'contact@example.com'"),
        },
        async ({ query }) => {
        try {
            console.info(`Searching for sheets with query: ${query}`);
            const results = await api.search.searchSheets(query);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search for sheets with query "${query}": ${error.message}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search for sheets: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "search_in_sheet",
        "Performs a text search within a specific sheet, looking for matches in cell data and summary fields.",
        {
            sheetId: z.string().describe("The ID of the sheet to search within."),
            query: z.string().describe("The text to search for within the sheet."),
        },
        async ({ sheetId, query }) => {
        try {
            console.info(`Searching for sheet with ID: ${sheetId} with query: ${query}`);
            const results = await api.search.searchSheet(sheetId, query);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search in sheet ${sheetId} with query "${query}": ${error.message}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search in sheet: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "search_in_sheet_by_url",
        "Performs a text search within a specific sheet, identified by its URL.",
        {
            url: z.string().describe("The URL of the sheet to search within."),
            query: z.string().describe("The text to search for in the sheet's cell data and summary fields."),
        },
        async ({ url, query }) => {
        try {
            console.info(`Searching for sheet with URL: ${url} with query: ${query}`);
            const match = url.match(/\/sheets\/([^?\/]+)/);
            const directIdToken = match ? match[1] : null;
            if (!directIdToken) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get sheet: Invalid URL format`
                        }
                    ],
                    isError: true
                };
            }
            const sheet = await api.sheets.getSheetByDirectIdToken(directIdToken);
            const results = await api.search.searchSheet(sheet.id, query);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search in sheet ${url} with query "${query}": ${error.message}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search in sheet: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "what_am_i_assigned_to_by_sheet_id",
        "Searches a specific sheet by its ID to find all rows and tasks assigned to the current user (based on their email address).",
        {
            sheetId: z.string().describe("The ID of the sheet to search for assigned tasks."),
        },
        async ({ sheetId }) => {
        try {
            const user = await api.users.getCurrentUser();
            const results = await api.search.searchSheet(sheetId, user.email);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search in sheet ${sheetId}: ${error.message}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search for assigned tasks in sheet: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "what_am_i_assigned_to_by_sheet_url",
        "Searches a specific sheet by its URL to find all rows and tasks assigned to the current user.",
        {
            url: z.string().describe("The URL of the sheet to search for assigned tasks."),
        },
        async ({ url }) => {
        try {
            const user = await api.users.getCurrentUser();
            const match = url.match(/\/sheets\/([^?\/]+)/);
            const directIdToken = match ? match[1] : null;
            if (!directIdToken) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get sheet: Invalid URL format`
                        }
                    ],
                    isError: true
                };
            }
            const sheet = await api.sheets.getSheetByDirectIdToken(directIdToken);
            const results = await api.search.searchSheet(sheet.id, user.email);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search in sheet ${url}: ${error.message}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search for assigned tasks in sheet: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "search_folders",
        "Searches all folders the user can access for a specific query.",
        {
        query: z.string().describe("The text to search for in folder names."),
        },
        async ({ query }) => {
        try {
            console.info(`Searching for folders with query: ${query}`);
            const results = await api.search.searchFolders(query);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search for folders with query: ${query}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search for folders: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "search_workspaces",
        "Searches all workspaces the user can access for a specific query.",
        {
        query: z.string().describe("The text to search for in workspace names."),
        },
        async ({ query }) => {
        try {
            console.info(`Searching for workspaces with query: ${query}`);
            const results = await api.search.searchWorkspaces(query);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search for workspaces with query: ${query}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search for workspaces: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "search_reports",
        "Searches all reports the user can access for a specific query.",
        {
        query: z.string().describe("The text to search for in report names."),
        },
        async ({ query }) => {
        try {
            console.info(`Searching for reports with query: ${query}`);
            const results = await api.search.searchReports(query);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search for reports with query: ${query}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search for reports: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

    server.tool(
        "search_dashboards",
        "Searches all dashboards (Sights) the user can access for a specific query.",
        {
        query: z.string().describe("The text to search for in dashboard names."),
        },
        async ({ query }) => {
        try {
            console.info(`Searching for dashboards with query: ${query}`);
            const results = await api.search.searchDashboards(query);
            
            return {
            content: [
                {
                type: "text",
                text: JSON.stringify(results, null, 2)
                }
            ]
            };
        } catch (error: any) {
            console.error(`Failed to search for dashboards with query: ${query}`, { error });
            return {
            content: [
                {
                type: "text",
                text: `Failed to search for dashboards: ${error.message}`
                }
            ],
            isError: true
            };
        }
        }
    );

}
