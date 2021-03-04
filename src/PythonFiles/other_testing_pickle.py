import search
import json
import sys
import pickle
import other_nltk_review_3 as source

if len(sys.argv) != 2:
    print('\n[Argument Error]: Post not passed as argument. Check usage \n')
    print('Usage: python filename "post"')
    sys.exit()

# unpickling the classifier model
classifier = pickle.load(open('model.pickle', 'rb'))

# loading the tweet passed from the command line (or API)
tweets = search.text_analysis(sys.argv[1])

for tweet in tweets:
    tweet["sentiment"] = classifier.classify(dict(
        [token, True] for token in source.remove_noise(source.word_tokenize(tweet["text"]))))

print(json.dumps(tweets))
sys.stdout.flush()
