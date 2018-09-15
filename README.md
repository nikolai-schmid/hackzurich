The data was taken from the [Kaggle Competition](https://www.kaggle.com/daveianhickey/2000-16-traffic-flow-england-scotland-wales)

We have built a prototype app that uses a machine learning model that takes traffic, driver, road and weather data into account, predicts how dangerous a particular road segment is and alerts you.

The probability of a segment to be a dangerous zone was computed with neuronal networks. The area of the dangerous zone was computed by using GaussianProcessRegressor to smooth out the probabilities and provide a contour. 
