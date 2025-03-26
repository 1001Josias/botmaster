import z from 'zod'

export const OrganizationSchema = z.object({
  key: z.string().describe('The unique identifier of the organization'),
  name: z.string().describe('The name of the organization'),
  subdomain: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      'Subdomain must be lowercase, without spaces, and only contain letters, numbers, and hyphens',
    )
    .describe('The subdomain of the organization'),
  enabled: z.boolean().describe('Whether the organization is enabled'),
})

export type Organization = z.infer<typeof OrganizationSchema>
