# Form List — Forms

> **Module:** Website · **Screen:** Form List · **Route:** `/website/forms` · **Status:** Draft

## Purpose
Manage all website forms — contact, lead capture, newsletter, survey, job application.

## Layout
Standard list page + right Sheet drawer.

## Table Columns
`Name` · `Type` · `Submissions` · `Conversion Rate` · `Status` · `Actions`

## Sheet — Form Fields
- Form Name (internal)
- Form Title (public heading)
- Form Type (contact / lead / newsletter / survey / application)
- Fields (JSON builder — drag and drop)
- Success Message
- Notify Emails (comma separated)
- CRM Pipeline (optional — dropdown if CRM installed)
- CAPTCHA (toggle)
- Active (toggle)

## Form Field Types
`text` · `email` · `phone` · `textarea` · `select` · `checkbox` · `radio` · `file` · `date` · `hidden`

## Actions
- **View Submissions** → `/website/forms/{id}/submissions`
- **Copy embed code** (iframe / script)
- **Preview form**
- **Duplicate**
- **Delete**
