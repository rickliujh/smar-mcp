import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getDiscussionTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
        "get_discussions_by_sheet_id",
        "Retrieves a list of all discussions associated with a specific sheet, including all comments and attachments.",
        {
            sheetId: z.string().describe("The unique identifier (ID) of the sheet from which to retrieve discussions."),
            include: z.string().optional().describe("A comma-separated list of optional elements to include in the response. Valid values: 'attachments', 'comments'. Example: 'attachments,comments'"),
            pageSize: z.number().optional().describe("The number of discussions to return per page. Default is 100."),
            page: z.number().optional().describe("The page number to retrieve when paginating through discussions. Default is 1."),
            includeAll: z.boolean().optional().describe("If true, automatically paginates through all results and returns them as a single list. Default is false."),
        },
        async ({ sheetId, include, pageSize, page, includeAll }) => {
            try {
                console.info(`Getting discussions for sheet with ID: ${sheetId}`);
                const discussions = await api.discussions.getDiscussionsBySheetId(sheetId, include, pageSize, page, includeAll);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(discussions, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to get discussions for sheet ID: ${sheetId}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get discussions: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "get_discussions_by_row_id",
        "Retrieves a list of all discussions associated with a specific row within a sheet.",
        {
            sheetId: z.string().describe("The ID of the sheet containing the row."),
            rowId: z.string().describe("The ID of the row from which to retrieve discussions."),
            include: z.string().optional().describe("A comma-separated list of optional elements to include in the response. Valid values: 'attachments', 'comments'. Example: 'attachments,comments'"),
            pageSize: z.number().optional().describe("The number of discussions to return per page. Default is 100."),
            page: z.number().optional().describe("The page number to retrieve. Default is 1."),
            includeAll: z.boolean().optional().describe("If true, automatically paginates through all results. Default is false."),
        },
        async ({ sheetId, rowId, include, pageSize, page, includeAll }) => {
            try {
                console.info(`Getting discussions for row with ID: ${rowId} in sheet with ID: ${sheetId}`);
                const discussions = await api.discussions.getDiscussionsByRowId(sheetId, rowId, include, pageSize, page, includeAll);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(discussions, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to get discussions for row ID: ${rowId} in sheet ID: ${sheetId}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get discussions: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "create_sheet_discussion",
        "Creates a new discussion at the sheet level. This is useful for general comments about the entire sheet.",
        {
            sheetId: z.string().describe("The ID of the sheet where the discussion will be created."),
            commentText: z.string().describe("The text of the initial comment for the new discussion.")
        },
        async ({ sheetId, commentText }) => {
            try {
                console.info(`Creating discussion on sheet with ID: ${sheetId}`);
                const discussion = await api.discussions.createSheetDiscussion(sheetId, commentText);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(discussion, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to create discussion on sheet ID: ${sheetId}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to create discussion: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "create_row_discussion",
        "Creates a new discussion on a specific row within a sheet. This is for comments that are specific to a particular row's data.",
        {
            sheetId: z.string().describe("The ID of the sheet containing the row."),
            rowId: z.string().describe("The ID of the row where the discussion will be created."),
            commentText: z.string().describe("The text of the initial comment for the new discussion.")
        },
        async ({ sheetId, rowId, commentText }) => {
            try {
                console.info(`Creating discussion on row with ID: ${rowId} in sheet with ID: ${sheetId}`);
                const discussion = await api.discussions.createRowDiscussion(sheetId, rowId, commentText);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(discussion, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to create discussion on row ID: ${rowId} in sheet ID: ${sheetId}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to create discussion: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

}
