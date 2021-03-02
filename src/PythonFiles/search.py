import tweepy
import logging
import json
import requests
import os

from dotenv import load_dotenv
from pathlib import Path
env_path = f'{Path(__file__).parents[1]}\.env'
load_dotenv(dotenv_path=env_path)
# import random
# import math
# import base64
# import urllib
# from hashlib import sha1
# import hmac
# import time
# from requests_oauthlib import OAuth1Session


consumer_key = "5WklV4NnXdEb6TQCx6w5oNw8D"
consumer_secret = "P4Z4NLM3TBVr89BAuOmz746ETzrMsLwGAcUYmt0q8lSVZLyiqI"
access_token = "832616602352783362-REK4k2PnLHhe4gIlkgMrlpwhWpteMW5"
access_token_secret = "2sGMdWOQF8aN4QO7UIfsPG5a6koxkl1wjLny0PNu1Hqbu"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)


# Text for analysis
def text_analysisusingapiv1(search_term):
    search_query = f"{search_term} -filter:retweets"
    results = tweepy.Cursor(
        api.search, q=search_query, lang="en", tweet_mode="extended", count=100
    ).items(1000)
    tweets = []
    for result in results:
        tweet = {"text": result._json["full_text"], "username": result._json["user"]["screen_name"],
                 "favorite_count": result._json["favorite_count"], "retweet_count": result._json["retweet_count"], "created_at": result._json["created_at"]}
        tweets.append(tweet)
    tweets = list(filter(None, tweets))
    return tweets

# def gen_nonce(length):
#     if length < 1:
#         return ''
#     string = base64.b64encode(os.urandom(length), altchars=b'-_')
#     b64len = 4*math.floor(length)
#     if length % 3 == 1:
#         b64len += 2
#     elif length % 3 == 2:
#         b64len += 3
#     return string[0:b64len].decode()


# nonce_alphanumeric_filter = filter(str.isalnum, gen_nonce(32))
# nonce = "".join(nonce_alphanumeric_filter)

# parameter_string = urllib.parse.quote_plus(
#     f"expansions=author_id&max_results=10&tweet.fields=public_metrics,created_at&user.fields=username,location&oauth_consumer_key={consumer_key}&oauth_nonce={nonce}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1318622958&oauth_token={access_token}&oauth_version=1.0&query=ps5 -is:retweet".encode('utf8'))
# encoded_url = urllib.parse.quote_plus(
#     "https://api.twitter.com/2/tweets/search/recent".encode("utf8"))
# signature_base_string = f"GET&{encoded_url}&{parameter_string}"


# encoded_consumer_secret = urllib.parse.quote_plus(
#     f"{consumer_secret}".encode("utf8"))
# encoded_accesstoken_secret = urllib.parse.quote_plus(
#     f"{access_token_secret}".encode("utf8"))
# signing_key = f"{encoded_consumer_secret}&{encoded_accesstoken_secret}"


# def sign_request():
#     key = bytes(signing_key, 'utf8')

#     raw = bytes(signature_base_string,
#                 'utf8')   # as specified by OAuth

#     hashed = hmac.new(key, raw, sha1)

#     return str(base64.encodebytes(hashed.digest()))


# signature = sign_request()[2:-3]

# timestamp = round(round(time.time()), 10)
# print(f"consumer_key={consumer_key}")
# print(f"oauth_nonce={nonce}")
# print(f"oauth_signature={signature}")
# print(f"oauth_token={access_token}")
# print(f"oauth_timestamp={timestamp}")

headers = {'content-type': 'application/json',
           'Authorization': f'Bearer {os.getenv("BEARER_TOKEN")}'}


def text_analysis(search_term):
    alltweets = []
    count = 0
    search_query = f"{search_term}"
    api_endpoint = f"https://api.twitter.com/2/tweets/search/recent?query={search_query} -is:retweet&expansions=author_id&max_results=100&tweet.fields=public_metrics,created_at,lang&user.fields=username,location"
    response = requests.get(api_endpoint, headers=headers)
    res = response.json()
    tweets = res["data"]
    for tweet in tweets:
        if tweet["lang"] == "en":
            alltweets.append(tweet)
    count = len(alltweets)
    next_token = res["meta"]["next_token"]
    while count < 1000:
        response = requests.get(
            f'{api_endpoint}&next_token={next_token}', headers=headers)
        res = response.json()
        tweets = res["data"]
        for tweet in tweets:
            if tweet["lang"] == "en":
                alltweets.append(tweet)
        count = len(alltweets)
        next_token = res["meta"]["next_token"]
    return alltweets


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


# Trends
# trending = api.trends_available()
# print(trending)


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
