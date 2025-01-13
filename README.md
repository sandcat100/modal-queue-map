# How long does it take to get a GPU on Modal?

We could tell you, but you wouldn't believe us anyway.

This is a little project to more concretely showcase:
1) GPU availability on [Modal](https://modal.com/) across all GPU types, including H100s
2) Consistency of our GPU availability over time
3) Speed at which your code can be up and running on a GPU in the cloud

<img width="1685" alt="image" src="https://github.com/user-attachments/assets/207d0f4d-1bc6-42d7-9480-a4cf00cc4868" />

I use Modal (of course) to run a cron job that calls a Modal Function every 30 minutes, across all of our GPU types. I measure the time between the Modal Function being called and the first line of code in the Function being run. The samples are stored in Convex, which is a product I've been wanting to try out. It's a nifty database that will automatically push new data to my React frontend and trigger a re-render so I don't need to poll a db! The frontend is cobbled together from various D3 snippets I found on the web. Speaking of which, is D3 still the gold standard for data viz? If not, let me know what I should be using instead.

Live site: ([modal-queue-map.vercel.app](https://modal-queue-map.vercel.app/))
