The data was taken from the [Kaggle Competition](https://www.kaggle.com/daveianhickey/2000-16-traffic-flow-england-scotland-wales)

We have built a prototype app that uses a machine learning model that takes traffic, driver, road and weather data into account, predicts how dangerous a particular road segment is and alerts you.

The probability of a road segment being prone to accidents was computed with a deep neural network. The computed local 'danger levels' were then interpolated across the geography of a city network in Bayesian fashion, using Gaussian Process Regression.
