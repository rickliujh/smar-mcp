import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getUpdateRequestTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
      "create_update_request",
      "Sends an update request to one or more recipients for specified rows in a sheet. This prompts them to update cell values in the specified columns.",
      {
        sheetId: z.string().describe("The ID of the sheet containing the rows to be updated."),
        rowIds: z.array(z.number()).optional().describe("An JSON array object of row IDs to include in the update request. If not specified, the request applies to all rows."),
        columnIds: z.array(z.number()).optional().describe("An JSON array object of column IDs to be included for update. If not specified, all columns are included."),
        includeAttachments: z.boolean().optional().describe("If true, attachments from the rows will be included in the update request. Default is false."),
        includeDiscussions: z.boolean().optional().describe("If true, discussions from the rows will be included in the update request. Default is false."),
        message: z.string().optional().describe("A custom message to be included in the body of the update request email."),
        subject: z.string().optional().describe("The subject line for the update request email."),
        ccMe: z.boolean().optional().describe("If true, a copy of the update request email will be sent to the current user. Default is false."),
        sendTo: z.array(
          z.object({
            email: z.string().describe("The email address of a recipient.")
          })
        ).describe("An JSON array object of recipient objects, each with an email address."),
      },
      async ({ sheetId, rowIds, columnIds, includeAttachments, includeDiscussions, message, subject, ccMe, sendTo }) => {
        try {
          console.info(`Creating update request for sheet ${sheetId}`);
          const result = await api.sheets.createUpdateRequest(sheetId, {
            rowIds,
            columnIds,
            includeAttachments,
            includeDiscussions,
            message,
            subject,
            ccMe,
            sendTo
          });
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        } catch (error: any) {
          console.error("Failed to create update request", { error });
          return {
            content: [
              {
                type: "text",
                text: `Failed to create update request: ${error.message}`
              }
            ],
            isError: true
          };
        }
      }
    );

}
