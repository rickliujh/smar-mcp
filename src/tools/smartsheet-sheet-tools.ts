import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getSheetTools(server: McpServer, api: SmartsheetAPI, allowDeleteTools: boolean) {

    server.tool(
      "get_sheet",
      "Retrieves the full details of a specific sheet, including its data, column definitions, and formatting. This is useful for getting a complete snapshot of a sheet's structure and content.",
      {
        sheetId: z.string().describe("The unique identifier (ID) for the sheet you want to retrieve. Example: '8239427627331460'"),
        include: z.string().optional().describe("A comma-separated list of optional elements to include in the response for more detailed information. Valid values: attachments, columnType, crossSheetReferences, discussions, filters, format, formulas, gannett, objectValue, ownerInfo, projectSettings, rowPermalink, rowWriterInfo, source, summary. For example, to get formatting and formulas, use: 'format,formulas'"),
        pageSize: z.number().optional().describe("The number of rows to return in a single request (for pagination). Default is 100."),
        page: z.number().optional().describe("The page number to retrieve when paginating through rows. Default is 1."),
      },
      async ({ sheetId, include, pageSize, page }) => {
        try {
          console.info(`Getting sheet with ID: ${sheetId}`);
          const sheet = await api.sheets.getSheet(sheetId, include, undefined, pageSize, page);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(sheet, null, 2)
              }
            ]
          };
        } catch (error: any) {
          console.error(`Failed to get sheet with ID: ${sheetId}`, { error });
          return {
            content: [
              {
                type: "text",
                text: `Failed to get sheet: ${error.message}`
              }
            ],
            isError: true
          };
        }
      }
    );

    server.tool(
      "get_sheet_by_url",
      "Gets a sheet by its URL, including its data, columns, and formatting. This is useful when you have the URL of a sheet but not its ID.",
      {
        url: z.string().describe("The URL of the sheet to retrieve."),
        include: z.string().optional().describe("A comma-separated list of optional elements to include in the response. Valid values: attachments, columnType, crossSheetReferences, discussions, filters, format, formulas, gannett, objectValue, ownerInfo, projectSettings, rowPermalink, rowWriterInfo, source, summary. Default is an empty string (no extra elements). Example: 'format,formulas'"),
        pageSize: z.number().optional().describe("The number of rows to return per page. Default is 100."),
        page: z.number().optional().describe("The page number to return. Default is 1."),
      },
      async ({ url, include, pageSize, page }) => {
        try {
          console.info(`Getting sheet with URL: ${url}`);
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
          const sheet = await api.sheets.getSheetByDirectIdToken(directIdToken, include, undefined, pageSize, page);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(sheet, null, 2)
              }
            ]
          };
        } catch (error: any) {
          console.error(`Failed to get sheet with URL: ${url}`, { error });
          return {
            content: [
              {
                type: "text",
                text: `Failed to get sheet: ${error.message}`
              }
            ],
            isError: true
          };
        }
      }
    );

    server.tool(
        "get_sheet_version",
        "Gets the version number of the specified sheet. Each time a sheet is updated, its version number is incremented.",
        {
          sheetId: z.string().describe("The ID of the sheet."),
        },
        async ({ sheetId }) => {
          try {
            console.info(`Getting version for sheet with ID: ${sheetId}`);
            const version = await api.sheets.getSheetVersion(sheetId);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(version, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to get sheet version for sheet ID: ${sheetId}`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to get sheet version: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );
      
      server.tool(
        "get_cell_history",
        "Retrieves the history of changes for a specific cell in a sheet, showing how its value has changed over time.",
        {
          sheetId: z.string().describe("The ID of the sheet containing the cell."),
          rowId: z.string().describe("The ID of the row containing the cell."),
          columnId: z.string().describe("The ID of the column for the cell."),
          include: z.string().optional().describe("A comma-separated list of optional elements to include in the response. Valid values: 'objectValue'. Default is an empty string."),
          pageSize: z.number().optional().describe("The number of history items to return per page. Default is 100."),
          page: z.number().optional().describe("The page number to return. Default is 1."),
        },
        async ({ sheetId, rowId, columnId, include, pageSize, page }) => {
          try {
            console.info(`Getting history for cell at row ${rowId}, column ${columnId} in sheet ${sheetId}`);
            const history = await api.sheets.getCellHistory(sheetId, rowId, columnId, include, pageSize, page);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(history, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to get cell history for row ${rowId}, column ${columnId} in sheet ${sheetId}`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to get cell history: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );

      server.tool(
        "get_row",
        "Gets the details of a specific row within a sheet.",
        {
          sheetId: z.string().describe("The ID of the sheet containing the row."),
          rowId: z.string().describe("The ID of the row to retrieve."),
          include: z.string().optional().describe("A comma-separated list of optional elements to include in the response. Valid values: 'columns,discussions,attachments,columnType,format,objectValue'. Default is an empty string."),
        },
        async ({ sheetId, rowId, include }) => {
          try {
            console.info(`Getting row ${rowId} in sheet ${sheetId}`);
            const row = await api.sheets.getRow(sheetId, rowId, include);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(row, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to get row ${rowId} in sheet ${sheetId}`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to get row: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );
      
      server.tool(
        "update_rows",
        "Updates specific cells within one or more existing rows in a sheet. This tool can be used to change values, apply formulas, or adjust formatting for multiple cells at once.",
        {
          sheetId: z.string().describe("The ID of the sheet containing the rows to update."),
          rows: z.array(
            z.object({
              id: z.string().describe("The unique identifier (ID) of the row to update."),
              cells: z.array(
                z.object({
                  columnId: z.number().or(z.string()).describe("The ID of the column for the cell you want to update."),
                  value: z.any().optional().describe("The new value for the cell. Can be a string, number, or boolean."),
                  formula: z.string().optional().describe("A formula to set for the cell. Example: '=SUM([ColumnA]1:[ColumnB]1)'"),
                  format: z.string().optional().describe("A format descriptor to apply to the cell. See Smartsheet API documentation for details."),
                })
              ).describe("An JSON array object of cell objects within the row to update."),
            })
          ).describe("An JSON array object of row objects to update. Each object must contain the `id` of the row and an array of `cells` to be modified."),
        },
        async ({ sheetId, rows }) => {
          try {
            console.info(`Updating ${rows.length} rows in sheet ${sheetId}`);
            const result = await api.sheets.updateRows(sheetId, rows);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to update ${rows.length} rows in sheet ${sheetId}`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to update rows: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );
      
      server.tool(
        "add_rows",
        "Adds one or more new rows to a sheet. Rows can be added to the top or bottom of the sheet.",
        {
          sheetId: z.string().describe("The ID of the sheet to add rows to."),
          rows: z.array(
            z.object({
              toTop: z.boolean().optional().describe("If true, the row will be inserted at the top of the sheet. Default is false (appended to the bottom). Overrides toBottom."),
              toBottom: z.boolean().optional().describe("If true, the row will be appended to the bottom of the sheet. Default is true."),
              cells: z.array(
                z.object({
                  columnId: z.number().or(z.string()).describe("The ID of the column to add data to."),
                  value: z.any().optional().describe("The value to set in the cell. Can be a string, number, or boolean."),
                  formula: z.string().optional().describe("The formula to set in the cell."),
                  format: z.string().optional().describe("The format to apply to the cell."),
                })
              ).describe("An JSON array object of cell objects containing the data for the new row."),
            })
          ).describe("An JSON array object of row objects to add to the sheet."),
        },
        async ({ sheetId, rows }) => {
          try {
            console.info(`Adding ${rows.length} rows to sheet ${sheetId}`);
            const result = await api.sheets.addRows(sheetId, rows);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to add ${rows.length} rows to sheet ${sheetId}`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to add rows: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );
      
      if (allowDeleteTools) {
        server.tool(
          "delete_rows",
          "Deletes one or more rows from a sheet permanently. This action cannot be undone.",
          {
            sheetId: z.string().describe("The ID of the sheet from which to delete rows."),
            rowIds: z.array(z.string()).describe("An JSON array of row IDs to be deleted."),
            ignoreRowsNotFound: z.boolean().optional().describe("If true, the request will not fail if any of the specified row IDs are not found. Default is false."),
          },
          async ({ sheetId, rowIds, ignoreRowsNotFound }) => {
            try {
              console.info(`Deleting ${rowIds.length} rows from sheet ${sheetId}`);
              const result = await api.sheets.deleteRows(sheetId, rowIds, ignoreRowsNotFound);
              
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                  }
                ]
              };
            } catch (error: any) {
              console.error(`Failed to delete ${rowIds.length} rows from sheet ${sheetId}`, { error });
              return {
                content: [
                  {
                    type: "text",
                    text: `Failed to delete rows: ${error.message}`
                  }
                ],
                isError: true
              };
            }
          }
        );
      } else {
        console.warn("Delete operations are disabled. Set ALLOW_DELETE_TOOLS=true to enable them.");
      }
      
      server.tool(
        "get_sheet_location",
        "Finds the ID of the folder or workspace that contains a specific sheet.",
        {
          sheetId: z.string().describe("The ID of the sheet to locate."),
        },
        async ({ sheetId }) => {
          try {
            console.info(`Getting location for sheet ${sheetId}`);
            const location = await api.sheets.getSheetLocation(sheetId);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(location, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to get location for sheet ${sheetId}`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to get sheet location: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );
      
      server.tool(
        "copy_sheet",
        "Creates a copy of a sheet, including its data and formatting. The new sheet can be placed in any folder.",
        {
          sheetId: z.string().describe("The ID of the sheet to copy."),
          destinationName: z.string().describe("The name for the new, copied sheet."),
          destinationFolderId: z.string().optional().describe("The ID of the folder where the new sheet will be created. If not specified, it's copied to the same folder as the original."),
        },
        async ({ sheetId, destinationName, destinationFolderId }) => {
          try {
            console.info(`Copying sheet ${sheetId} to "${destinationName}"`);
            
            if (!destinationFolderId) {
              try {
                const location = await api.sheets.getSheetLocation(sheetId);
                destinationFolderId = location.folderId;
              } catch (error) {
                console.warn("Failed to get sheet location, using default folder", { error });
              }
            }
            
            const result = await api.sheets.copySheet(sheetId, destinationName, destinationFolderId);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to copy sheet ${sheetId} to "${destinationName}"`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to copy sheet: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );
      
      server.tool(
        "create_sheet",
        "Creates a new, empty sheet with specified columns in a designated folder or workspace.",
        {
          name: z.string().describe("The name of the new sheet to be created."),
          columns: z.array(
            z.object({
              title: z.string().describe("The title for the column."),
              type: z.string().describe("The type of the column. Valid types: TEXT_NUMBER, DATE, DATETIME, CHECKBOX, CONTACT_LIST, PICKLIST, DURATION, PREDECESSOR."),
              primary: z.boolean().optional().describe("If true, this column will be the primary column for the sheet. Only one primary column is allowed per sheet."),
            })
          ).describe("An JSON array object of column objects that defines the sheet's structure."),
          folderId: z.string().optional().describe("The ID of the folder to create the sheet in. If not specified, the sheet is created in the user's default 'Sheets' folder."),
        },
        async ({ name, columns, folderId }) => {
          try {
            console.info(`Creating new sheet "${name}"`);
            const result = await api.sheets.createSheet(name, columns, folderId);
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          } catch (error: any) {
            console.error(`Failed to create sheet "${name}"`, { error });
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to create sheet: ${error.message}`
                }
              ],
              isError: true
            };
          }
        }
      );

}
