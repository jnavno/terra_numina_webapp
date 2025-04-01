# TODO List for Terra Numina Web App

## Multi-repo Migration
- [ ] Split Current Codebase: Move public content and web app logic into separate repositories.

- [ ] Set Up Separate Deployment Pipelines: Configure Vercel/Netlify for the public site and CI/CD for the web app.

- [ ] Test and Launch: Validate that both systems work independently while maintaining expected functionality.


## Backend
- [ ] Fix loging status handling in `server.js`
- [ ] Layout MongoDB structure & queries for `/api/posts`


## Frontend
- [ ] clean all website-related files and reassign hyperlinks
- [ ] Fix mobile responsiveness in `resources_public.html`
- [x] Code dynamic slider in home page
- [ ] Propose a simple admin dashboard layout


- [x] Think about transparent navbar
- [ ] Highlight animation on the current page in navbar
- [ ] navbar for mobile

## Questions to Pep:

2. Should we add an admin dashboard for managing content?
    maybe follow a button only approach, no dedicated pages. Share ui except for buttons for each role
3. Have a section to see members list and who is subscribed to mailing? should that be default?


## Questions to Team:
1. How to become a member? manually via email/via signup? where should the link be?
2. In past field trips page, do we want an actual dynamic map to show Gmap points?
3. Which section/information in past_field_trips after the gallery?