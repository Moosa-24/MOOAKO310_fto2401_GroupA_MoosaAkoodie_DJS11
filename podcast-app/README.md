# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


User story checklist:
1. Setup and Deployment: Project is deployed to a custom Netlify URL - DONE
2. User sees a custom icon in the tab window. All favicon information has been created and added correctly via realfavicongenerator.net - DONE
3. Metatag information has been created and added via metatags.io. Be mindful to manually replace all URL values (especially image URL) to absolute Netlify URL values (you will need to deploy to Netlify first) - DONE
4. User sees the name of all available shows on the platform - DONE

5. User sees shows sorted alphabetically when the app loads (default sorting) -
6. User has a way to listen to any episode in a season for a show (note there is a single placeholder audio track for all shows) -
7. User is able to see a view where only episodes for a specific selected season are shown (Note that this can be a page view, a modal, or toggle dropdown - up to developer's design choice) - 
8. User is able to toggle between different seasons for the same show - 
9. User sees preview image of shows when browsing - 
10. User sees the amount of seasons as a number in a show when browsing -
11. User sees a human-readable date to when a show was last updated -
12. User sees what genres (as genre titles) a show is associated with when browsing -
13. User sees a preview image of seasons for a specific show (Note some Shows have different images for each Season) -
14. User sees the amount of episodes as a number for a season -
15. User is able to go back to a show view from a season-specific view -
16. All show data loaded via a fetch call from the API (Note no podcast data should be hardcoded in the application) -
17. When viewing a specific show, data is loaded via fetch from individual show endpoint -
18. There is a loading state while initial data is being loaded -
19. There is a loading state while new data is being loaded - 
20. User is able to mark specific episodes as favourites so that they can find them again (Note the requirement is that a specific episode of a specific season of a specific show is to be favourited) -
21. User can visit a view where they see all their favourite episodes -
22. User is able to see the associated show and season when an episode is in favourites -
23. Related by season/show episodes are grouped together in favourites -
24. User is able to remove episodes from their favourites -
25. User sees the date and time that they added something as a favourite -
26. User is able to arrange favourites based on title from A-Z -
27. User is able to arrange favourites based on title from Z-A -
28. User is able to arrange favourites starting with the most recently updated -
29. User is able to arrange favourites starting with the furthest back updated -
30. User is able to arrange lists of shows based on title from A-Z -
31. User is able to arrange lists of shows based on title from Z-A -
32. User is able to arrange list showing the most recently updated (Newly updated Shows) -
33. User is able to arrange list of shows from least recently updated (Oldest updated Shows) -
34. Audio player is always visible so that user can listen to episodes while browsing -
35. Audio player must show listening progress -
36. User receives a notification that confirms they want to close the page when audio is playing -
37. User can filter shows by genre -
38. App remembers and shows what episodes user listened to all the way through -
39. Favourites must be persisted in localStorage -
40. User has the option to "reset" all their progress, effectively removing their entire listening history. (Note marks are awarded only for    "resetting" entire listening history) -
41. The project has a good appearance and Desktop layout when opened in a web browser -
42. The project is easy to navigate and interact with through a web browser -
43. The project's commit history shows short and clear commit messages -
44. The project displays well on different devices and all screen sizes, ensuring usability on tablets -
45. The README file includes a comprehensive introduction to the project, setup instructions, usage examples, and contact information -
46. The project loads and functions without ANY bugs (Completed user stories possess no bugs whatsoever) -
47. Well organized project structure & clean readable code -
48. The project has extra features that make for a good user-experience -
49. User is presented with a sliding carousel of possible shows they might be interested in on the landing page -
50. User is able to filter shows based on title by means of a text input -
51. User is able to find shows based on fuzzy matching of concepts -
52. App displays the exact timestamp location of where they left off any episode -