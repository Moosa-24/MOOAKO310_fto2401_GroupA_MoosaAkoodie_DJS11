# React Podcast App

Welcome to the React Podcast App! This project allows you to discover and listen to podcasts using React.

## Table of Contents
1. Introduction
2. Features
3. Installation
4. Contact
5. Delevopment Process

## Introduction
This React Podcast App is designed to provide users with a seamless experience for discovering and listening to podcasts. It utilizes React to create a dynamic and responsive user interface.

## Features
- Browse podcasts by categories
- Play episodes directly in the app
- Save favorite episodes
- ### not done - Responsive design for mobile and desktop 

## Installation
In the project directory, you can run:
### `npm install`
### `npm start`

Therafter this will run the app for you in development mode.
Open [http://localhost:3000] to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Contact
For questions or feedback regarding the React Podcast App, feel free to reach out:

- Email: moosaakoodie3@gmail.com

## MY Development Process:
### Initial Setup and Deployment
   1. Setup and Deployment: Project is deployed to a custom Netlify URL - done
   2. User sees a custom icon in the tab window. All favicon information has been created and added correctly via realfavicongenerator.net - done
   3. Metatag information has been created and added via metatags.io. Be mindful to manually replace all URL values (especially image URL) to absolute Netlify URL values (you will need to deploy to Netlify first) - done

### Basic Structure and Data Loading
   4. All show data loaded via a fetch call from the API (Note no podcast data should be hardcoded in the application) - done
   5. When viewing a specific show, data is loaded via fetch from individual show endpoint - done
   6. There is a loading state while initial data is being loaded - done
   7. There is a loading state while new data is being loaded - done

### Display Shows and Seasons
   8. User sees the name of all available shows on the platform - done
   9. User sees shows sorted alphabetically when the app loads (default sorting) - done
   10. User sees preview image of shows when browsing - done
   11. User sees the amount of seasons as a number in a show when browsing - done
   12. User sees what genres (as genre titles) a show is associated with when browsing - done
   13. User sees a human-readable date to when a show was last updated - done
   14. User sees a preview image of seasons for a specific show (Note some Shows have different images for each Season) - done
   15. User sees the amount of episodes as a number for a season - done
   16. User is able to toggle between different seasons for the same show - done
   17. ### User is able to go back to a show view from a season-specific view - NOT DONE

### Episode Interaction
   18. User has a way to listen to any episode in a season for a show (note there is a single placeholder audio track for all shows) - done
   19. User is able to see a view where only episodes for a specific selected season are shown (Note that this can be a page view, a modal, or toggle dropdown - up to developer's design choice) - done
   20. Audio player is always visible so that user can listen to episodes while browsing - done
   21. Audio player must show listening progress - done

### Favorites and Filtering
   22. ### User is able to mark specific episodes as favourites so that they can find them again (Note the requirement is that a specific episode of a specific season of a specific show is to be favourited) - HALF done(i cant choose multiple but i can choose a specific one that i want)
   23. User can visit a view where they see all their favourite episodes - done
   24. ### User is able to see the associated show and season when an episode is in favourites - NOT DONE
   25. ### Related by season/show episodes are grouped together in favourites - NOT DONE
   26. User is able to remove episodes from their favourites - done
   27. User sees the date and time that they added something as a favourite - done
   28. Favourites must be persisted in localStorage - done
   29. ### User can filter shows by genre - NOT DONE
   30. User is able to filter shows based on title by means of a text input - done

### Sorting and Arrangement
        cant test because of favorite issue - used the exact filter from podcastlist.js which works
   31. User is able to arrange favourites based on title from A-Z - done
   32. User is able to arrange favourites based on title from Z-A - done
   33. User is able to arrange favourites starting with the most recently updated - done
   34. User is able to arrange favourites starting with the furthest back updated - done

   35. User is able to arrange lists of shows based on title from A-Z - done
   36. User is able to arrange lists of shows based on title from Z-A - done
   37. User is able to arrange list showing the most recently updated (Newly updated Shows) - done
   38. ### User is able to arrange list of shows from least recently updated (Oldest updated Shows) - done(i think)

### Advanced Features
   39. User receives a notification that confirms they want to close the page when audio is playing
   40. App remembers and shows what episodes user listened to all the way through
   41. User has the option to "reset" all their progress, effectively removing their entire listening history. (Note marks are awarded only for "resetting" entire listening history)
   42. App displays the exact timestamp location of where they left off any episode

### UI/UX Enhancements
   43. The project has a good appearance and Desktop layout when opened in a web browser - done
   44. The project is easy to navigate and interact with through a web browser - done
   45. ### The project displays well on different devices and all screen sizes, ensuring usability on tablets - NOT DONE
   46. ### The project has extra features that make for a good user-experience - (loading screen done, idk what else)
   47. User is presented with a sliding carousel of possible shows they might be interested in on the landing page

### Finalizing and Documentation
   48. The README file includes a comprehensive introduction to the project, setup instructions, usage examples, and contact information - done
   49. The project's commit history shows short and clear commit messages - done
   50. ### The project loads and functions without ANY bugs (Completed user stories possess no bugs whatsoever) - NOT DONE
   51. Well organized project structure & clean readable code - done
   52. ### User is able to find shows based on fuzzy matching of concepts
