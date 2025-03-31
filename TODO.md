# TODO List for Terra Numina Web App

## Multi-repo Migration
- [ ] Split Current Codebase: Move public content and web app logic into separate repositories.

- [ ] Set Up Separate Deployment Pipelines: Configure Vercel/Netlify for the public site and CI/CD for the web app.

- [ ] Test and Launch: Validate that both systems work independently while maintaining expected functionality.


## Backend
- [ ] Fix loging status handling in `server.js`
- [ ] Layout MongoDB structure & queries for `/api/posts`
- [ ] Connect automatic email generation feature to database + cc feature to TNgmail

## Frontend
- [ ] Fix mobile responsiveness in `resources_public.html`
- [x] Code dynamic slider in home page
- [ ] Propose a simple admin dashboard layout
- [x] Add Past Field Trips page
- [x] Update Activities page contents
- [x] Think about transparent navbar
- [ ] Highlight animation on the current page in navbar
- [ ] navbar for mobile

## Questions to Pep:
1. How should the user authentication flow be improved?
2. Should we add an admin dashboard for managing content?
3. Have a section to see members list and who is subscribed to mailing? should that be default?


## Questions to Team:
1. How to become a member? manually via email/via signup? where should the link be?
2. In past field trips page, do we want an actual dynamic map to show Gmap points?
3. Which section/information in past_field_trips after the gallery?