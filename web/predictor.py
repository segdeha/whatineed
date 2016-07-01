import statistics as stats
import numpy as np

def relevant_mean(user_predict, *args): # returns mean of data it deems relevant
    if isinstance(args[0], list):
        collected_data = args[0]
    else:
        collected_data = list(args)
    # add the initial user prediction to the beginning of our actual data
    all_data = [user_predict] + collected_data
    # user_predict and all args should be ints
    if not all(isinstance(item, int) for item in all_data):
            raise TypeError("predict() needs positive ints!")
            # is it worth checking for negative ints?
    if len(all_data) < 4: # if there's only 4 datapoints use all of them
        return int(stats.mean(all_data))
    elif len(all_data) < 10: # 10 is very arbitrary
        return int(np.percentile(all_data, 10)) # np.percentile excludes data outside the 80th percentile
    else: # only use the last ten data points
        return int(np.percentile(args[-10:], 10))
