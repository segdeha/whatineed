import statistics as stats
import numpy as np

outlist = [20, 15, 25, 2, 10000, 12, 14, 19]
reglist = [20, 15, 25, 30, 15, 12, 14, 19]

# deicded I don't need this function

def remove_outliers(data):
    # order list
    data = sorted(data)
    # if values at both ends aren't within two standard deviations of the pure mean (the mean that doesn't include them), take them out of the data

    acceptable_range = stats.stdev(data[1:-1])*2 # two standard deviations
    pure_median = stats.median(data[1:-1])

    # if datapoint distance from pure median > two stdevs from pure median then datapoint is outlier
    if abs(data[0] - pure_median) > acceptable_range: # idk if the first part of this is correct
        data.pop(0)
    if abs(data[-1] - pure_median) > acceptable_range: # idk if the first part of this is correct
        data.pop()
    return data
    # and return the mean


def predict(user_predict, *args):
    # user_predict and all args should be ints
    if not all(isinstance(item, int) for item in relevant_data):
            raise TypeError("predict() needs positive ints!")
            # is it worth checking for negative ints?
    all_data = [user_predict] + list(args)
    relevant_data = []
    if len(all_data) < 10: # 10 is very arbitrary
        relevant_data = all_data
    else: # relevant_data is the last ten data points minus any outliers
        relevant_data = args[-10:]
    # take the average of all relevant data and round down
    prediction = int(np.percentile(relevant_data, 10))
