import tweepy
import logging
import sys
import json

consumer_key = "5WklV4NnXdEb6TQCx6w5oNw8D"
consumer_secret = "P4Z4NLM3TBVr89BAuOmz746ETzrMsLwGAcUYmt0q8lSVZLyiqI"
access_token = "832616602352783362-REK4k2PnLHhe4gIlkgMrlpwhWpteMW5"
access_token_secret = "2sGMdWOQF8aN4QO7UIfsPG5a6koxkl1wjLny0PNu1Hqbu"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)


# User Metrics
def metric():
    count = 0
    favourites = 0
    retweets = 0
    user = api.get_user("elonmusk")
    for tweet in tweepy.Cursor(
        api.user_timeline,
        screen_name="elonmusk",
        count=200,
        tweet_mode="extended",
    ).items(user.statuses_count):
        if "retweeted_status" not in tweet._json:
            count += 1
            print(f"#{count}")
            print(tweet._json["full_text"])
            fav = tweet._json["favorite_count"]
            print(f"favourites={fav}")
            rt = tweet._json["retweet_count"]
            print(f"retweets={rt}")
            favourites += tweet._json["favorite_count"]
            retweets += tweet._json["retweet_count"]
            print()
    print(f"totalfavourites={favourites}")
    print(f"totalretweets={retweets}")


# metric()


# Replies
def reply_analysis():
    tweets = api.user_timeline(
        screen_name="Asunaa", count=4, tweet_mode="extended")
    for tweet in tweets:
        print(tweet.full_text)
        tweet_id = tweet.id
        replies = tweepy.Cursor(
            api.search, q=f"to:Asunaa", since_id=tweet_id, tweet_mode="extended"
        ).items()

        while True:
            try:
                reply = replies.next()
                if not hasattr(reply, "in_reply_to_status_id_str"):
                    continue
                if reply.in_reply_to_status_id == tweet_id:
                    replier = reply._json["user"]["screen_name"]
                    print(f"reply by {replier}:{reply.full_text}")

            except tweepy.RateLimitError as e:
                print("Twitter api rate limit reached:{}".format(e))
                continue

            except tweepy.TweepError as e:
                print("Tweepy error occured:{}".format(e))
                break

            except StopIteration:
                break

            except Exception as e:
                print("Failed while fetching replies {}".format(e))
                break

            print()


# Trends
# trending = api.trends_available()
# print(trending)


# Text for analysis
def text_analysis(search_term):
    search_query = f"{search_term} -filter:retweets"
    results = tweepy.Cursor(
        api.search, q=search_query, lang="en", tweet_mode="extended", count=100
    ).items(200)
    tweets = []
    for result in results:
        tweet = {"text": result._json["full_text"], "username": result._json["user"]["screen_name"],
                 "favorite_count": result._json["favorite_count"], "retweet_count": result._json["retweet_count"], "created_at": result._json["created_at"]}
        tweets.append(tweet)
    tweets = list(filter(None, tweets))
    print(json.dumps(tweets))
    sys.stdout.flush()
    # search_query = f"ps5 -filter:retweets"
    # results = tweepy.Cursor(
    #     api.search, q=search_query, lang="en", tweet_mode="extended", count=300
    # ).items(1000)
    # count = 0
    # for result in results:
    #     count += 1
    #     print(f"#{count}")
    #     print(result._json["user"]["screen_name"])
    #     print(result._json["full_text"])
    #     print()


text_analysis(sys.argv[1])


# Mention Analysis
# def mention_analysis():
#     mentions = tweepy.Cursor(
#         api.mentions_timeline, lang="en", tweet_mode="extended", count=200
#     ).items()
#     count = 0
#     for mention in mentions:
#         count += 1
#         print(f"#{count}")
#         print(mention._json["user"]["screen_name"])
#         print(mention._json["full_text"])
#         print()
#     print(f"No. of mentions: {count}")


# mention_analysis()
