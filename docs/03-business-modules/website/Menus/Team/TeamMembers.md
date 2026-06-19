# Team Members — Team

> **Module:** Website · **Screen:** Team Members · **Route:** `/website/team` · **Status:** Draft

## Purpose
Manage team member profiles displayed on the website.

## Layout
Grid/list view + right Sheet drawer.

## Table Columns
`Photo` · `Name` · `Role` · `Department` · `Published` · `Sort Order` · `Actions`

## Sheet — Team Member Fields
- Full Name (required)
- Job Title / Role (required)
- Department (text or dropdown)
- Bio (rich text — short)
- Photo (media picker — recommended square)
- LinkedIn URL
- Email (optional — show on website toggle)
- Sort Order
- Published (toggle)

## Actions
- **Publish / Hide**
- **Reorder** (drag-and-drop)
- **Delete**

---

# Career Listings — Team

> **Screen:** Career Listings · **Route:** `/website/careers`

## Table Columns
`Job Title` · `Department` · `Location` · `Type` · `Status` · `Expires At` · `Applications`

## Sheet — Career Listing Fields
- Job Title (required)
- Department
- Location
- Job Type (Full-time / Part-time / Contract / Remote)
- Description (rich text — full JD)
- Application Form (link to `website_forms`)
- Expiry Date
- Status (draft / published / closed)
