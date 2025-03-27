import { env } from '@/common/utils/envConfig'
import { Organization } from './organization.model'

export class OrganizationRepository {
  async getOrganizations(userKey: string): Promise<Organization[]> {
    try {
      const response = await fetch(`${env.KEYCLOAK_BASE_URL}/organizations/members/${userKey}/organizations`)
      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.statusText}`)
      }
      return response.json() as Promise<Organization[]>
    } catch (err) {
      throw err
    }
  }
}
