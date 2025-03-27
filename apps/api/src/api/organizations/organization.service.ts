import { OrganizationRepository } from './organization.repository'
import { Organization } from './organization.model'
import { User } from '../user/userModel'

export class OrganizationService {
  constructor(private repository: OrganizationRepository = new OrganizationRepository()) {}

  async getOrganizations(user: User): Promise<Organization[]> {
    return this.repository.getOrganizations(user.key)
  }
}
