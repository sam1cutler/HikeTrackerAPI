# HikeTracker API

## General Description
This Express server serves as the API for the HikeTracker React app, linking that app to a PostgreSQL database. You can find the Vercel-hosted app [here](https://hike-tracker.vercel.app/) and the app's GitHub repo [here](https://github.com/sam1cutler/HikeTracker). 

## Summary
This API includes 3 main endpoints: `/hikes`, `/users`, and `/auth`. The latter two are responsible for maintaining and authenticating registered users of the app, respectively, and the `/hikes` endpoint is responsible for the core functionality of the app. Users are able to create records of hikes they have done, logging information about each hike, including:
- Hike name
- Hike date
- Total mileage
- Total elevation change
- Time
- Weather
- Notes about the hike
- Link to a reference with info about the hike

## Technology used
Express, PostgreSQL, Heroku, Morgan, Helmet. 

## Contact me
You can find [my GitHub page here](https://github.com/sam1cutler).

## Acknowledgements
This project is part of an assignment for the Thinkful software engineering program. 