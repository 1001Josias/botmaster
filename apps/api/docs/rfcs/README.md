# API RFCs

This directory contains RFCs specific to the API application.

## How to Create a New RFC

1. Copy the central template from [`/apps/docs/rfcs/rfc-template.md`](../../docs/rfcs/rfc-template.md):

   ```bash
   # Copy the RFC template to create a new RFC (replace NNNN and title)
   cp apps/docs/rfcs/rfc-template.md apps/api/docs/rfcs/NNNN-your-rfc-title.md
   ```

2. Place it in this directory with the format `NNNN-descriptive-title.md`
3. Fill out all sections, ensuring "Target Application(s)" includes "api"
4. Follow the RFC process outlined in [`/apps/docs/rfcs/README.md`](../../docs/rfcs/README.md)

## Cross-Application RFCs

If your RFC affects multiple applications, consider placing it in the shared directory at [`/apps/docs/rfcs/shared/`](../../docs/rfcs/shared/) instead.
