# Yahtzee

### Description

A personal project, just for fun, to play around with some interests to learn/explore/experiment at my own pace.

I'll limit the infrastructure requirements to the bare minium so that it can run on my shared hosting (no custom port options, mainly Apache, no NodeJs, no commandline, no Docker, ... ) with only PHP and MySQL options.
(Since that is something I currently have for my domain and I don't want to "invest" in a different server/hosting, just to test/play around with this project)

### Ideas/Goals

Things I want to work out, or look into, whenever I feel like it and have time for it.

- Prettify the design and add some animations
- Some mobile-friendly support
- Prevent "cheating", state maniupulation, ... 
- Add a back-end
  - User registration / guest account
  - Game history and leaderboards
  - Add multiplayer support with "room creation"
    - Websocket or pubsub via third-party service (that is free/cheap like Pubnub) to allow for hosting on shared-hosting
    - Real-time gameplay
