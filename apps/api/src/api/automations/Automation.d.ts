export interface IAutomation {
  id?: string
  key?: string
  name: string
  description: string
  createdBy: string
  updatedBy: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Interface defining the contract for Automation-related operations
 * across different application layers.
 */
export interface IAutomationContract {
  /**
   * Creates a new automation entry.
   * @param automation - The automation details to create.
   * @returns A promise that resolves when the automation is created.
   * @throws Will throw an error if the creation fails.
   */
  createAutomation(automation: IAutomation): Promise<void>

  /**
   * Fetches an automation by its ID.
   * @param id - The unique identifier of the automation.
   * @returns A promise that resolves with the automation details if found, or null if not.
   * @throws Will throw an error if the fetch fails.
   */
  getAutomationById(id: string): Promise<IAutomation | null>

  /**
   * Fetches all automations.
   * @returns A promise that resolves with an array of all automations.
   * @throws Will throw an error if the fetch fails.
   */
  getAllAutomations(): Promise<IAutomation[]>

  /**
   * Updates an existing automation entry.
   * @param automation - The updated automation details.
   * @returns A promise that resolves when the automation is updated.
   * @throws Will throw an error if the update fails.
   */
  updateAutomation(automation: IAutomation): Promise<void>

  /**
   * Deletes an automation by its ID.
   * @param id - The unique identifier of the automation to delete.
   * @returns A promise that resolves when the automation is deleted.
   * @throws Will throw an error if the deletion fails.
   */
  deleteAutomation(id: string): Promise<void>
}
